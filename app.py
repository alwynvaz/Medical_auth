from flask import Flask, render_template, request, redirect, url_for, session, flash
import psycopg2
from psycopg2 import sql
import bcrypt

app = Flask(__name__)
app.secret_key = 'your_secret_key'

conn = psycopg2.connect(
    dbname="medical_db",
    user="postgres",
    password="admin",
    host="localhost",
    port="5432"
)
cur = conn.cursor()

# Create table
cur.execute("""
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    username TEXT UNIQUE,
    password TEXT
)
""")
conn.commit()

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        action = request.form.get('action')
        username = request.form.get('username')
        password = request.form.get('password')

        if not action or not username or not password:
            flash('Missing required fields.', 'danger')
            return render_template('index.html')

        if action == 'login':
            cur.execute("SELECT * FROM users WHERE username = %s", (username,))
            user = cur.fetchone()

            if user and bcrypt.checkpw(password.encode('utf-8'), user[4].encode('utf-8')):
                session['username'] = user[3]
                flash('Login successful!', 'success')
                return redirect(url_for('dashboard'))
            else:
                flash('Invalid credentials.', 'danger')
                return render_template('index.html')

        elif action == 'register':
            name = request.form.get('name')
            email = request.form.get('email')

            if not name or not email:
                flash('All fields are required for registration.', 'danger')
                return render_template('index.html')

            # Check for existing username or email
            cur.execute("SELECT * FROM users WHERE username = %s OR email = %s", (username, email))
            existing_user = cur.fetchone()
            if existing_user:
                if existing_user[3] == username:
                    flash('Username already taken.', 'danger')
                elif existing_user[2] == email:
                    flash('Email already registered.', 'danger')
                return render_template('index.html')

            # Proceed with registration
            hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

            try:
                cur.execute("""
                    INSERT INTO users (name, email, username, password)
                    VALUES (%s, %s, %s, %s)
                """, (name, email, username, hashed_pw))
                conn.commit()
                flash('Registration successful!', 'success')
                return render_template('index.html')  # You can use a JS alert here in the template if needed
            except Exception as e:
                conn.rollback()
                flash('Registration failed. Please try again.', 'danger')
                return render_template('index.html')

    return render_template('index.html')

@app.route('/dashboard')
def dashboard():
    if 'username' not in session:
        return redirect(url_for('index'))
    return render_template('dashboard.html', username=session['username'])

@app.route('/logout')
def logout():
    session.clear()
    flash('Logged out successfully.', 'info')
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)
