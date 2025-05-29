<identity>
You are a Senior Frontend Architect.
</identity>

<task>
Design a robust, maintainable, and user-centric JavaScript frontend architecture for an e-commerce login system. This architecture must:
1.  Integrate seamlessly with an existing `login.html` interface and its supporting JavaScript codebase, providing a coordinated structure.
2.  Securely interface with backend services built on PostgreSQL and using JWT for authentication.

Produce a comprehensive **Frontend Architecture Document** organized by the following sections. For each section, provide detailed explanations, principles, and, where applicable, pseudo-code or structural examples.

## Frontend Architecture Document

### 1. Component Structure
* **Goal:** Define a modular and reusable component breakdown for the login interface.
* **Details:**
    * Identify core UI components (e.g., login form, input fields with labels, error message displays, submit button, password visibility toggle).
    * Describe their individual responsibilities, props (inputs), and emitted events (outputs).
    * Explain how these components would be composed to build the `login.html` view and manage their interdependencies.

### 2. State Management Strategy
* **Goal:** Outline a clear strategy for managing frontend authentication state and related UI data.
* **Details:**
    * Specify where authentication state (e.g., JWT token, user information, authentication status, loading states, error messages) will reside.
    * Describe the lifecycle of this state (initialization, updates upon API responses, clearing on logout).
    * Explain how different components will access and react to changes in this state.
    * Recommend a suitable state management approach or library, justifying your choice for this specific login system context.

### 3. Service Integration Layer
* **Goal:** Define how the frontend communicates with the backend JWT-based authentication services.
* **Details:**
    * Describe the structure of a dedicated service module for handling API calls (e.g., to `/login`, `/refresh-token` endpoints).
    * Specify how JWTs will be included in requests and how responses (success/error) from the backend will be processed.
    * Outline common utility functions needed for API interaction (e.g., request configuration, response parsing).

### 4. Data Flow Patterns
* **Goal:** Illustrate the pathways for data (user input, API responses, state changes, errors) throughout the login system.
* **Details:**
    * Describe the flow for a typical login attempt: user input -> validation -> service call -> state update -> UI feedback.
    * Detail how errors (e.g., network issues, invalid credentials, server errors) are caught, managed, and presented to the user.
    * Explain how loading states are handled to provide user feedback during asynchronous operations.

### 5. Client-Side Security Implementation
* **Goal:** Specify client-side measures to enhance the security of the login process.
* **Details:**
    * Recommend a secure storage mechanism for JWTs (e.g., HttpOnly cookies managed by the backend vs. in-memory with CSRF protection if using browser storage). Discuss trade-offs.
    * Detail how and when the JWT is retrieved and attached to authenticated requests.
    * Outline any other client-side security best practices relevant to login forms (e.g., input sanitization if not purely handled by framework, preventing sensitive data exposure in logs).

### 6. Validation Architecture
* **Goal:** Propose a comprehensive client-side input validation framework that provides real-time, user-friendly feedback.
* **Details:**
    * Describe the overall validation approach (e.g., per-field, on-submit, library usage).
    * This architecture must specifically implement and manage:
        * **Email Validation:** Real-time format checking (e.g., `user@example.com`).
        * **Password Strength:** Real-time checks for:
            * Minimum 8 characters.
            * At least 1 uppercase letter.
            * At least 1 lowercase letter.
            * At least 1 digit.
        * **Password Confirmation:** Ensuring the password and confirmation password fields match.
        * **Password Visibility Toggle:** Functionality to show/hide password characters.
    * Explain how validation errors are communicated to the user (e.g., messages next to fields, summary).

### 7. Frontend Success and Error Handling
* **Goal:** Define the frontend procedures following authentication attempts.
* **Details:**
    * **On Successful Authentication:** Describe the steps after the backend confirms successful login and data persistence (e.g., storing the JWT as per Section 5, updating authentication state, redirecting to a protected area or updating the UI to reflect logged-in status).
    * **On Authentication Failure:** Detail how different failure scenarios (e.g., invalid credentials, account locked, server error) are distinguished and communicated to the user, guiding them on next steps if appropriate.

</task>

<instructions>
- Ensure the architecture is practical for an existing `login.html` page.
- Justify significant architectural choices.
- Where appropriate, suggest common JavaScript libraries or patterns that could be used to implement parts of this architecture, but prioritize the architectural principles.
</instructions>