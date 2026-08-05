/* ==========================================================================
   StudyHub — Login / Signup Page Script
   script.js — Client-side validation with Regex, error/success feedback,
   preventDefault(), DOM manipulation, Show Password toggle,
   and Login ↔ Signup panel toggling.
   ========================================================================== */

(function () {
    'use strict';

    // ── Helper shortcuts ──────────────────────────────────────────────
    function byId(id) { return document.getElementById(id); }

    // ── DOM References — Panels ───────────────────────────────────────
    var loginPanel    = byId('login-panel');
    var signupPanel   = byId('signup-panel');
    var showSignupBtn = byId('show-signup-btn');
    var showLoginBtn  = byId('show-login-btn');

    // ── DOM References — Login Form ───────────────────────────────────
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

    // ── DOM References — Signup Form ──────────────────────────────────
    var signupForm       = byId('signup-form');
    var signupName       = byId('signup-name');
    var signupEmail      = byId('signup-email');
    var signupPassword   = byId('signup-password');
    var signupConfirm    = byId('signup-confirm');
    var signupNameError  = byId('signup-name-error');
    var signupEmailError = byId('signup-email-error');
    var signupPwError    = byId('signup-password-error');
    var signupConfError  = byId('signup-confirm-error');
    var signupNameGroup  = byId('signup-name-group');
    var signupEmailGroup = byId('signup-email-group');
    var signupPwGroup    = byId('signup-password-group');
    var signupConfGroup  = byId('signup-confirm-group');
    var signupBtn        = byId('signup-btn');
    var signupSuccessMsg = byId('signup-success-message');

    // ── Regex for email validation ────────────────────────────────────
    // Simple pattern: something@something.domain (min 2 char TLD)
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    // ==================================================================
    //  PANEL TOGGLE — Login ↔ Signup
    // ==================================================================

    /**
     * Switch between Login and Signup panels with animation.
     */
    function showPanel(panelToShow, panelToHide) {
        panelToHide.classList.add('auth-panel-hidden');
        panelToShow.classList.remove('auth-panel-hidden');

        // Re-trigger fade-in animation
        panelToShow.style.animation = 'none';
        void panelToShow.offsetWidth; // Force reflow
        panelToShow.style.animation = '';
    }

    if (showSignupBtn) {
        showSignupBtn.addEventListener('click', function (e) {
            e.preventDefault();
            showPanel(signupPanel, loginPanel);
        });
    }

    if (showLoginBtn) {
        showLoginBtn.addEventListener('click', function (e) {
            e.preventDefault();
            showPanel(loginPanel, signupPanel);
        });
    }

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

    /**
     * Validate the name field.
     * - Must not be empty.
     * - Must be at least 2 characters long.
     * Returns: { valid: boolean, message: string }
     */
    function validateName(value) {
        value = value.trim();

        if (value === '') {
            return { valid: false, message: 'Full name is required.' };
        }

        if (value.length < 2) {
            return { valid: false, message: 'Name must be at least 2 characters.' };
        }

        return { valid: true, message: '' };
    }

    /**
     * Validate the confirm password field.
     * - Must not be empty.
     * - Must match the password field.
     * Returns: { valid: boolean, message: string }
     */
    function validateConfirmPassword(password, confirmValue) {
        if (confirmValue === '') {
            return { valid: false, message: 'Please confirm your password.' };
        }

        if (confirmValue !== password) {
            return { valid: false, message: 'Passwords do not match.' };
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
    //  LIVE VALIDATION — Login Form (blur and input)
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
    //  LOGIN FORM SUBMISSION — preventDefault() + full validation
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

        // Store login state in localStorage
        localStorage.setItem('studyhub-logged-in', 'true');
        localStorage.setItem('studyhub-user-email', emailInput.value.trim());

        // Log to console for debugging
        console.log('%c✅ Login Successful!', 'color: #10b981; font-weight: bold;');
        console.log('   Email:', emailInput.value.trim());

        // Redirect to home page after a short delay
        setTimeout(function () {
            window.location.href = '../index.html';
        }, 2000);
    });

    // ==================================================================
    //  SIGNUP FORM SUBMISSION — preventDefault() + full validation
    // ==================================================================

    if (signupForm) {
        signupForm.addEventListener('submit', function (event) {
            // 🛑 Prevent default browser submission
            event.preventDefault();

            // Hide any previous success message
            signupSuccessMsg.classList.remove('visible');

            // Validate all fields
            var nameResult    = validateName(signupName.value);
            var emailResult   = validateEmail(signupEmail.value);
            var pwResult      = validatePassword(signupPassword.value);
            var confResult    = validateConfirmPassword(signupPassword.value, signupConfirm.value);
            var isValid = true;

            // Name validation
            if (!nameResult.valid) {
                showError(signupNameGroup, signupNameError, nameResult.message);
                isValid = false;
            } else {
                showValid(signupNameGroup, signupNameError);
            }

            // Email validation
            if (!emailResult.valid) {
                showError(signupEmailGroup, signupEmailError, emailResult.message);
                isValid = false;
            } else {
                showValid(signupEmailGroup, signupEmailError);
            }

            // Password validation
            if (!pwResult.valid) {
                showError(signupPwGroup, signupPwError, pwResult.message);
                isValid = false;
            } else {
                showValid(signupPwGroup, signupPwError);
            }

            // Confirm password validation
            if (!confResult.valid) {
                showError(signupConfGroup, signupConfError, confResult.message);
                isValid = false;
            } else {
                showValid(signupConfGroup, signupConfError);
            }

            // If any field failed, focus the first error field and stop
            if (!isValid) {
                var firstErrorInput = signupForm.querySelector('.error .form-input');
                if (firstErrorInput) {
                    firstErrorInput.focus();
                }
                return;
            }

            // ✅ All validations passed — show success message!
            signupSuccessMsg.classList.add('visible');

            // Disable the button briefly to prevent double-submit
            signupBtn.disabled = true;

            // Store login state in localStorage
            localStorage.setItem('studyhub-logged-in', 'true');
            localStorage.setItem('studyhub-user-email', signupEmail.value.trim());
            localStorage.setItem('studyhub-user-name', signupName.value.trim());

            // Log to console for debugging
            console.log('%c✅ Signup Successful!', 'color: #10b981; font-weight: bold;');
            console.log('   Name:', signupName.value.trim());
            console.log('   Email:', signupEmail.value.trim());

            // Redirect to home page after a short delay
            setTimeout(function () {
                window.location.href = '../index.html';
            }, 2000);
        });
    }

})();
