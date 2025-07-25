// DOM elements
const formTitle = document.getElementById('form-title');
const formSubtitle = document.getElementById('form-subtitle');
const toggleText = document.getElementById('toggle-text');
const toggleLink = document.getElementById('toggle-link');
const formAction = document.getElementById('form-action');
const extraFields = document.getElementById('extra-fields');
const submitBtn = document.querySelector('.submit-btn');
const btnText = document.querySelector('.btn-text');
const loading = document.querySelector('.loading');

let isLogin = true;

// Toggle login/register mode
toggleLink.addEventListener('click', (e) => {
    e.preventDefault();

    formTitle.style.transform = 'translateY(-10px)';
    formTitle.style.opacity = '0';

    setTimeout(() => {
        isLogin = !isLogin;

        if (isLogin) {
            formTitle.textContent = 'Login';
            formSubtitle.textContent = 'Access your medical dashboard';
            toggleText.textContent = "Don't have an account?";
            toggleLink.textContent = 'Register';
            formAction.value = 'login';
            btnText.textContent = 'Sign In';
            extraFields.classList.remove('active');

            setTimeout(() => {
                extraFields.innerHTML = '';
            }, 300);
        } else {
            formTitle.textContent = 'Register';
            formSubtitle.textContent = 'Create your medical account';
            toggleText.textContent = 'Already have an account?';
            toggleLink.textContent = 'Login';
            formAction.value = 'register';
            btnText.textContent = 'Create Account';

            extraFields.innerHTML = `
                <div class="form-group">
                    <input type="text" name="name" placeholder=" " required>
                    <label>Full Name</label>
                </div>
                <div class="form-group">
                    <input type="email" name="email" placeholder=" " required>
                    <label>Email Address</label>
                </div>
            `;

            setTimeout(() => {
                extraFields.classList.add('active');
            }, 100);
        }

        formTitle.style.transform = 'translateY(0)';
        formTitle.style.opacity = '1';
    }, 200);
});

// Submit form with loading animation
document.getElementById('auth-form').addEventListener('submit', (e) => {
    // Uncomment below line if you want to prevent actual submission for testing
    // e.preventDefault();

    btnText.style.opacity = '0';
    loading.style.display = 'block';
    submitBtn.style.pointerEvents = 'none';

    setTimeout(() => {
        btnText.style.opacity = '1';
        loading.style.display = 'none';
        submitBtn.style.pointerEvents = 'auto';
    }, 2000);
});

// Input hover animations
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.style.transform = 'translateY(-2px)';
    });
    input.addEventListener('blur', () => {
        input.parentElement.style.transform = 'translateY(0)';
    });
});

// Hide flash messages automatically
window.addEventListener('DOMContentLoaded', () => {
    const flashMessages = document.querySelectorAll('.flash-message');
    flashMessages.forEach(msg => {
        setTimeout(() => {
            msg.style.opacity = '0';
            msg.style.transform = 'translateY(-20px)';
            setTimeout(() => msg.remove(), 500); // Remove after animation
        }, 3000); // 3 seconds
    });
});

// Enable scroll after load
window.addEventListener('load', () => {
    document.body.style.overflow = 'auto';
});
