document.addEventListener('DOMContentLoaded', function () {
    console.log('Enhanced login form loaded');

    // State management
    let isLoginMode = false;

    // Get all forms and elements
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const formTitle = document.getElementById('formTitle');
    const switchTitle = document.getElementById('switchTitle');
    const switchLink = document.getElementById('switchLink');
    const closeBtn = document.querySelector('.close-btn');

    // Form switching functionality
    function toggleFormMode() {
        isLoginMode = !isLoginMode;
        
        if (isLoginMode) {
            // Switch to login mode
            registerForm.style.display = 'none';
            loginForm.style.display = 'block';
            loginForm.classList.add('form-slide-enter');
            
            formTitle.textContent = 'Sign In';
            switchTitle.textContent = "Don't have an account?";
            switchLink.textContent = 'Create Account';
        } else {
            // Switch to register mode
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
            registerForm.classList.add('form-slide-enter');
            
            formTitle.textContent = 'Create an account';
            switchTitle.textContent = 'Already have an account?';
            switchLink.textContent = 'Sign In Now';
        }
        
        // Clear all errors and inputs when switching
        clearAllErrors();
        clearAllInputs();
        
        // Remove animation class after animation completes
        setTimeout(() => {
            loginForm.classList.remove('form-slide-enter');
            registerForm.classList.remove('form-slide-enter');
        }, 300);

        // Reinitialize password toggles and validation for the active form
        initPasswordToggles();
        initFormValidation();
    }

    // Add click event to switch link
    if (switchLink) {
        switchLink.addEventListener('click', function(e) {
            e.preventDefault();
            toggleFormMode();
        });
    }

    // Close button functionality
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            // Redirect to homepage or close modal
            window.location.href = 'index.html';
        });
    }

    // Password visibility toggle functionality
    function initPasswordToggles() {
        const passwordToggles = document.querySelectorAll('.password-toggle');

        // Remove existing event listeners to prevent duplicates
        passwordToggles.forEach(toggle => {
            const newToggle = toggle.cloneNode(true);
            toggle.parentNode.replaceChild(newToggle, toggle);
        });

        // Add event listeners to new elements
        const newPasswordToggles = document.querySelectorAll('.password-toggle');
        newPasswordToggles.forEach(toggle => {
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Find the password input in the same container
                const passwordField = this.closest('.password-field');
                const passwordInput = passwordField.querySelector('input[type="password"], input[type="text"]');
                const icon = this.querySelector('i');

                if (passwordInput && icon) {
                    if (passwordInput.type === 'password') {
                        passwordInput.type = 'text';
                        icon.className = 'ri-eye-off-line';
                    } else {
                        passwordInput.type = 'password';
                        icon.className = 'ri-eye-line';
                    }
                }
            });
        });
    }

    // Initialize password toggles
    initPasswordToggles();

    // Validation functions
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validatePassword(password) {
        const errors = [];
        
        if (password.length < 8) {
            errors.push('Password must be at least 8 characters long');
        }
        if (!/[A-Z]/.test(password)) {
            errors.push('Password must include at least one uppercase letter');
        }
        if (!/[a-z]/.test(password)) {
            errors.push('Password must include at least one lowercase letter');
        }
        if (!/[0-9]/.test(password)) {
            errors.push('Password must include at least one number');
        }
        
        return errors;
    }

    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.innerHTML = Array.isArray(message) 
                ? message.map(msg => `<div>${msg}</div>`).join('') 
                : message;
            errorElement.style.display = 'block';
        }
    }

    function hideError(elementId) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.innerHTML = '';
            errorElement.style.display = 'none';
        }
    }

    function showSuccess(elementId, message) {
        const successElement = document.getElementById(elementId);
        if (successElement) {
            successElement.textContent = message;
            successElement.style.display = 'block';
        }
    }

    function hideSuccess(elementId) {
        const successElement = document.getElementById(elementId);
        if (successElement) {
            successElement.textContent = '';
            successElement.style.display = 'none';
        }
    }

    function clearAllErrors() {
        const errorElements = document.querySelectorAll('.error-message, .success-message');
        errorElements.forEach(element => {
            element.style.display = 'none';
            element.innerHTML = '';
        });
    }

    function clearAllInputs() {
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            input.value = '';
        });
    }

    // Initialize form validation
    function initFormValidation() {
        // Remove existing event listeners by cloning elements
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            const newInput = input.cloneNode(true);
            input.parentNode.replaceChild(newInput, input);
        });

        // Get fresh references to elements after cloning
        const registerEmail = document.getElementById('registerEmail');
        const registerPassword = document.getElementById('registerPassword');
        const confirmPassword = document.getElementById('registerConfirmPassword');
        const loginEmail = document.getElementById('loginEmail');
        const loginPassword = document.getElementById('loginPassword');

        // Registration form validation
        if (registerEmail) {
            registerEmail.addEventListener('input', function() {
                const email = this.value.trim();
                if (!email) {
                    showError('registerEmailError', 'Email is required');
                } else if (!isValidEmail(email)) {
                    showError('registerEmailError', 'Please enter a valid email address');
                } else {
                    hideError('registerEmailError');
                }
            });
        }

        if (registerPassword) {
            registerPassword.addEventListener('input', function() {
                const password = this.value;
                const errors = validatePassword(password);
                
                if (!password) {
                    showError('registerPasswordError', 'Password is required');
                } else if (errors.length > 0) {
                    showError('registerPasswordError', errors);
                } else {
                    hideError('registerPasswordError');
                }

                // Also validate confirm password if it has a value
                if (confirmPassword && confirmPassword.value) {
                    validateConfirmPassword();
                }
            });
        }

        if (confirmPassword) {
            confirmPassword.addEventListener('input', validateConfirmPassword);
        }

        function validateConfirmPassword() {
            const password = registerPassword ? registerPassword.value : '';
            const confirm = confirmPassword.value;
            
            if (!confirm) {
                showError('confirmPasswordError', 'Please confirm your password');
            } else if (password !== confirm) {
                showError('confirmPasswordError', 'Passwords do not match');
            } else {
                hideError('confirmPasswordError');
            }
        }

        // Login form validation
        if (loginEmail) {
            loginEmail.addEventListener('input', function() {
                const email = this.value.trim();
                if (!email) {
                    showError('loginEmailError', 'Email is required');
                } else if (!isValidEmail(email)) {
                    showError('loginEmailError', 'Please enter a valid email address');
                } else {
                    hideError('loginEmailError');
                }
            });
        }

        if (loginPassword) {
            loginPassword.addEventListener('input', function() {
                const password = this.value;
                if (!password) {
                    showError('loginPasswordError', 'Password is required');
                } else {
                    hideError('loginPasswordError');
                }
            });
        }
    }

    // Initialize form validation
    initFormValidation();

    // Form submission handlers
    function showSpinner(spinnerId, buttonId) {
        const spinner = document.getElementById(spinnerId);
        const button = document.getElementById(buttonId);
        if (spinner && button) {
            spinner.classList.add('show');
            spinner.style.display = 'inline-block';
            button.disabled = true;
        }
    }

    function hideSpinner(spinnerId, buttonId) {
        const spinner = document.getElementById(spinnerId);
        const button = document.getElementById(buttonId);
        if (spinner && button) {
            spinner.classList.remove('show');
            spinner.style.display = 'none';
            button.disabled = false;
        }
    }

    // Registration form submission
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            hideError('registerError');
            hideSuccess('registerSuccess');
            
            const registerEmail = document.getElementById('registerEmail');
            const registerPassword = document.getElementById('registerPassword');
            const confirmPassword = document.getElementById('registerConfirmPassword');
            
            const email = registerEmail.value.trim();
            const password = registerPassword.value;
            const confirm = confirmPassword.value;
            
            // Validate all fields
            let hasErrors = false;
            
            if (!email) {
                showError('registerEmailError', 'Email is required');
                hasErrors = true;
            } else if (!isValidEmail(email)) {
                showError('registerEmailError', 'Please enter a valid email address');
                hasErrors = true;
            }
            
            if (!password) {
                showError('registerPasswordError', 'Password is required');
                hasErrors = true;
            } else {
                const passwordErrors = validatePassword(password);
                if (passwordErrors.length > 0) {
                    showError('registerPasswordError', passwordErrors);
                    hasErrors = true;
                }
            }
            
            if (!confirm) {
                showError('confirmPasswordError', 'Please confirm your password');
                hasErrors = true;
            } else if (password !== confirm) {
                showError('confirmPasswordError', 'Passwords do not match');
                hasErrors = true;
            }
            
            if (hasErrors) {
                return;
            }
            
            // Show loading state
            showSpinner('registerSpinner', 'registerBtn');
            
            // TODO: Replace with actual API call
            // Example API call structure:
            /*
            fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            })
            .then(response => response.json())
            .then(data => {
                hideSpinner('registerSpinner', 'registerBtn');
                if (data.success) {
                    showSuccess('registerSuccess', 'Account created successfully! Welcome to Cherus Sportswear!');
                    registerForm.reset();
                    // Optionally redirect after success
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 2000);
                } else {
                    showError('registerError', data.message || 'Registration failed. Please try again.');
                }
            })
            .catch(error => {
                hideSpinner('registerSpinner', 'registerBtn');
                showError('registerError', 'An error occurred. Please try again.');
                console.error('Registration error:', error);
            });
            */
            
            // For now, simulate API call
            setTimeout(() => {
                hideSpinner('registerSpinner', 'registerBtn');
                showSuccess('registerSuccess', 'Account created successfully! Welcome to Cherus Sportswear!');
                registerForm.reset();
                clearAllErrors();
            }, 2000);
        });
    }

    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            hideError('loginError');
            hideSuccess('loginSuccess');
            
            const loginEmail = document.getElementById('loginEmail');
            const loginPassword = document.getElementById('loginPassword');
            
            const email = loginEmail.value.trim();
            const password = loginPassword.value;
            
            // Validate fields
            let hasErrors = false;
            
            if (!email) {
                showError('loginEmailError', 'Email is required');
                hasErrors = true;
            } else if (!isValidEmail(email)) {
                showError('loginEmailError', 'Please enter a valid email address');
                hasErrors = true;
            }
            
            if (!password) {
                showError('loginPasswordError', 'Password is required');
                hasErrors = true;
            }
            
            if (hasErrors) {
                return;
            }
            
            // Show loading state
            showSpinner('loginSpinner', 'loginBtn');
            
            // TODO: Replace with actual API call
            // Example API call structure:
            /*
            fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            })
            .then(response => response.json())
            .then(data => {
                hideSpinner('loginSpinner', 'loginBtn');
                if (data.success) {
                    showSuccess('loginSuccess', 'Login successful! Redirecting...');
                    // Store authentication token if provided
                    if (data.token) {
                        localStorage.setItem('authToken', data.token);
                    }
                    // Redirect to dashboard or previous page
                    setTimeout(() => {
                        window.location.href = data.redirectUrl || 'dashboard.html';
                    }, 1500);
                } else {
                    showError('loginError', data.message || 'Invalid email or password. Please try again.');
                }
            })
            .catch(error => {
                hideSpinner('loginSpinner', 'loginBtn');
                showError('loginError', 'An error occurred. Please try again.');
                console.error('Login error:', error);
            });
            */
            
            // For now, simulate API call
            setTimeout(() => {
                hideSpinner('loginSpinner', 'loginBtn');
                showSuccess('loginSuccess', 'Login successful! Redirecting...');
                setTimeout(() => {
                    // Simulate redirect to dashboard
                    console.log('Redirecting to dashboard...');
                    // window.location.href = 'dashboard.html';
                }, 1500);
            }, 2000);
        });
    }

    console.log('All event listeners initialized successfully');
});