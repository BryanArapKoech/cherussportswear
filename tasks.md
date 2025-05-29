# Granular Step-by-Step Plan for `login.js` (Real-World with `sessionStorage`)

**Assumptions (Real-World Context):**

- An existing `login.html` file contains:
  - Email input: `<input type="email" id="emailInput">`
  - Password input: `<input type="password" id="passwordInput">`
  - Password confirmation input: `<input type="password" id="passwordConfirmInput">`
  - Password visibility toggle button/element: `<button id="passwordVisibilityToggle">Show</button>`
  - Submit button: `<button type="submit" id="submitButton">Login</button>`
  - A `form` element wrapping the inputs and submit button: `<form id="loginForm">`
  - Empty `<span>` or `<div>` elements for displaying validation errors:
    - Email error: `<span id="emailError" class="error-message"></span>`
    - Password error: `<span id="passwordError" class="error-message"></span>`
    - Password confirmation error: `<span id="passwordConfirmError" class="error-message"></span>`
    - General form error: `<div id="formError" class="error-message"></span>`
- Basic CSS is in place to make error messages visible (e.g., `error-message { color: red; display: block; }`).
- A backend API endpoint for login exists at `/api/auth/login`.
  - It accepts `POST` requests with a JSON body: `{"email": "user@example.com", "password": "yourpassword"}`.
  - On successful login (e.g., HTTP 200 OK), it returns JSON: `{"token": "your_jwt_token", "user": {"id": "123", "name": "Test User", "email": "user@example.com"}}`.
  - On failure (e.g., HTTP 400, 401, 500), it returns JSON: `{"message": "Error description string"}`.
- **Client-Side Security Choice:** JWT will be stored using `sessionStorage`.
  - _Security Note: `sessionStorage` is vulnerable to XSS attacks during the active session, though the token is cleared when the browser tab/session ends. For higher security, the architecture document mentions HttpOnly cookies (set by the backend) or more advanced in-memory solutions. This plan implements the user's choice of `sessionStorage` for the client-side JWT handling._

---

## Phase 0: Initial Setup & Element Selection

### Task 0.1: Create `login.js` file and basic structure.

- **Start:** No `login.js` file exists.
- **End:** `login.js` file created with a `DOMContentLoaded` event listener.
- **Concern:** Basic script setup.
- **Test:** `console.log('login.js loaded');` inside `DOMContentLoaded`.

### Task 0.2: Select Core HTML Input Elements.

- **Start:** `login.js` setup. HTML elements exist.
- **End:** JS variables (`emailInput`, `passwordInput`, `passwordConfirmInput`, `loginForm`, `submitButton`, `passwordVisibilityToggle`) reference DOM elements.
- **Concern:** Accessing DOM elements.
- **Test:** `console.log` each variable (e.g., `console.log(emailInput.id)`).

### Task 0.3: Select Error Display Elements.

- **Start:** Core input elements selected. Error display elements exist.
- **End:** JS variables (`emailErrorElement`, `passwordErrorElement`, `passwordConfirmErrorElement`, `formErrorElement`) reference error display DOM elements.
- **Concern:** Accessing error display DOM elements.
- **Test:** `console.log` each variable (e.g., `console.log(emailErrorElement.id)`).

---

## Phase 1: Email Validation Implementation

### Task 1.1: Create `getEmailValue()` function.

- **Start:** `emailInput` variable references the email input DOM element.
- **End:** A function `getEmailValue()` exists that returns the current trimmed value of the `emailInput`.
- **Concern:** Retrieving email input data.
- **Test:** Call `getEmailValue()` and log its output after typing in the email field.

### Task 1.2: Create `isValidEmailFormat(email)` function.

- **Start:** Basic JavaScript understanding.
- **End:** A function `isValidEmailFormat(email)` exists. It uses a regular expression (e.g., `/\S+@\S+\.\S+/`) to check email format and returns `true` or `false`.
- **Concern:** Implementing email format validation logic.
- **Test:** `console.log(isValidEmailFormat("test@example.com"))` (true), `console.log(isValidEmailFormat("test"))` (false).

### Task 1.3: Create `displayEmailError(message)` function.

- **Start:** `emailErrorElement` variable references the email error display DOM element.
- **End:** A function `displayEmailError(message)` exists that sets the `textContent` of `emailErrorElement` to the message.
- **Concern:** Displaying email validation feedback.
- **Test:** Call `displayEmailError("Test email error")` and verify the message appears.

