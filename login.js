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
}); 