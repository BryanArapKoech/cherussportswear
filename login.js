document.addEventListener('DOMContentLoaded', function () {
    console.log('login.js loaded');

    // Core HTML Input Elements
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    const passwordConfirmInput = document.getElementById('registerConfirmPassword');
    const passwordVisibilityToggle = document.querySelector('.password-toggle');
    const submitButton = document.getElementById('loginBtn');
    const loginForm = document.getElementById('loginForm');

    // Error Display Elements
    const emailErrorElement = document.getElementById('loginEmailError');
    const passwordErrorElement = document.getElementById('loginPasswordError');
    const passwordConfirmErrorElement = document.getElementById('confirmPasswordError');
    const formErrorElement = document.getElementById('loginError');

    // Test element selection
    console.log('Email input:', emailInput?.id);
    console.log('Password input:', passwordInput?.id);
    console.log('Password confirm input:', passwordConfirmInput?.id);
    console.log('Password visibility toggle:', passwordVisibilityToggle?.className);
    console.log('Submit button:', submitButton?.id);
    console.log('Login form:', loginForm?.id);

    // Test error element selection
    console.log('Email error:', emailErrorElement?.id);
    console.log('Password error:', passwordErrorElement?.id);
    console.log('Password confirm error:', passwordConfirmErrorElement?.id);
    console.log('Form error:', formErrorElement?.id);

    // --- Email Validation Functions ---
    function getEmailValue() {
        return emailInput.value.trim();
    }

    function isValidEmailFormat(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function displayEmailError(message) {
        if (emailErrorElement) {
            emailErrorElement.textContent = message;
            emailErrorElement.style.display = 'block';
        }
    }

    function clearEmailError() {
        if (emailErrorElement) {
            emailErrorElement.textContent = '';
            emailErrorElement.style.display = 'none';
        }
    }

    // Real-time email validation
    if (emailInput) {
        emailInput.addEventListener('input', function () {
            const email = getEmailValue();

            if (!email) {
                displayEmailError('Email is required');
            } else if (!isValidEmailFormat(email)) {
                displayEmailError('Please enter a valid email address');
            } else {
                clearEmailError();
            }
        });
    }

    // Test email validation functions
    console.log('Initial email value:', getEmailValue());
    console.log('Valid email test:', isValidEmailFormat('test@example.com')); // Should be true
    console.log('Invalid email test:', isValidEmailFormat('test')); // Should be false

    // Test error display and clear
    displayEmailError('Test error message'); // Should display in the UI
    setTimeout(() => {
        clearEmailError(); // Should clear the error after 2 seconds
    }, 2000);
}); 