### Task 1.4: Create `clearEmailError()` function.

- **Start:** `emailErrorElement` variable references the email error display DOM element.
- **End:** A function `clearEmailError()` exists that clears the `textContent` of `emailErrorElement`.
- **Concern:** Clearing email validation feedback.
- **Test:** Call `displayEmailError("Test")`, then `clearEmailError()` and verify.

### Task 1.5: Implement real-time email validation.

- **Start:** `emailInput`, `getEmailValue`, `isValidEmailFormat`, `displayEmailError`, `clearEmailError` functions exist.
- **End:** An event listener on `emailInput` (e.g., `input` event) validates email format in real-time, showing/clearing errors.
- **Concern:** Providing real-time feedback for email validation.
- **Test:** Type valid/invalid emails and observe error messages.

---

## Phase 2: Password Strength Validation Implementation

### Task 2.1: Create `getPasswordValue()` function.

- **Start:** `passwordInput` variable references the password input DOM element.
- **End:** A function `getPasswordValue()` exists that returns the current value of `passwordInput`.
- **Concern:** Retrieving password input data.
- **Test:** Call `getPasswordValue()` and log output after typing.

### Task 2.2: Create `isPasswordLongEnough(password)` function.

- **Start:** Basic JavaScript understanding.
- **End:** Function `isPasswordLongEnough(password)` returns `true` if `password.length >= 8`, else `false`.
- **Concern:** Implementing password length rule (min 8 chars).
- **Test:** `console.log(isPasswordLongEnough("1234567"))` (false), `console.log(isPasswordLongEnough("12345678"))` (true).

### Task 2.3: Create `passwordHasUppercase(password)` function.

- **Start:** Basic JavaScript understanding.
- **End:** Function `passwordHasUppercase(password)` uses regex (e.g., `/[A-Z]/`) to check for an uppercase letter, returns `true`/`false`.
- **Concern:** Implementing password uppercase rule.
- **Test:** `console.log(passwordHasUppercase("abc"))` (false), `console.log(passwordHasUppercase("Abc"))` (true).

### Task 2.4: Create `passwordHasLowercase(password)` function.

- **Start:** Basic JavaScript understanding.
- **End:** Function `passwordHasLowercase(password)` uses regex (e.g., `/[a-z]/`) to check for a lowercase letter, returns `true`/`false`.
- **Concern:** Implementing password lowercase rule.
- **Test:** `console.log(passwordHasLowercase("ABC"))` (false), `console.log(passwordHasLowercase("aBC"))` (true).

### Task 2.5: Create `passwordHasDigit(password)` function.

- **Start:** Basic JavaScript understanding.
- **End:** Function `passwordHasDigit(password)` uses regex (e.g., `/[0-9]/`) to check for a digit, returns `true`/`false`.
- **Concern:** Implementing password digit rule.
- **Test:** `console.log(passwordHasDigit("abc"))` (false), `console.log(passwordHasDigit("a1c"))` (true).

### Task 2.6: Create `displayPasswordError(messages)` function.

- **Start:** `passwordErrorElement` variable references the password error display DOM element.
- **End:** Function `displayPasswordError(messages)` takes an array of error strings and sets them as `innerHTML` of `passwordErrorElement`.
- **Concern:** Displaying detailed password validation feedback.
- **Test:** Call `displayPasswordError(["Too short", "Needs uppercase"])` and verify.

### Task 2.7: Create `clearPasswordError()` function.

- **Start:** `passwordErrorElement` variable references the password error display DOM element.
- **End:** Function `clearPasswordError()` clears `innerHTML` of `passwordErrorElement`.
- **Concern:** Clearing password validation feedback.
- **Test:** Call `displayPasswordError(["Test"])`, then `clearPasswordError()`.

### Task 2.8: Implement real-time password strength validation.

- **Start:** `passwordInput`, `getPasswordValue`, all strength rule functions, `displayPasswordError`, `clearPasswordError` exist.
- **End:** An event listener on `passwordInput` (e.g., `input` event) validates all strength rules in real-time, showing/clearing errors.
- **Concern:** Providing real-time feedback for password strength.
- **Test:** Type various passwords and observe error messages updating.

---

