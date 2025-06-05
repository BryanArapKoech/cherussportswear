// login.js
document.addEventListener('DOMContentLoaded', function () {
    console.log('Enhanced login form loaded');

    // Configuration
    const config = {
        apiBaseUrl: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? 'http://localhost:3000' 
            : 'https://your-production-api.com',
        redirectDelay: 1500
    };

    // State management
    let isLoginMode = false;

    // Get all forms and elements
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const formTitle = document.getElementById('formTitle');
    const switchTitle = document.getElementById('switchTitle');
    const switchLink = document.getElementById('switchLink');
    const closeBtn = document.querySelector('.close-btn');

    // Enhanced error handling for different HTTP status codes
    function getErrorMessage(error, isLogin = false) {
        const status = error.status;
        const defaultMessage = isLogin ? 'Login failed. Please try again.' : 'Registration failed. Please try again.';
        
        switch (status) {
            case 409:
                return 'An account with this email already exists. Please try signing in instead.';
            case 400:
                return error.data?.message || 'Please check your input and try again.';
            case 401:
                return 'Invalid email or password. Please try again.';
            case 429:
                return 'Too many attempts. Please wait a moment before trying again.';
            case 500:
                return 'Server error. Please try again later.';
            default:
                return error.data?.message || defaultMessage;
        }
    }

    // Safe storage helper (falls back to memory if localStorage unavailable)
    const storage = {
        setItem: function(key, value) {
            try {
                if (typeof Storage !== "undefined" && localStorage) {
                    localStorage.setItem(key, value);
                } else {
                    // Fallback to memory storage (for environments without localStorage)
                    window.tempStorage = window.tempStorage || {};
                    window.tempStorage[key] = value;
                }
            } catch (e) {
                console.warn('Storage not available, using memory fallback');
                window.tempStorage = window.tempStorage || {};
                window.tempStorage[key] = value;
            }
        },
        getItem: function(key) {
            try {
                if (typeof Storage !== "undefined" && localStorage) {
                    return localStorage.getItem(key);
                } else {
                    return window.tempStorage ? window.tempStorage[key] : null;
                }
            } catch (e) {
                return window.tempStorage ? window.tempStorage[key] : null;
            }
        }
    };

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
        if (!/[!@#$%^&*]/.test(password)) { 
            errors.push('Password must include at least one special character (e.g., !@#$%^&*).');
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
            
            // Get fresh references to input elements inside the submit handler

            
            const registerEmailInput = document.getElementById('registerEmail');
            const registerPasswordInput = document.getElementById('registerPassword');
            const confirmPasswordInput = document.getElementById('registerConfirmPassword');
            
            const email = registerEmailInput.value.trim();
            const password = registerPasswordInput.value;
            const confirmPasswordValue = confirmPasswordInput.value;
            
            // Client-side validation
            let hasErrors = false;
            
            // Email validation
            if (!email) {
                showError('registerEmailError', 'Email is required');
                hasErrors = true;
            } else if (!isValidEmail(email)) {
                showError('registerEmailError', 'Please enter a valid email address');
                hasErrors = true;
            } else {
                hideError('registerEmailError');
            }

            // Password validation
            const passwordValidationErrors = validatePassword(password);
            if (!password) {
                showError('registerPasswordError', 'Password is required');
                hasErrors = true;
            } else if (passwordValidationErrors.length > 0) {
                showError('registerPasswordError', passwordValidationErrors);
                hasErrors = true;
            } else {
                hideError('registerPasswordError');
            }
            
            // Confirm Password validation
            if (!confirmPasswordValue) {
                showError('confirmPasswordError', 'Please confirm your password');
                hasErrors = true;
            } else if (password && password !== confirmPasswordValue) {
                showError('confirmPasswordError', 'Passwords do not match');
                hasErrors = true;
            } else if (password && password === confirmPasswordValue) {
                hideError('confirmPasswordError');
            }

            if (hasErrors) {
                return;
            }

            showSpinner('registerSpinner', 'registerBtn');
            
            fetch(`${config.apiBaseUrl}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        const error = new Error(errorData.message || 'Server responded with an error');
                        error.data = errorData;
                        error.status = response.status;
                        throw error;
                    }).catch(jsonParseError => {
                        const error = new Error(`HTTP error! Status: ${response.status}`);
                        error.status = response.status;
                        throw error;
                    });
                }
                return response.json();
            })
            .then(data => {
                hideSpinner('registerSpinner', 'registerBtn');
                if (data.success) {
                    showSuccess('registerSuccess', data.message || 'Account created successfully! Welcome to Cherus Sportswear!');
                    registerForm.reset();
                    hideError('registerEmailError');
                    hideError('registerPasswordError');
                    hideError('confirmPasswordError');
                    
                    // Auto-switch to login after successful registration
                    setTimeout(() => {
                        if (!isLoginMode) {
                            toggleFormMode();
                            showSuccess('loginSuccess', 'Registration successful! You can now sign in.');
                        }
                    }, 2000);
                } else {
                    const errorMessage = getErrorMessage(data, false);
                    showError('registerError', errorMessage);
                }
            })
            .catch(error => {
                hideSpinner('registerSpinner', 'registerBtn');
                const errorMessage = getErrorMessage(error, false);
                showError('registerError', errorMessage);
                console.error('Registration error:', error);
                
                // Special handling for duplicate email - suggest switching to login
                if (error.status === 409) {
                    setTimeout(() => {
                        const switchToLogin = confirm('Would you like to login instead?');
                        if (switchToLogin && !isLoginMode) {
                            toggleFormMode();
                            // Pre-fill the email
                            const loginEmailInput = document.getElementById('loginEmail');
                            if (loginEmailInput) {
                                loginEmailInput.value = email;
                            }
                        }
                    }, 1000);
                }
            });
        });
    }

    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            hideError('loginError');
            hideSuccess('loginSuccess');
            
            const loginEmailInput = document.getElementById('loginEmail');
            const loginPasswordInput = document.getElementById('loginPassword');
            
            const email = loginEmailInput.value.trim();
            const password = loginPasswordInput.value;
            
            let hasErrors = false;
            
            if (!email) {
                showError('loginEmailError', 'Email is required');
                hasErrors = true;
            } else if (!isValidEmail(email)) {
                showError('loginEmailError', 'Please enter a valid email address');
                hasErrors = true;
            } else {
                hideError('loginEmailError');
            }
            
            if (!password) {
                showError('loginPasswordError', 'Password is required');
                hasErrors = true;
            } else {
                hideError('loginPasswordError');
            }
            
            if (hasErrors) {
                return;
            }
            
            showSpinner('loginSpinner', 'loginBtn');

            const apiBaseUrl = 'http://localhost:3000'; 

            fetch(`${apiBaseUrl}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        const error = new Error(errorData.message || 'Server responded with an error');
                        error.data = errorData;
                        error.status = response.status;
                        throw error;
                    }).catch(jsonParseError => {
                        const error = new Error(`HTTP error! Status: ${response.status}`);
                        error.status = response.status;
                        throw error;
                    });
                }
                return response.json();
            })
            .then(data => {
                hideSpinner('loginSpinner', 'loginBtn');
                if (data.success) {
                    showSuccess('loginSuccess', data.message || 'Login successful! Redirecting...');
                    if (data.token) {
                        storage.setItem('authToken', data.token);
                    }
                    setTimeout(() => {
                        window.location.href = data.redirectUrl || 'index.html';
                    }, config.redirectDelay);
                } else {
                    const errorMessage = getErrorMessage(data, true);
                    showError('loginError', errorMessage);
                }
            })
            .catch(error => {
                hideSpinner('loginSpinner', 'loginBtn');
                const errorMessage = getErrorMessage(error, true);
                showError('loginError', errorMessage);
                console.error('Login error:', error);
            });
        });
    }

    console.log('All event listeners initialized successfully');
});