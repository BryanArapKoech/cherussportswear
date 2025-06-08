document.addEventListener('DOMContentLoaded', () => {
    const resetPasswordForm = document.getElementById('resetPasswordForm');
    const submitBtn = document.getElementById('submitBtn');
    const spinner = document.getElementById('spinner');
    const btnText = document.querySelector('.btn-text');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    const passwordError = document.getElementById('passwordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');
    const backToLoginLink = document.getElementById('backToLoginLink');

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
        resetPasswordForm.style.display = 'none';
        errorMessage.textContent = 'Invalid or missing password reset link. Please request a new one.';
        errorMessage.style.display = 'block';
        return;
    }

    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            passwordError.style.display = 'none';
            confirmPasswordError.style.display = 'none';
            errorMessage.style.display = 'none';

            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            let isValid = true;
            if (newPassword.length < 8 || !/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword) || !/[!@#$%^&*]/.test(newPassword)) {
                passwordError.textContent = 'Password does not meet complexity requirements.';
                passwordError.style.display = 'block';
                isValid = false;
            }
            if (newPassword !== confirmPassword) {
                confirmPasswordError.textContent = 'Passwords do not match.';
                confirmPasswordError.style.display = 'block';
                isValid = false;
            }

            if (!isValid) {
                return;
            }

            spinner.style.display = 'inline-block';
            btnText.textContent = 'Resetting...';
            submitBtn.disabled = true;

            const apiBaseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
                ? 'http://localhost:3000'
                : 'https://your-production-api.com';

            try {
                const response = await fetch(`${apiBaseUrl}/api/password/reset`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        token: token,
                        password: newPassword,
                    }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'An unknown error occurred.');
                }
                
                resetPasswordForm.style.display = 'none';
                successMessage.textContent = 'Password reset successfully! Redirecting to login...';
                successMessage.style.display = 'block';
                backToLoginLink.style.display = 'flex';

                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 3000);
                
            } catch (error) {
                errorMessage.textContent = error.message;
                errorMessage.style.display = 'block';
                spinner.style.display = 'none';
                btnText.textContent = 'Reset Password';
                submitBtn.disabled = false;
            }
        });
    }

    const passwordToggles = document.querySelectorAll('.password-toggle');
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const passwordField = this.closest('.password-field');
            const passwordInput = passwordField.querySelector('input');
            const icon = this.querySelector('i');

            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.className = 'ri-eye-off-line';
            } else {
                passwordInput.type = 'password';
                icon.className = 'ri-eye-line';
            }
        });
    });
});