## Phase 3: Password Confirmation Validation

### Task 3.1: Create `getPasswordConfirmValue()` function.

- **Start:** `passwordConfirmInput` variable references the password confirmation input DOM element.
- **End:** Function `getPasswordConfirmValue()` returns current value of `passwordConfirmInput`.
- **Concern:** Retrieving password confirmation input data.
- **Test:** Call `getPasswordConfirmValue()` and log output.

### Task 3.2: Create `doPasswordsMatch(password, confirmation)` function.

- **Start:** Basic JavaScript understanding.
- **End:** Function `doPasswordsMatch(password, confirmation)` returns `true` if `password === confirmation`, else `false`.
- **Concern:** Logic for checking if passwords match.
- **Test:** `console.log(doPasswordsMatch("abc", "abc"))` (true), `console.log(doPasswordsMatch("abc", "def"))` (false).

### Task 3.3: Create `displayPasswordConfirmError(message)` function.

- **Start:** `passwordConfirmErrorElement` variable references the password confirmation error DOM element.
- **End:** Function `displayPasswordConfirmError(message)` sets `textContent` of `passwordConfirmErrorElement`.
- **Concern:** Displaying password confirmation feedback.
- **Test:** Call `displayPasswordConfirmError("Passwords do not match")`.

### Task 3.4: Create `clearPasswordConfirmError()` function.

- **Start:** `passwordConfirmErrorElement` variable references the password confirmation error DOM element.
- **End:** Function `clearPasswordConfirmError()` clears `textContent` of `passwordConfirmErrorElement`.
- **Concern:** Clearing password confirmation feedback.
- **Test:** Call `displayPasswordConfirmError("Test")`, then `clearPasswordConfirmError()`.

### Task 3.5: Implement real-time password confirmation validation.

- **Start:** `passwordConfirmInput`, `passwordInput`, `getPasswordValue`, `getPasswordConfirmValue`, `doPasswordsMatch`, `displayPasswordConfirmError`, `clearPasswordConfirmError` functions exist.
- **End:** Event listeners on `passwordConfirmInput` and `passwordInput` (e.g., `input` event) validate confirmation in real-time.
- **Concern:** Providing real-time feedback for password confirmation.
- **Test:** Type matching/non-matching passwords and observe error messages.

---

## Phase 4: Password Visibility Toggle

### Task 4.1: Implement `togglePasswordInputsVisibility()` function.

- **Start:** `passwordInput`, `passwordConfirmInput`, `passwordVisibilityToggle` elements selected.
- **End:** Function `togglePasswordInputsVisibility()` toggles `type` of `passwordInput` and `passwordConfirmInput` between "password" and "text", and updates `passwordVisibilityToggle.textContent` ("Show"/"Hide").
- **Concern:** Toggling visibility of password fields and updating toggle button text.
- **Test:** Call function and observe fields/button text. Call again to revert.

### Task 4.2: Attach event listener to password visibility toggle.

- **Start:** `passwordVisibilityToggle` element selected, `togglePasswordInputsVisibility` function exists.
- **End:** An event listener on `passwordVisibilityToggle` (`click` event) calls `togglePasswordInputsVisibility()`.
- **Concern:** Enabling user interaction for password visibility toggle.
- **Test:** Click toggle button and verify visibility/text change.

---

## Phase 5: Basic State Management (Client-Side)

### Task 5.1: Initialize basic state variables.

- **Start:** Script setup complete.
- **End:** Global (within `DOMContentLoaded` scope) variables `isLoading = false;` and `formSubmissionError = null;` defined.
- **Concern:** Basic client-side state for UI updates.
- **Test:** `console.log(isLoading, formSubmissionError)`.

### Task 5.2: Create `setLoadingState(loading)` function.

- **Start:** `isLoading` variable and `submitButton` element exist.
- **End:** Function `setLoadingState(loading)` updates `isLoading`, disables/enables `submitButton`, and optionally changes `submitButton.textContent` (e.g., "Logging in...").
- **Concern:** Managing UI loading state, preventing multiple submissions.
- **Test:** Call `setLoadingState(true)` and check button. Call `setLoadingState(false)` and check.

### Task 5.3: Create `displayFormSubmissionError(message)` function.

