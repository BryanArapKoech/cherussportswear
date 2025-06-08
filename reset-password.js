document.addEventListener('DOMContentLoaded', () => {
    const resetPasswordForm = document.getElementById('resetPasswordForm');
    const submitBtn = document.getElementById('submitBtn');
    const errorMessage = document.getElementById('errorMessage');

    // --- Task 15: Retrieve Token from URL ---
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
        // If no token is found in the URL, the form is useless.
        // Disable the form and show a permanent error message.
        resetPasswordForm.style.display = 'none'; // Hide the form
        errorMessage.textContent = 'Invalid or missing password reset link. Please request a new one.';
        errorMessage.style.display = 'block';
        return; // Stop further execution
    }
    
    // For now, we'll just log the token to confirm it was retrieved.
    console.log('Password reset token found:', token);

    // The logic for form submission (Task 16) will be added later.
    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Form submission prevented for now.');
            // We will implement the API call in the next task.
        });
    }

    // The logic for password visibility toggles can be added now for UX.
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