/* ==========================================================================
   StudyHub — Interactive JavaScript
   script.js — Modular, vanilla JS for all interactive features.
   No frameworks. Uses querySelector, getElementById, addEventListener,
   classList, style, textContent, and reusable functions.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    /* =======================================================================
       UTILITY FUNCTIONS
       ======================================================================= */

    /** Shorthand for querySelector */
    function qs(selector, parent) {
        return (parent || document).querySelector(selector);
    }

    /** Shorthand for querySelectorAll */
    function qsa(selector, parent) {
        return (parent || document).querySelectorAll(selector);
    }

    /** Get element by ID */
    function byId(id) {
        return document.getElementById(id);
    }

    /** Add event listener with null check */
    function on(el, event, handler) {
        if (el) el.addEventListener(event, handler);
    }

    /** Format number with commas: 50000 → "50,000" */
    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    /* =======================================================================
       1. DARK MODE TOGGLE
       Persists preference in localStorage. Respects system preference.
       ======================================================================= */
    function initDarkMode() {
        var toggle = byId('dark-mode-toggle');
        var STORAGE_KEY = 'studyhub-dark-mode';

        // Restore saved preference on page load
        var savedTheme = localStorage.getItem(STORAGE_KEY);
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
        } else if (savedTheme === null) {
            // Check system preference if no saved preference
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.body.classList.add('dark-mode');
            }
        }

        // Toggle dark mode on click
        on(toggle, 'click', function () {
            document.body.classList.toggle('dark-mode');
            var isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');
        });
    }

    /* =======================================================================
       2. FEATURE SEARCH BAR
       Filters feature cards by title and description text.
       ======================================================================= */
    function initFeatureSearch() {
        var searchInput = byId('feature-search');
        var searchCount = byId('feature-search-count');
        var featureCards = qsa('.feature-card');

        if (!searchInput || featureCards.length === 0) return;

        on(searchInput, 'input', function () {
            var query = searchInput.value.toLowerCase().trim();
            var visibleCount = 0;

            featureCards.forEach(function (card) {
                var title = qs('.feature-title', card);
                var desc = qs('.feature-description', card);
                var titleText = title ? title.textContent.toLowerCase() : '';
                var descText = desc ? desc.textContent.toLowerCase() : '';

                if (query === '' || titleText.indexOf(query) !== -1 || descText.indexOf(query) !== -1) {
                    card.style.display = '';
                    card.style.opacity = '1';
                    card.style.transform = '';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            // Update count display
            if (query === '') {
                searchCount.textContent = '';
            } else {
                searchCount.textContent = visibleCount + ' of ' + featureCards.length + ' shown';
            }
        });
    }

    /* =======================================================================
       3. FAVORITE NOTES COUNTER
       Heart buttons on feature cards, with a floating counter.
       ======================================================================= */
    function initFavorites() {
        var favoriteBtns = qsa('.favorite-btn');
        var favCountDisplay = byId('favorites-count');
        var favCounter = byId('favorites-counter');
        var favCount = 0;

        if (favoriteBtns.length === 0) return;

        favoriteBtns.forEach(function (btn) {
            on(btn, 'click', function (e) {
                e.preventDefault();
                var isFavorited = btn.classList.contains('favorited');

                if (isFavorited) {
                    btn.classList.remove('favorited');
                    favCount = Math.max(0, favCount - 1);
                } else {
                    btn.classList.add('favorited');
                    favCount++;

                    // Pop animation
                    btn.classList.remove('animate-pop');
                    void btn.offsetWidth;
                    btn.classList.add('animate-pop');
                }

                favCountDisplay.textContent = favCount;

                // Show/hide floating counter
                if (favCount > 0) {
                    favCounter.classList.add('visible');
                } else {
                    favCounter.classList.remove('visible');
                }
            });
        });
    }

    /* =======================================================================
       4. ANIMATED STATISTICS COUNTER
       Counts up from 0 when the stats section scrolls into view.
       ======================================================================= */
    function initStatCounters() {
        var statNumbers = qsa('.stat-number[data-target]');

        if (statNumbers.length === 0) return;

        /**
         * Animate a counter from 0 to target value
         * @param {Element} el - The stat number element
         */
        function animateCounter(el) {
            var target = parseInt(el.getAttribute('data-target'), 10);
            var suffix = el.getAttribute('data-suffix') || '';
            var duration = 2000; // ms
            var startTime = null;

            function step(timestamp) {
                if (!startTime) startTime = timestamp;
                var progress = Math.min((timestamp - startTime) / duration, 1);

                // Ease out quad
                var eased = 1 - (1 - progress) * (1 - progress);
                var current = Math.floor(eased * target);

                el.textContent = formatNumber(current) + suffix;

                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    el.textContent = formatNumber(target) + suffix;
                }
            }

            requestAnimationFrame(step);
        }

        // Use IntersectionObserver to trigger animation
        if ('IntersectionObserver' in window) {
            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });

            statNumbers.forEach(function (el) {
                observer.observe(el);
            });
        } else {
            // Fallback: animate all immediately
            statNumbers.forEach(animateCounter);
        }
    }

    /* =======================================================================
       5. EXPAND/COLLAPSE FAQ (Accordion)
       Click question to toggle answer visibility. Smooth height animation.
       ======================================================================= */
    function initFAQ() {
        var faqGrid = byId('faq-grid');
        var faqCards = qsa('.faq-card');

        if (!faqGrid || faqCards.length === 0) return;

        // Set initial state — all collapsed
        faqCards.forEach(function (card) {
            card.classList.add('faq-collapsed');
            var question = qs('.faq-question', card);
            if (question) {
                question.style.cursor = 'pointer';
                question.setAttribute('role', 'button');
                question.setAttribute('aria-expanded', 'false');

                // Add toggle chevron
                var chevron = document.createElement('span');
                chevron.className = 'faq-chevron';
                chevron.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>';
                question.appendChild(chevron);
            }
        });

        // Event delegation on faq grid
        on(faqGrid, 'click', function (e) {
            var question = e.target.closest('.faq-question');
            if (!question) return;

            var card = question.closest('.faq-card');
            var isOpen = !card.classList.contains('faq-collapsed');

            // Close all
            faqCards.forEach(function (otherCard) {
                otherCard.classList.add('faq-collapsed');
                var q = qs('.faq-question', otherCard);
                if (q) q.setAttribute('aria-expanded', 'false');
            });

            // Toggle clicked
            if (!isOpen) {
                card.classList.remove('faq-collapsed');
                question.setAttribute('aria-expanded', 'true');
            }
        });
    }

    /* =======================================================================
       6. SCROLL TO TOP BUTTON
       Appears after scrolling 400px, smooth scroll back to top.
       ======================================================================= */
    function initScrollToTop() {
        var btn = byId('scroll-top-btn');
        var scrollThreshold = 400;

        if (!btn) return;

        window.addEventListener('scroll', function () {
            if (window.scrollY > scrollThreshold) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        }, { passive: true });

        on(btn, 'click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* =======================================================================
       7. DISMISSIBLE ANNOUNCEMENT BANNER
       Click X to close. Remembers dismissal with sessionStorage.
       ======================================================================= */
    function initAnnouncementBanner() {
        var banner = byId('announcement-banner');
        var closeBtn = byId('announcement-close');
        var STORAGE_KEY = 'studyhub-banner-dismissed';

        if (!banner || !closeBtn) return;

        // Check if already dismissed this session
        if (sessionStorage.getItem(STORAGE_KEY) === 'true') {
            banner.style.display = 'none';
            return;
        }

        on(closeBtn, 'click', function () {
            banner.classList.add('dismissed');
            sessionStorage.setItem(STORAGE_KEY, 'true');

            // Remove from DOM after transition
            setTimeout(function () {
                banner.style.display = 'none';
            }, 400);
        });
    }

    /* =======================================================================
       8. LIVE CHARACTER COUNTER
       Real-time count with progress bar and color feedback.
       ======================================================================= */
    function initCharCounter() {
        var textarea = byId('contact-message');
        var charCount = byId('char-count');
        var charMax = byId('char-max');
        var progressFill = byId('char-progress-fill');

        if (!textarea || !charCount || !progressFill) return;

        var maxLength = parseInt(textarea.getAttribute('maxlength'), 10) || 500;
        charMax.textContent = maxLength;

        function updateCharCount() {
            var currentLength = textarea.value.length;
            var percentage = (currentLength / maxLength) * 100;

            charCount.textContent = currentLength;
            progressFill.style.width = percentage + '%';

            // Change color based on usage
            progressFill.classList.remove('warning', 'danger');
            if (percentage >= 90) {
                progressFill.classList.add('danger');
            } else if (percentage >= 70) {
                progressFill.classList.add('warning');
            }
        }

        on(textarea, 'input', updateCharCount);
        updateCharCount();
    }

    /* =======================================================================
       9. STUDY TIMER (Pomodoro)
       Start, Pause, Reset. 25-minute focus sessions.
       ======================================================================= */
    function initStudyTimer() {
        var display = byId('timer-display');
        var label = byId('timer-label');
        var startBtn = byId('timer-start');
        var pauseBtn = byId('timer-pause');
        var resetBtn = byId('timer-reset');
        var sessionsDisplay = byId('timer-sessions');

        if (!display || !startBtn) return;

        var FOCUS_TIME = 25 * 60; // 25 minutes in seconds
        var timeRemaining = FOCUS_TIME;
        var timerInterval = null;
        var isRunning = false;
        var sessions = 0;

        /** Format seconds as MM:SS */
        function formatTime(seconds) {
            var mins = Math.floor(seconds / 60);
            var secs = seconds % 60;
            return (mins < 10 ? '0' : '') + mins + ':' + (secs < 10 ? '0' : '') + secs;
        }

        /** Update the timer display */
        function updateDisplay() {
            display.textContent = formatTime(timeRemaining);
        }

        /** Start the timer */
        function startTimer() {
            if (isRunning) return;
            isRunning = true;

            startBtn.disabled = true;
            pauseBtn.disabled = false;

            timerInterval = setInterval(function () {
                timeRemaining--;
                updateDisplay();

                if (timeRemaining <= 0) {
                    clearInterval(timerInterval);
                    isRunning = false;
                    sessions++;
                    sessionsDisplay.textContent = sessions;

                    // Flash completion
                    display.classList.add('timer-complete');
                    label.textContent = 'Session Complete! 🎉';

                    startBtn.disabled = false;
                    pauseBtn.disabled = true;

                    // Reset for next session
                    timeRemaining = FOCUS_TIME;

                    setTimeout(function () {
                        display.classList.remove('timer-complete');
                        label.textContent = 'Focus Time';
                        updateDisplay();
                    }, 3000);
                }
            }, 1000);
        }

        /** Pause the timer */
        function pauseTimer() {
            if (!isRunning) return;
            clearInterval(timerInterval);
            isRunning = false;

            startBtn.disabled = false;
            pauseBtn.disabled = true;
            label.textContent = 'Paused';
        }

        /** Reset the timer */
        function resetTimer() {
            clearInterval(timerInterval);
            isRunning = false;
            timeRemaining = FOCUS_TIME;

            startBtn.disabled = false;
            pauseBtn.disabled = true;
            label.textContent = 'Focus Time';
            display.classList.remove('timer-complete');
            updateDisplay();
        }

        on(startBtn, 'click', startTimer);
        on(pauseBtn, 'click', pauseTimer);
        on(resetBtn, 'click', resetTimer);

        updateDisplay();
    }

    /* =======================================================================
       10. RANDOM STUDY TIP GENERATOR
       Array of tips with fade animation.
       ======================================================================= */
    function initStudyTips() {
        var tipText = byId('study-tip-text');
        var tipBtn = byId('study-tip-btn');

        if (!tipText || !tipBtn) return;

        var tips = [
            '📚 Use the Pomodoro Technique: Study for 25 minutes, then take a 5-minute break. Repeat!',
            '🧠 Active recall is more effective than re-reading. Test yourself after each study session.',
            '📝 Summarize what you learned in your own words — it deepens understanding.',
            '🎵 Listen to lo-fi or ambient music to improve focus during study sessions.',
            '💤 Sleep is crucial for memory consolidation. Aim for 7–9 hours per night.',
            '🏃 Exercise before studying — even a 15-minute walk boosts focus and retention.',
            '📅 Plan your study sessions the night before. A clear plan reduces procrastination.',
            '🔄 Spaced repetition beats cramming — review material at increasing intervals.',
            '🎯 Set specific goals for each session: "Read Ch. 5" is better than "Study Biology."',
            '🚫 Put your phone in another room while studying to eliminate distractions.',
            '✍️ Handwriting notes improves retention compared to typing them.',
            '🗂️ Organize notes by topic using color-coding or tags for easy retrieval.',
            '🤝 Teaching someone else is one of the best ways to solidify your understanding.',
            '🧘 Practice mindfulness or deep breathing for 2 minutes before studying to improve focus.',
            '📖 Read the chapter summary first, then dive into details — it creates a mental framework.'
        ];

        var lastIndex = -1;

        on(tipBtn, 'click', function () {
            // Fade out
            tipText.style.opacity = '0';
            tipText.style.transform = 'translateY(-6px)';

            setTimeout(function () {
                // Pick random tip (different from last)
                var index;
                do {
                    index = Math.floor(Math.random() * tips.length);
                } while (index === lastIndex && tips.length > 1);
                lastIndex = index;

                tipText.textContent = tips[index];
                tipText.style.opacity = '1';
                tipText.style.transform = 'translateY(0)';
            }, 250);
        });

        // Add transition
        tipText.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
    }

    /* =======================================================================
       11. SMOOTH FADE-IN ANIMATIONS (Scroll Reveal)
       IntersectionObserver for fade-in as sections enter viewport.
       ======================================================================= */
    function initScrollReveal() {
        // Target all major sections + individual cards
        var revealElements = qsa(
            '.hero, .trusted-by, .features, .how-it-works, .dashboard-section, ' +
            '.statistics, .testimonials, .faq-section, .contact-section, ' +
            '.study-timer-section, .study-tip-section, .cta-banner, ' +
            '.feature-card, .stat-card, .testimonial-card, .faq-card, .step-card'
        );

        if (revealElements.length === 0) return;

        // Set initial hidden state
        revealElements.forEach(function (el) {
            el.classList.add('reveal-hidden');
        });

        if ('IntersectionObserver' in window) {
            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('reveal-visible');
                        entry.target.classList.remove('reveal-hidden');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.08,
                rootMargin: '0px 0px -40px 0px'
            });

            revealElements.forEach(function (el) {
                observer.observe(el);
            });
        } else {
            // Fallback: show all immediately
            revealElements.forEach(function (el) {
                el.classList.remove('reveal-hidden');
                el.classList.add('reveal-visible');
            });
        }
    }

    /* =======================================================================
       12. MOBILE NAV CLOSE ON LINK CLICK
       Closes the hamburger menu when a nav link is clicked.
       ======================================================================= */
    function initMobileNavClose() {
        var navToggle = byId('nav-toggle');
        var navLinks = qsa('.nav-link');

        if (!navToggle) return;

        navLinks.forEach(function (link) {
            on(link, 'click', function () {
                navToggle.checked = false;
            });
        });
    }

    /* =======================================================================
       13. ACTIVE NAV LINK HIGHLIGHT ON SCROLL
       Updates active nav link based on scroll position.
       ======================================================================= */
    function initActiveNavHighlight() {
        var sections = qsa('section[id]');
        var navLinks = qsa('.nav-link');

        if (sections.length === 0 || navLinks.length === 0) return;

        window.addEventListener('scroll', function () {
            var scrollY = window.scrollY + 100;

            sections.forEach(function (section) {
                var sectionTop = section.offsetTop;
                var sectionHeight = section.offsetHeight;
                var sectionId = section.getAttribute('id');

                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    navLinks.forEach(function (link) {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === '#' + sectionId) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, { passive: true });
    }

    /* =======================================================================
       14. ADVANCED CONTACT FORM VALIDATION
       Modular validators, live feedback, password strength, success modal,
       localStorage, and form reset.
       ======================================================================= */
    function initContactForm() {
        var form = byId('contact-form');
        if (!form) return;

        /* --- Element References --- */
        var fields = {
            name:     byId('contact-name'),
            email:    byId('contact-email'),
            phone:    byId('contact-phone'),
            goal:     byId('contact-goal'),
            password: byId('contact-password'),
            confirm:  byId('contact-confirm-password'),
            message:  byId('contact-message'),
            terms:    byId('contact-terms')
        };

        var submitBtn = byId('contact-submit');
        var strengthBar = byId('strength-bar');
        var strengthLabel = byId('strength-label');
        var strengthWrap = byId('password-strength');
        var modal = byId('success-modal');
        var modalCloseBtn = byId('modal-close-btn');
        var modalSummary = byId('modal-summary');

        /* ==================================================================
           VALIDATOR FUNCTIONS (pure, reusable)
           ================================================================== */

        /** Validate full name: required, min 2 chars, letters/spaces/hyphens/apostrophes */
        function validateName(value) {
            value = value.trim();
            if (!value) return { valid: false, message: 'Full name is required' };
            if (value.length < 2) return { valid: false, message: 'Name must be at least 2 characters' };
            if (!/^[a-zA-Z\s'\-]+$/.test(value)) return { valid: false, message: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
            return { valid: true, message: '' };
        }

        /** Validate email: required, RFC-compliant regex */
        function validateEmail(value) {
            value = value.trim();
            if (!value) return { valid: false, message: 'Email address is required' };
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) return { valid: false, message: 'Please enter a valid email address' };
            return { valid: true, message: '' };
        }

        /** Validate phone: required, 10-15 digits (allows +, spaces, hyphens, parentheses) */
        function validatePhone(value) {
            value = value.trim();
            if (!value) return { valid: false, message: 'Phone number is required' };
            var digitsOnly = value.replace(/[\s\-\(\)\+]/g, '');
            if (!/^\d{10,15}$/.test(digitsOnly)) return { valid: false, message: 'Enter a valid phone number (10-15 digits)' };
            return { valid: true, message: '' };
        }

        /** Validate password: required, min 8 chars. Returns strength level. */
        function validatePassword(value) {
            if (!value) return { valid: false, message: 'Password is required', strength: '' };
            if (value.length < 8) return { valid: false, message: 'Password must be at least 8 characters', strength: 'weak' };

            var score = 0;
            if (value.length >= 12) score++;
            if (/[A-Z]/.test(value)) score++;
            if (/[a-z]/.test(value)) score++;
            if (/[0-9]/.test(value)) score++;
            if (/[^A-Za-z0-9]/.test(value)) score++;

            var strength = 'weak';
            if (score >= 4) strength = 'strong';
            else if (score >= 2) strength = 'medium';

            return { valid: true, message: '', strength: strength };
        }

        /** Validate confirm password: must match password */
        function validateConfirmPassword(password, confirm) {
            if (!confirm) return { valid: false, message: 'Please confirm your password' };
            if (password !== confirm) return { valid: false, message: 'Passwords do not match' };
            return { valid: true, message: '' };
        }

        /** Validate select dropdown: must pick a non-empty option */
        function validateSelect(value) {
            if (!value) return { valid: false, message: 'Please select a study goal' };
            return { valid: true, message: '' };
        }

        /** Validate message: required, min 10 chars */
        function validateMessage(value) {
            value = value.trim();
            if (!value) return { valid: false, message: 'Message is required' };
            if (value.length < 10) return { valid: false, message: 'Message must be at least 10 characters' };
            return { valid: true, message: '' };
        }

        /** Validate checkbox: must be checked */
        function validateCheckbox(checked) {
            if (!checked) return { valid: false, message: 'You must accept the Terms of Service' };
            return { valid: true, message: '' };
        }

        /* ==================================================================
           UI HELPER FUNCTIONS
           ================================================================== */

        /** Show error state on an input */
        function showError(inputEl, message) {
            if (!inputEl) return;
            inputEl.classList.add('input-error');
            inputEl.classList.remove('input-valid');

            // Hide checkmark
            var check = inputEl.closest('.form-input-wrap');
            if (check) {
                var checkEl = check.querySelector('.form-check');
                if (checkEl) checkEl.classList.remove('visible');
            }

            // Show error message
            var errorId = inputEl.id + '-error';
            var errorEl = byId(errorId);
            if (errorEl) errorEl.textContent = message;
        }

        /** Show valid state on an input */
        function showValid(inputEl) {
            if (!inputEl) return;
            inputEl.classList.remove('input-error');
            inputEl.classList.add('input-valid');

            // Show checkmark
            var wrap = inputEl.closest('.form-input-wrap');
            if (wrap) {
                var checkEl = wrap.querySelector('.form-check');
                if (checkEl) checkEl.classList.add('visible');
            }

            // Clear error message
            var errorId = inputEl.id + '-error';
            var errorEl = byId(errorId);
            if (errorEl) errorEl.textContent = '';
        }

        /** Clear validation state (neutral) */
        function clearValidation(inputEl) {
            if (!inputEl) return;
            inputEl.classList.remove('input-error', 'input-valid');

            var wrap = inputEl.closest('.form-input-wrap');
            if (wrap) {
                var checkEl = wrap.querySelector('.form-check');
                if (checkEl) checkEl.classList.remove('visible');
            }

            var errorId = inputEl.id + '-error';
            var errorEl = byId(errorId);
            if (errorEl) errorEl.textContent = '';
        }

        /** Show checkbox error */
        function showCheckboxError(message) {
            var customEl = form.querySelector('.checkbox-custom');
            if (customEl) customEl.classList.add('checkbox-error');
            var errorEl = byId('contact-terms-error');
            if (errorEl) errorEl.textContent = message;
        }

        /** Clear checkbox error */
        function clearCheckboxError() {
            var customEl = form.querySelector('.checkbox-custom');
            if (customEl) customEl.classList.remove('checkbox-error');
            var errorEl = byId('contact-terms-error');
            if (errorEl) errorEl.textContent = '';
        }

        /** Update password strength meter */
        function updateStrengthMeter(strength) {
            if (!strengthBar || !strengthLabel || !strengthWrap) return;

            if (!strength) {
                strengthWrap.classList.remove('visible');
                strengthBar.className = 'strength-bar';
                strengthLabel.className = 'strength-label';
                strengthLabel.textContent = '';
                return;
            }

            strengthWrap.classList.add('visible');
            strengthBar.className = 'strength-bar ' + strength;
            strengthLabel.className = 'strength-label ' + strength;

            var labels = { weak: 'Weak', medium: 'Medium', strong: 'Strong' };
            strengthLabel.textContent = labels[strength] || '';
        }

        /** Show success modal */
        function showSuccessModal(data) {
            if (!modal) return;

            // Build summary
            if (modalSummary) {
                modalSummary.innerHTML =
                    '<strong>Name:</strong> ' + escapeHtml(data.name) + '<br>' +
                    '<strong>Email:</strong> ' + escapeHtml(data.email) + '<br>' +
                    '<strong>Phone:</strong> ' + escapeHtml(data.phone) + '<br>' +
                    '<strong>Goal:</strong> ' + escapeHtml(data.goal);
            }

            modal.classList.add('visible');
            document.body.style.overflow = 'hidden';
        }

        /** Hide success modal */
        function hideSuccessModal() {
            if (!modal) return;
            modal.classList.remove('visible');
            document.body.style.overflow = '';
        }

        /** Escape HTML to prevent XSS in modal summary */
        function escapeHtml(text) {
            var div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        /* ==================================================================
           VALIDATE SINGLE FIELD
           ================================================================== */
        function validateField(fieldName) {
            var result;

            switch (fieldName) {
                case 'name':
                    result = validateName(fields.name.value);
                    result.valid ? showValid(fields.name) : showError(fields.name, result.message);
                    return result.valid;

                case 'email':
                    result = validateEmail(fields.email.value);
                    result.valid ? showValid(fields.email) : showError(fields.email, result.message);
                    return result.valid;

                case 'phone':
                    result = validatePhone(fields.phone.value);
                    result.valid ? showValid(fields.phone) : showError(fields.phone, result.message);
                    return result.valid;

                case 'goal':
                    result = validateSelect(fields.goal.value);
                    result.valid ? showValid(fields.goal) : showError(fields.goal, result.message);
                    return result.valid;

                case 'password':
                    result = validatePassword(fields.password.value);
                    updateStrengthMeter(result.strength);
                    if (result.valid) {
                        showValid(fields.password);
                    } else {
                        showError(fields.password, result.message);
                    }
                    // Also re-validate confirm if it has a value
                    if (fields.confirm && fields.confirm.value) {
                        validateField('confirm');
                    }
                    return result.valid;

                case 'confirm':
                    result = validateConfirmPassword(fields.password.value, fields.confirm.value);
                    result.valid ? showValid(fields.confirm) : showError(fields.confirm, result.message);
                    return result.valid;

                case 'message':
                    result = validateMessage(fields.message.value);
                    result.valid ? showValid(fields.message) : showError(fields.message, result.message);
                    return result.valid;

                case 'terms':
                    result = validateCheckbox(fields.terms.checked);
                    result.valid ? clearCheckboxError() : showCheckboxError(result.message);
                    return result.valid;

                default:
                    return true;
            }
        }

        /* ==================================================================
           LIVE VALIDATION — Attach events
           ================================================================== */
        var textFields = ['name', 'email', 'phone', 'password', 'confirm', 'message'];

        textFields.forEach(function (fieldName) {
            var el = fields[fieldName];
            if (!el) return;

            // Validate on input (live as user types)
            on(el, 'input', function () {
                // Only validate live if user has already interacted (has value)
                if (el.value.trim().length > 0 || el.classList.contains('input-error')) {
                    validateField(fieldName);
                } else {
                    clearValidation(el);
                    if (fieldName === 'password') updateStrengthMeter('');
                }
            });

            // Validate on blur (when leaving field)
            on(el, 'blur', function () {
                if (el.value.trim().length > 0) {
                    validateField(fieldName);
                }
            });
        });

        // Select dropdown — validate on change
        if (fields.goal) {
            on(fields.goal, 'change', function () {
                validateField('goal');
            });
        }

        // Checkbox — validate on change
        if (fields.terms) {
            on(fields.terms, 'change', function () {
                if (fields.terms.checked) {
                    clearCheckboxError();
                }
            });
        }

        /* ==================================================================
           PASSWORD VISIBILITY TOGGLE
           ================================================================== */
        function initPasswordToggle(toggleId, inputEl) {
            var toggle = byId(toggleId);
            if (!toggle || !inputEl) return;

            on(toggle, 'click', function () {
                var isPassword = inputEl.type === 'password';
                inputEl.type = isPassword ? 'text' : 'password';

                var eyeIcon = toggle.querySelector('.eye-icon');
                var eyeOffIcon = toggle.querySelector('.eye-off-icon');

                if (eyeIcon) eyeIcon.style.display = isPassword ? 'none' : '';
                if (eyeOffIcon) eyeOffIcon.style.display = isPassword ? '' : 'none';

                inputEl.focus();
            });
        }

        initPasswordToggle('password-toggle-1', fields.password);
        initPasswordToggle('password-toggle-2', fields.confirm);

        /* ==================================================================
           FORM SUBMIT — Validate all, save, show modal, reset
           ================================================================== */
        on(form, 'submit', function (e) {
            e.preventDefault();

            // Validate all fields
            var isValid = true;
            var allFields = ['name', 'email', 'phone', 'goal', 'password', 'confirm', 'message', 'terms'];

            allFields.forEach(function (fieldName) {
                var fieldValid = validateField(fieldName);
                if (!fieldValid) isValid = false;
            });

            if (!isValid) {
                // Scroll to first error
                var firstError = form.querySelector('.input-error, .checkbox-error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    firstError.focus();
                }
                return;
            }

            // Collect form data
            var goalSelect = fields.goal;
            var goalText = goalSelect.options[goalSelect.selectedIndex].text;

            var formData = {
                name: fields.name.value.trim(),
                email: fields.email.value.trim(),
                phone: fields.phone.value.trim(),
                goal: goalText,
                goalValue: fields.goal.value,
                message: fields.message.value.trim(),
                termsAccepted: true,
                submittedAt: new Date().toISOString()
            };

            // Save to localStorage
            try {
                var existing = JSON.parse(localStorage.getItem('studyhub-contacts') || '[]');
                existing.push(formData);
                localStorage.setItem('studyhub-contacts', JSON.stringify(existing));
                console.log('%c📋 Form data saved to localStorage', 'color: #10b981; font-weight: bold;', formData);
            } catch (err) {
                console.warn('localStorage save failed:', err);
            }

            // Show success modal
            showSuccessModal(formData);

            // Reset form
            form.reset();

            // Clear all validation states
            allFields.forEach(function (fieldName) {
                if (fieldName === 'terms') {
                    clearCheckboxError();
                } else if (fields[fieldName]) {
                    clearValidation(fields[fieldName]);
                }
            });

            // Reset password strength meter
            updateStrengthMeter('');

            // Reset char counter
            var charCount = byId('char-count');
            var progressFill = byId('char-progress-fill');
            if (charCount) charCount.textContent = '0';
            if (progressFill) {
                progressFill.style.width = '0%';
                progressFill.classList.remove('warning', 'danger');
            }
        });

        /* ==================================================================
           MODAL CLOSE HANDLERS
           ================================================================== */
        on(modalCloseBtn, 'click', hideSuccessModal);

        // Close on overlay click
        on(modal, 'click', function (e) {
            if (e.target === modal) hideSuccessModal();
        });

        // Close on Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modal && modal.classList.contains('visible')) {
                hideSuccessModal();
            }
        });
    }

    /* =======================================================================
       INITIALIZE ALL MODULES
       ======================================================================= */
    initDarkMode();
    initFeatureSearch();
    initFavorites();
    initStatCounters();
    initFAQ();
    initScrollToTop();
    initAnnouncementBanner();
    initCharCounter();
    initStudyTimer();
    initStudyTips();
    initScrollReveal();
    initMobileNavClose();
    initActiveNavHighlight();
    initContactForm();

    console.log('%c✨ StudyHub Interactive Features initialized!', 'color: #7c3aed; font-size: 14px; font-weight: bold;');
});