- **Start:** `formErrorElement` and `formSubmissionError` variable exist.
- **End:** Function `displayFormSubmissionError(message)` updates `formSubmissionError` and sets `formErrorElement.textContent`. Clears if message is null/empty.
- **Concern:** Displaying global form errors (e.g., from API).
- **Test:** Call `displayFormSubmissionError("API Error")`. Call `displayFormSubmissionError(null)`.

---

## Phase 6: Service Integration Layer (Real API Calls)

### Task 6.1: Define API Configuration.

- **Start:** Basic script setup.
- **End:** Configuration constants like `const LOGIN_ENDPOINT = '/api/auth/login';` defined.
- **Concern:** Centralizing API endpoint configuration.
- **Test:** `console.log(LOGIN_ENDPOINT)`.

### Task 6.2: Create `loginApiService(email, password)` function (using `fetch`).

- **Start:** `LOGIN_ENDPOINT` defined. Understanding of `fetch` API.
- **End:** `async` function `loginApiService(email, password)` constructs request body and uses `fetch` to `POST` to `LOGIN_ENDPOINT`. Returns the `fetch` promise.
- **Concern:** Initiating network request to login endpoint.
- **Test:** Call `loginApiService('test@example.com', 'password').then(response => console.log('Raw fetch response:', response))`. Check browser network tab.

### Task 6.3: Enhance `loginApiService` to handle HTTP OK status and parse JSON.

- **Start:** `loginApiService` makes a fetch call.
- **End:** `loginApiService` now `await`s `fetch`, checks `response.ok`. If ok, `await response.json()` and returns parsed data.
- **Concern:** Basic success response handling and JSON parsing.
- **Test:** With running backend: `loginApiService('correct@example.com', 'correctPass').then(data => console.log('Parsed success data:', data))`.

### Task 6.4: Enhance `loginApiService` to handle HTTP errors and extract error messages.

- **Start:** `loginApiService` checks `response.ok`.
- **End:** If `!response.ok`, `loginApiService` attempts `await response.json()` for error message, uses `response.statusText` as fallback, and throws ` { status: response.status, message: parsedError.message || response.statusText }`.
- **Concern:** Extracting error information from failed API responses.
- **Test:** With running backend: `loginApiService('wrong@example.com', 'wrongPass').catch(error => console.error('Caught API error:', error))`.

---

## Phase 7: Form Submission Data Flow & Full Validation (Connecting to Real Service)

### Task 7.1: Create `validateForm()` function.

- **Start:** All individual validation functions and error display functions exist.
- **End:** Function `validateForm()` consolidates all field validations (email, password strength, password confirmation), displays errors, and returns `true` if all pass, else `false`.
- **Concern:** Consolidating all field validations before submission.
- **Test:** Call `validateForm()` with various valid/invalid inputs, checking return value and UI errors.

### Task 7.2: Implement `handleFormSubmit(event)` function (Part 1 - Validation).

- **Start:** `loginForm`, `validateForm`, `setLoadingState`, `displayFormSubmissionError` functions exist.
- **End:** Function `handleFormSubmit(event)` calls `event.preventDefault()`, clears previous form errors, calls `validateForm()`. If `validateForm()` is false, returns early.
- **Concern:** Handling form submission event, initial validation step.
- **Test:** Attach `handleFormSubmit` to `loginForm.addEventListener('submit', handleFormSubmit)`. Submit with invalid data; form should not proceed.

### Task 7.3: Update `handleFormSubmit(event)` (Part 2 - Real API Call & State).

- **Start:** `handleFormSubmit` (Part 1) exists, `loginApiService`, `setLoadingState` functions exist.
- **End:** Inside `handleFormSubmit`, after `validateForm()` passes: calls `setLoadingState(true)`, retrieves email/password, calls `loginApiService(email, password)`. Includes `.finally(() => setLoadingState(false))`.
- **Concern:** Calling the service and managing loading state during API call.
- **Test:** Submit with valid data (backend ready). Verify loading state, network call, console logs, and loading state reverts.

---

## Phase 8: Frontend Success and Error Handling (Real API Responses)

### Task 8.1: Update `handleLoginSuccess(apiResponse)` function.

- **Start:** `displayFormSubmissionError` exists.
- **End:** `handleLoginSuccess(apiResponse)` logs response, clears form errors. (JWT storage in Phase 9, Redirection in Phase 10). For now, `alert("Login Successful! Welcome, " + (apiResponse.user ? apiResponse.user.name : 'User') + ".");`. Optionally clears form fields.
- **Concern:** Processing successful authentication response from the real API.
- **Test:** Manually call with a sample successful API response object.

