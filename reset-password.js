document.addEventListener('DOMContentLoaded', () => {
    
    const resetPasswordForm = document.getElementById('resetPasswordForm');
    const submitBtn = document.getElementById('submitBtn');
    const spinner = document.getElementById('spinner');
    const btnText = document.querySelector('.btn-text');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    const passwordError = document.getElementById('passwordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
        resetPasswordForm.style.display = 'none';
        errorMessage.textContent = 'Invalid or missing password reset link. Please request a new one.';
        errorMessage.style.display = 'block';
        return;
    }

    // Form Submission Logic ---
    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Clear previous errors
            passwordError.style.display = 'none';
            confirmPasswordError.style.display = 'none';
            errorMessage.style.display = 'none';

            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            // --- Client-side validation ---
            let isValid = true;
            if (newPassword.length < 8) { // Basic validation, server has the full rules
                passwordError.textContent = 'Password must be at least 8 characters.';
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
            // --- End validation ---

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
                    // Throw an error to be caught by the catch block
                    throw new Error(data.message || 'An unknown error occurred.');
                }
                
                // For now, log the success message.
                console.log('Success:', data.message);
                
            } catch (error) {
                errorMessage.textContent = error.message;
                errorMessage.style.display = 'block';
            } finally {
                
                spinner.style.display = 'none';
                btnText.textContent = 'Reset Password';
                submitBtn.disabled = false;
            }
        });
    }

    // The logic for password visibility toggles added for UX.
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