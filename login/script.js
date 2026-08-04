/* ==========================================================================
   StudyHub — Login Page Script
   script.js — Client-side validation with Regex, error/success feedback,
   preventDefault(), DOM manipulation, and Show Password toggle.
   ========================================================================== */

(function () {
    'use strict';

    // ── Helper shortcuts ──────────────────────────────────────────────
    function byId(id) { return document.getElementById(id); }

    // ── DOM References ────────────────────────────────────────────────
    var form          = byId('login-form');
    var emailInput    = byId('email');
    var passwordInput = byId('password');
    var emailError    = byId('email-error');
    var passwordError = byId('password-error');
    var emailGroup    = byId('email-group');
    var passwordGroup = byId('password-group');
    var showPwCheckbox = byId('show-password');
    var successMsg    = byId('success-message');
    var loginBtn      = byId('login-btn');

    // ── Regex for email validation ────────────────────────────────────
    // Simple pattern: something@something.domain (min 2 char TLD)
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    // ==================================================================
    //  VALIDATION FUNCTIONS
    // ==================================================================

    /**
     * Validate the email field.
     * - Must not be empty.
     * - Must match the email regex pattern.
     * Returns: { valid: boolean, message: string }
     */
    function validateEmail(value) {
        value = value.trim();

        if (value === '') {
            return { valid: false, message: 'Email address is required.' };
        }

        if (!emailRegex.test(value)) {
            return { valid: false, message: 'Please enter a valid email address.' };
        }

        return { valid: true, message: '' };
    }

    /**
     * Validate the password field.
     * - Must not be empty.
     * - Must be at least 6 characters long.
     * Returns: { valid: boolean, message: string }
     */
    function validatePassword(value) {
        if (value === '') {
            return { valid: false, message: 'Password is required.' };
        }

        if (value.length < 6) {
            return { valid: false, message: 'Password must be at least 6 characters.' };
        }

        return { valid: true, message: '' };
    }

    // ==================================================================
    //  UI FEEDBACK — Show error / success / clear states
    // ==================================================================

    /**
     * Show error state on a form group.
     * Sets the .error class and displays the error message.
     */
    function showError(groupEl, errorEl, message) {
        groupEl.classList.add('error');
        groupEl.classList.remove('valid');
        errorEl.textContent = message;
    }

    /**
     * Show valid state on a form group.
     * Sets the .valid class and clears the error message.
     */
    function showValid(groupEl, errorEl) {
        groupEl.classList.remove('error');
        groupEl.classList.add('valid');
        errorEl.textContent = '';
    }

    /**
     * Clear all validation states (neutral).
     */
    function clearState(groupEl, errorEl) {
        groupEl.classList.remove('error', 'valid');
        errorEl.textContent = '';
    }

    // ==================================================================
    //  LIVE VALIDATION — Validate on blur and input
    // ==================================================================

    // Email — validate when user leaves the field
    emailInput.addEventListener('blur', function () {
        var result = validateEmail(emailInput.value);
        if (emailInput.value.trim() === '') {
            clearState(emailGroup, emailError);
        } else {
            result.valid
                ? showValid(emailGroup, emailError)
                : showError(emailGroup, emailError, result.message);
        }
    });

    // Email — validate live while typing (only if already has content)
    emailInput.addEventListener('input', function () {
        if (emailInput.value.trim().length > 0 || emailGroup.classList.contains('error')) {
            var result = validateEmail(emailInput.value);
            result.valid
                ? showValid(emailGroup, emailError)
                : showError(emailGroup, emailError, result.message);
        } else {
            clearState(emailGroup, emailError);
        }
    });

    // Password — validate when user leaves the field
    passwordInput.addEventListener('blur', function () {
        var result = validatePassword(passwordInput.value);
        if (passwordInput.value === '') {
            clearState(passwordGroup, passwordError);
        } else {
            result.valid
                ? showValid(passwordGroup, passwordError)
                : showError(passwordGroup, passwordError, result.message);
        }
    });

    // Password — validate live while typing
    passwordInput.addEventListener('input', function () {
        if (passwordInput.value.length > 0 || passwordGroup.classList.contains('error')) {
            var result = validatePassword(passwordInput.value);
            result.valid
                ? showValid(passwordGroup, passwordError)
                : showError(passwordGroup, passwordError, result.message);
        } else {
            clearState(passwordGroup, passwordError);
        }
    });

    // ==================================================================
    //  SHOW PASSWORD TOGGLE
    // ==================================================================

    showPwCheckbox.addEventListener('change', function () {
        // Toggle input type between 'password' and 'text'
        passwordInput.type = showPwCheckbox.checked ? 'text' : 'password';
        passwordInput.focus();
    });

    // ==================================================================
    //  FORM SUBMISSION — preventDefault() + full validation
    // ==================================================================

    form.addEventListener('submit', function (event) {
        // 🛑 Prevent default browser submission (no page reload)
        event.preventDefault();

        // Hide any previous success message
        successMsg.classList.remove('visible');

        // Validate both fields
        var emailResult    = validateEmail(emailInput.value);
        var passwordResult = validatePassword(passwordInput.value);
        var isValid = true;

        // Email validation
        if (!emailResult.valid) {
            showError(emailGroup, emailError, emailResult.message);
            isValid = false;
        } else {
            showValid(emailGroup, emailError);
        }

        // Password validation
        if (!passwordResult.valid) {
            showError(passwordGroup, passwordError, passwordResult.message);
            isValid = false;
        } else {
            showValid(passwordGroup, passwordError);
        }

        // If any field failed, focus the first error field and stop
        if (!isValid) {
            var firstErrorInput = form.querySelector('.error .form-input');
            if (firstErrorInput) {
                firstErrorInput.focus();
            }
            return; // Stop here — don't proceed
        }

        // ✅ All validations passed — show success message!
        successMsg.classList.add('visible');

        // Disable the button briefly to prevent double-submit
        loginBtn.disabled = true;

        // Log to console for debugging
        console.log('%c✅ Login Successful!', 'color: #10b981; font-weight: bold;');
        console.log('   Email:', emailInput.value.trim());

        // Re-enable button after 3 seconds (simulating redirect)
        setTimeout(function () {
            loginBtn.disabled = false;
        }, 3000);
    });

})();