### Task 8.2: Update `handleLoginFailure(apiError)` function.

- **Start:** `displayFormSubmissionError` function exists.
- **End:** `handleLoginFailure(apiError)` logs error, calls `displayFormSubmissionError(apiError.message || "Login failed. Please try again.")`.
- **Concern:** Processing failed authentication response from the real API.
- **Test:** Manually call with a sample API error object (e.g., `{status: 401, message: "Invalid credentials"}`).

### Task 8.3: Integrate updated `handleLoginSuccess` and `handleLoginFailure` into `handleFormSubmit`.

- **Start:** `handleFormSubmit` (Part 2) exists with stubs. Updated handlers exist.
- **End:** In `handleFormSubmit`, `loginApiService` call now uses: `.then(response => handleLoginSuccess(response))`, `.catch(error => handleLoginFailure(error))`.
- **Concern:** Completing the data flow for login attempts with real API responses.
- **Test:** Submit form with correct/incorrect credentials against a running backend. Observe alerts/error messages.

---

## Phase 9: Client-Side Security (JWT Storage - `sessionStorage`)

### Task 9.1: Create `storeToken(token)` function using `sessionStorage`.

- **Start:** Basic JavaScript understanding.
- **End:** Function `storeToken(token)` calls `sessionStorage.setItem('authToken', token);`.
- **Concern:** Storing the JWT in `sessionStorage`.
- **Test:** Call `storeToken("mytestjwt")`, check browser's `sessionStorage`.

### Task 9.2: Create `getToken()` function using `sessionStorage`.

- **Start:** Basic JavaScript understanding.
- **End:** Function `getToken()` calls `sessionStorage.getItem('authToken');` and returns token or `null`.
- **Concern:** Retrieving the JWT from `sessionStorage`.
- **Test:** After `storeToken`, call `getToken()` and log result.

### Task 9.3: Create `removeToken()` function using `sessionStorage`.

- **Start:** Basic JavaScript understanding.
- **End:** Function `removeToken()` calls `sessionStorage.removeItem('authToken');`.
- **Concern:** Removing JWT from `sessionStorage` (e.g., for logout).
- **Test:** After `storeToken`, call `removeToken()`, then `getToken()` should be `null`.

### Task 9.4: Integrate `storeToken` into `handleLoginSuccess`.

- **Start:** `handleLoginSuccess` and `sessionStorage`-based `storeToken` functions exist.
- **End:** `handleLoginSuccess` calls `storeToken(apiResponse.token)` upon successful login.
- **Concern:** Persisting token in `sessionStorage` after successful login.
- **Test:** Successful login should store token in `sessionStorage`.

---

## Phase 10: Post-Login Actions (Redirection)

### Task 10.1: Define Post-Login Redirect URL.

- **Start:** Basic script setup.
- **End:** Constant `POST_LOGIN_REDIRECT_URL = '/dashboard';` (or similar) defined.
- **Concern:** Configuring where to send user after login.
- **Test:** `console.log(POST_LOGIN_REDIRECT_URL)`.

### Task 10.2: Implement redirection in `handleLoginSuccess`.

- **Start:** `handleLoginSuccess` function and `POST_LOGIN_REDIRECT_URL` exist.
- **End:** After storing token, `handleLoginSuccess` redirects: `window.location.href = POST_LOGIN_REDIRECT_URL;`.
- **Concern:** Navigating user to new page after successful login.
- **Test:** Successful login should redirect browser.

---

## Phase 11: Final Assembly & Initialization

### Task 11.1: Ensure all event listeners are attached within `DOMContentLoaded`.

- **Start:** All event listener setup tasks completed.
- **End:** Verify all event listeners are correctly placed and initialized.
- **Concern:** Correct initialization of all script functionalities.
- **Test:** Full end-to-end test against a running backend:
  - Real-time validation for all fields.
  - Password visibility toggle.
  - Submission with invalid data (shows field/form errors).
  - Submission with incorrect API credentials (shows loading, then form error from API).
  - Submission with valid API credentials (shows loading, stores token in `sessionStorage`, redirects). Verify token presence/clearance.
