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
       14. CONTACT FORM VALIDATION & SUBMIT
       Client-side validation with visual feedback.
       ======================================================================= */
    function initContactForm() {
        var form = byId('contact-form');

        if (!form) return;

        on(form, 'submit', function (e) {
            e.preventDefault();

            var name = byId('contact-name');
            var email = byId('contact-email');
            var subject = byId('contact-subject');
            var message = byId('contact-message');
            var isValid = true;

            // Simple validation
            [name, email, subject, message].forEach(function (input) {
                if (!input.value.trim()) {
                    input.classList.add('input-error');
                    isValid = false;
                } else {
                    input.classList.remove('input-error');
                }
            });

            // Email format check
            if (email && email.value.trim()) {
                var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email.value.trim())) {
                    email.classList.add('input-error');
                    isValid = false;
                }
            }

            if (isValid) {
                // Simulate success
                var submitBtn = byId('contact-submit');
                submitBtn.textContent = '✓ Sent!';
                submitBtn.style.pointerEvents = 'none';
                form.reset();

                // Reset char counter
                var charCount = byId('char-count');
                var progressFill = byId('char-progress-fill');
                if (charCount) charCount.textContent = '0';
                if (progressFill) {
                    progressFill.style.width = '0%';
                    progressFill.classList.remove('warning', 'danger');
                }

                setTimeout(function () {
                    submitBtn.innerHTML = 'Send Message <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
                    submitBtn.style.pointerEvents = '';
                }, 2500);
            }
        });

        // Clear error on input
        qsa('.form-input', form).forEach(function (input) {
            on(input, 'input', function () {
                input.classList.remove('input-error');
            });
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
