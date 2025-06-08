document.addEventListener('DOMContentLoaded', () => {
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const submitBtn = document.getElementById('submitBtn');
    const spinner = document.getElementById('spinner');
    const btnText = document.querySelector('.btn-text'); // Target the span for text
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');

    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Clear previous messages
            successMessage.style.display = 'none';
            errorMessage.style.display = 'none';

            // Show spinner and disable button
            spinner.style.display = 'inline-block';
            btnText.textContent = 'Sending...'; // Change only the text
            submitBtn.disabled = true;

            const email = document.getElementById('email').value;
            const apiBaseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
                ? 'http://localhost:3000'
                : 'https://your-production-api.com';

            try {
                const response = await fetch(`${apiBaseUrl}/api/password/forgot`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: email }),
                });

                const data = await response.json();

                if (response.ok) {
                    // Hide the form itself for a cleaner UI
                    forgotPasswordForm.style.display = 'none';
                    // Display the success message
                    successMessage.textContent = data.message;
                    successMessage.style.display = 'block';
                } else {
                    // This handles server validation errors
                    throw new Error(data.message || 'An unexpected error occurred.');
                }

            } catch (error) {
                errorMessage.textContent = error.message;
                errorMessage.style.display = 'block';
            } finally {
                // Always reset the button state in case of error
                spinner.style.display = 'none';
                btnText.textContent = 'Send Reset Link';
                submitBtn.disabled = false;
            }
        });
    }
});