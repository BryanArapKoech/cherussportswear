// public/js/auth.js

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const mfaGroup = document.getElementById('mfa-group');
    const errorMessage = document.getElementById('error-message');
    
    let mfaToken = null; // To store the temporary MFA token

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessage.textContent = ''; // Clear previous errors

        // If the MFA field is visible, we are in the second step of login
        if (mfaGroup.style.display !== 'none') {
            const totpCode = document.getElementById('totp_code').value;
            handleMfaLogin(totpCode);
        } else {
            // Otherwise, it's the first step (password login)
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            handlePasswordLogin(email, password);
        }
    });

    async function handlePasswordLogin(email, password) {
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Login failed');
            }

            if (data.mfa_required) {
                // MFA is required. Show the MFA field and store the temp token.
                mfaToken = data.mfa_token;
                mfaGroup.style.display = 'block';
            } else {
                // No MFA. Login is complete.
                localStorage.setItem('admin_token', data.token);
                window.location.href = '/products.html'; // Redirect to product page
            }
        } catch (err) {
            errorMessage.textContent = err.message;
        }
    }

    async function handleMfaLogin(totpCode) {
        try {
            const res = await fetch('/api/auth/login-mfa', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mfa_token: mfaToken, totp_code: totpCode })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'MFA verification failed');
            }

            // MFA successful. Login is complete.
            localStorage.setItem('admin_token', data.token);
            window.location.href = '/products.html';
        } catch (err) {
            errorMessage.textContent = err.message;
        }
    }
});