/* ==========================================================================
   Interactive Web Elements — script.js
   Organized, reusable JavaScript for DOM manipulation & interactivity.
   No external libraries — pure vanilla JS.
   ========================================================================== */

// Wait for the DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    /* =======================================================================
       UTILITY FUNCTIONS
       ======================================================================= */

    /**
     * Shorthand for querySelector
     * @param {string} selector - CSS selector
     * @param {Element} parent - Optional parent element
     * @returns {Element}
     */
    function qs(selector, parent) {
        return (parent || document).querySelector(selector);
    }

    /**
     * Shorthand for querySelectorAll
     * @param {string} selector - CSS selector
     * @param {Element} parent - Optional parent element
     * @returns {NodeList}
     */
    function qsa(selector, parent) {
        return (parent || document).querySelectorAll(selector);
    }

    /**
     * Get element by ID
     * @param {string} id - Element ID
     * @returns {Element}
     */
    function byId(id) {
        return document.getElementById(id);
    }

    /**
     * Add event listener with shorthand
     * @param {Element} el - Target element
     * @param {string} event - Event type
     * @param {Function} handler - Event handler
     */
    function on(el, event, handler) {
        if (el) el.addEventListener(event, handler);
    }

    /* =======================================================================
       1. DARK MODE TOGGLE
       Smooth transition with localStorage persistence
       ======================================================================= */
    function initDarkMode() {
        var toggle = byId('dark-mode-toggle');
        var STORAGE_KEY = 'interactive-web-dark-mode';

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
       2. INTERACTIVE COUNTER
       Increase, decrease, reset with animated number pop
       ======================================================================= */
    function initCounter() {
        var counterValue = byId('counter-value');
        var btnIncrease = byId('counter-increase');
        var btnDecrease = byId('counter-decrease');
        var btnReset = byId('counter-reset');
        var count = 0;

        /**
         * Update the counter display with animation
         * @param {number} newValue - The new counter value
         */
        function updateCounter(newValue) {
            count = newValue;
            counterValue.textContent = count;

            // Trigger pop animation
            counterValue.classList.remove('animate-pop');
            // Force reflow to restart animation
            void counterValue.offsetWidth;
            counterValue.classList.add('animate-pop');
        }

        on(btnIncrease, 'click', function () {
            updateCounter(count + 1);
        });

        on(btnDecrease, 'click', function () {
            updateCounter(count - 1);
        });

        on(btnReset, 'click', function () {
            updateCounter(0);
        });
    }

    /* =======================================================================
       3. DYNAMIC TEXT CHANGER
       Cycling through an array of headings and descriptions
       ======================================================================= */
    function initTextChanger() {
        var heading = byId('dynamic-heading');
        var description = byId('dynamic-description');
        var btn = byId('change-text-btn');

        // Array of content objects to cycle through
        var textContent = [
            {
                heading: 'Design Meets Function',
                description: 'Great software is born when beautiful design and powerful functionality converge to create something truly extraordinary.'
            },
            {
                heading: 'Code is Poetry',
                description: 'Every line of code tells a story. Clean, elegant code is not just functional — it is a craft that combines logic with creativity.'
            },
            {
                heading: 'Build for Tomorrow',
                description: 'The best developers don\'t just solve today\'s problems. They architect solutions that scale, adapt, and stand the test of time.'
            },
            {
                heading: 'Pixel Perfect Matters',
                description: 'Attention to detail separates good from great. Every pixel, every transition, every micro-interaction contributes to the user experience.'
            },
            {
                heading: 'Innovation Never Stops',
                description: 'Technology evolves at the speed of imagination. Stay curious, keep learning, and push the boundaries of what\'s possible on the web.'
            },
            {
                heading: 'Welcome to the Future',
                description: 'Click the button below to discover inspiring messages about technology, creativity, and innovation.'
            }
        ];

        var currentIndex = 0;

        on(btn, 'click', function () {
            // Move to next text (cycling back to start)
            currentIndex = (currentIndex + 1) % textContent.length;

            // Fade out current text
            heading.style.opacity = '0';
            heading.style.transform = 'translateY(-8px)';
            description.style.opacity = '0';
            description.style.transform = 'translateY(-8px)';

            // After fade out, update content and fade in
            setTimeout(function () {
                heading.textContent = textContent[currentIndex].heading;
                description.textContent = textContent[currentIndex].description;

                heading.style.opacity = '1';
                heading.style.transform = 'translateY(0)';
                description.style.opacity = '1';
                description.style.transform = 'translateY(0)';
            }, 300);
        });

        // Add transition styles
        heading.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        description.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    }

    /* =======================================================================
       4. SHOW/HIDE INFORMATION CARD
       Smooth slide animation using CSS grid trick
       ======================================================================= */
    function initInfoCard() {
        var btn = byId('toggle-info-btn');
        var wrapper = byId('info-card-wrapper');
        var isOpen = false;

        on(btn, 'click', function () {
            isOpen = !isOpen;
            wrapper.classList.toggle('open', isOpen);

            // Update button text
            var btnText = btn.querySelector('span') || btn;
            if (btn.childNodes.length > 1) {
                // Get the text node (after the SVG)
                var textNodes = Array.from(btn.childNodes).filter(function (node) {
                    return node.nodeType === Node.TEXT_NODE;
                });
                if (textNodes.length > 0) {
                    textNodes[textNodes.length - 1].textContent = isOpen ? ' Hide Info Card' : ' Toggle Info Card';
                }
            }
        });
    }

    /* =======================================================================
       5. LIVE CHARACTER COUNTER
       Real-time count with progress bar and color feedback
       ======================================================================= */
    function initCharCounter() {
        var textarea = byId('char-textarea');
        var charCount = byId('char-count');
        var charMax = byId('char-max');
        var progressFill = byId('char-progress-fill');
        var maxLength = parseInt(textarea.getAttribute('maxlength'), 10) || 250;

        // Set max display
        charMax.textContent = maxLength;

        /**
         * Update character count display and progress bar
         */
        function updateCharCount() {
            var currentLength = textarea.value.length;
            var percentage = (currentLength / maxLength) * 100;

            // Update count text
            charCount.textContent = currentLength;

            // Update progress bar width
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
        on(textarea, 'keyup', updateCharCount);

        // Initialize
        updateCharCount();
    }

    /* =======================================================================
       6. RANDOM QUOTE GENERATOR
       Array of quotes with fade animation
       ======================================================================= */
    function initQuoteGenerator() {
        var quoteText = byId('quote-text');
        var quoteAuthor = byId('quote-author');
        var btn = byId('new-quote-btn');

        // Array of inspirational quotes
        var quotes = [
            { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
            { text: 'Innovation distinguishes between a leader and a follower.', author: 'Steve Jobs' },
            { text: 'The best way to predict the future is to invent it.', author: 'Alan Kay' },
            { text: 'Simplicity is the ultimate sophistication.', author: 'Leonardo da Vinci' },
            { text: 'Talk is cheap. Show me the code.', author: 'Linus Torvalds' },
            { text: 'First, solve the problem. Then, write the code.', author: 'John Johnson' },
            { text: 'Code is like humor. When you have to explain it, it\'s bad.', author: 'Cory House' },
            { text: 'Make it work, make it right, make it fast.', author: 'Kent Beck' },
            { text: 'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.', author: 'Martin Fowler' },
            { text: 'The web does not just connect machines, it connects people.', author: 'Tim Berners-Lee' },
            { text: 'Programs must be written for people to read, and only incidentally for machines to execute.', author: 'Harold Abelson' },
            { text: 'Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away.', author: 'Antoine de Saint-Exupéry' }
        ];

        var lastIndex = -1;

        /**
         * Get a random quote that's different from the last one
         * @returns {Object} A quote object with text and author
         */
        function getRandomQuote() {
            var index;
            do {
                index = Math.floor(Math.random() * quotes.length);
            } while (index === lastIndex && quotes.length > 1);
            lastIndex = index;
            return quotes[index];
        }

        on(btn, 'click', function () {
            // Fade out
            quoteText.style.opacity = '0';
            quoteAuthor.style.opacity = '0';

            setTimeout(function () {
                var quote = getRandomQuote();
                quoteText.textContent = quote.text;
                quoteAuthor.textContent = '— ' + quote.author;

                // Fade in
                quoteText.style.opacity = '1';
                quoteAuthor.style.opacity = '1';
            }, 300);
        });

        // Add transition
        quoteText.style.transition = 'opacity 0.3s ease';
        quoteAuthor.style.transition = 'opacity 0.3s ease';
    }

    /* =======================================================================
       7. IMAGE SWITCHER
       Navigate images with fade animation and dot indicators
       ======================================================================= */
    function initImageSwitcher() {
        var img = byId('switcher-img');
        var btnPrev = byId('img-prev');
        var btnNext = byId('img-next');
        var dotsContainer = byId('image-dots');
        var dots = qsa('.dot', dotsContainer);

        // Array of image sources (using existing project images)
        var images = [
            { src: 'images/project-portfolio.png', alt: 'Portfolio website project' },
            { src: 'images/project-landing.png', alt: 'Landing page project' },
            { src: 'images/project-webapp.png', alt: 'Web application UI project' }
        ];

        var currentImage = 0;

        /**
         * Switch to a specific image with fade animation
         * @param {number} index - Index of the image to show
         */
        function switchImage(index) {
            if (index === currentImage) return;

            // Fade out
            img.classList.add('fade-out');

            setTimeout(function () {
                currentImage = index;
                img.src = images[currentImage].src;
                img.alt = images[currentImage].alt;
                img.classList.remove('fade-out');

                // Update dots
                dots.forEach(function (dot, i) {
                    dot.classList.toggle('active', i === currentImage);
                });
            }, 400);
        }

        on(btnNext, 'click', function () {
            var nextIndex = (currentImage + 1) % images.length;
            switchImage(nextIndex);
        });

        on(btnPrev, 'click', function () {
            var prevIndex = (currentImage - 1 + images.length) % images.length;
            switchImage(prevIndex);
        });

        // Dot click handlers (event delegation)
        on(dotsContainer, 'click', function (e) {
            var dot = e.target.closest('.dot');
            if (dot) {
                var index = parseInt(dot.getAttribute('data-index'), 10);
                switchImage(index);
            }
        });
    }

    /* =======================================================================
       8. COLOR THEME SWITCHER
       Multiple accent color palettes
       ======================================================================= */
    function initThemeSwitcher() {
        var swatchesContainer = byId('theme-swatches');
        var swatches = qsa('.swatch', swatchesContainer);
        var STORAGE_KEY = 'interactive-web-accent-theme';

        /**
         * Apply a color theme to the body
         * @param {string} theme - Theme name (e.g., 'violet', 'cyan')
         */
        function applyTheme(theme) {
            // Set data attribute for CSS matching
            document.body.setAttribute('data-theme', theme);

            // Update active swatch
            swatches.forEach(function (swatch) {
                swatch.classList.toggle('active', swatch.getAttribute('data-theme') === theme);
            });

            // Save preference
            localStorage.setItem(STORAGE_KEY, theme);
        }

        // Restore saved theme
        var savedTheme = localStorage.getItem(STORAGE_KEY);
        if (savedTheme) {
            applyTheme(savedTheme);
        }

        // Event delegation for swatch clicks
        on(swatchesContainer, 'click', function (e) {
            var swatch = e.target.closest('.swatch');
            if (swatch) {
                var theme = swatch.getAttribute('data-theme');
                applyTheme(theme);
            }
        });
    }

    /* =======================================================================
       9. INTERACTIVE FAQ (ACCORDION)
       Expand/collapse with smooth animation
       ======================================================================= */
    function initFAQ() {
        var faqList = byId('faq-list');
        var faqItems = qsa('.faq-item', faqList);

        /**
         * Toggle a specific FAQ item open/closed
         * @param {Element} item - The FAQ item element
         */
        function toggleFAQ(item) {
            var isOpen = item.classList.contains('open');
            var button = qs('.faq-question', item);

            // Close all other items (accordion behavior)
            faqItems.forEach(function (otherItem) {
                if (otherItem !== item) {
                    otherItem.classList.remove('open');
                    var otherBtn = qs('.faq-question', otherItem);
                    if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle current item
            item.classList.toggle('open', !isOpen);
            if (button) button.setAttribute('aria-expanded', String(!isOpen));
        }

        // Event delegation on the FAQ list
        on(faqList, 'click', function (e) {
            var question = e.target.closest('.faq-question');
            if (question) {
                var item = question.closest('.faq-item');
                toggleFAQ(item);
            }
        });
    }

    /* =======================================================================
       10. CONTACT FORM VALIDATION
       Client-side validation with success/error toasts
       ======================================================================= */
    function initContactForm() {
        var form = byId('contact-form');
        var nameInput = byId('contact-name');
        var emailInput = byId('contact-email');
        var messageInput = byId('contact-message');
        var nameError = byId('name-error');
        var emailError = byId('email-error');
        var messageError = byId('message-error');
        var toast = byId('form-toast');
        var toastMessage = byId('toast-message');

        /**
         * Validate a single field
         * @param {Element} input - The input element
         * @param {Element} errorEl - The error display element
         * @param {string} fieldName - Human-readable field name
         * @returns {boolean} Whether the field is valid
         */
        function validateField(input, errorEl, fieldName) {
            var value = input.value.trim();
            var parentGroup = input.closest('.form-group') || input.parentElement.closest('.form-group');

            // Check if empty
            if (!value) {
                if (parentGroup) parentGroup.classList.add('error');
                errorEl.textContent = fieldName + ' is required.';
                return false;
            }

            // Email specific validation
            if (input.type === 'email') {
                var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    if (parentGroup) parentGroup.classList.add('error');
                    errorEl.textContent = 'Please enter a valid email address.';
                    return false;
                }
            }

            // Clear errors
            if (parentGroup) parentGroup.classList.remove('error');
            errorEl.textContent = '';
            return true;
        }

        /**
         * Show a toast notification
         * @param {string} message - Toast message
         * @param {boolean} isError - Whether it's an error toast
         */
        function showToast(message, isError) {
            toastMessage.textContent = message;
            toast.classList.toggle('error', !!isError);
            toast.classList.add('show');

            // Auto-hide after 4 seconds
            setTimeout(function () {
                toast.classList.remove('show');
            }, 4000);
        }

        // Real-time validation on blur
        on(nameInput, 'blur', function () {
            validateField(nameInput, nameError, 'Name');
        });

        on(emailInput, 'blur', function () {
            validateField(emailInput, emailError, 'Email');
        });

        on(messageInput, 'blur', function () {
            validateField(messageInput, messageError, 'Message');
        });

        // Clear error on input
        on(nameInput, 'input', function () {
            var parentGroup = nameInput.closest('.form-group');
            if (parentGroup) parentGroup.classList.remove('error');
            nameError.textContent = '';
        });

        on(emailInput, 'input', function () {
            var parentGroup = emailInput.closest('.form-group');
            if (parentGroup) parentGroup.classList.remove('error');
            emailError.textContent = '';
        });

        on(messageInput, 'input', function () {
            var parentGroup = messageInput.closest('.form-group');
            if (parentGroup) parentGroup.classList.remove('error');
            messageError.textContent = '';
        });

        // Form submission
        on(form, 'submit', function (e) {
            e.preventDefault();

            var isNameValid = validateField(nameInput, nameError, 'Name');
            var isEmailValid = validateField(emailInput, emailError, 'Email');
            var isMessageValid = validateField(messageInput, messageError, 'Message');

            if (isNameValid && isEmailValid && isMessageValid) {
                // Simulate successful submission
                showToast('Message sent successfully! ✨', false);

                // Reset form
                form.reset();

                // Clear any remaining error states
                qsa('.form-group', form).forEach(function (group) {
                    group.classList.remove('error');
                });
            } else {
                showToast('Please fix the errors above.', true);
            }
        });
    }

    /* =======================================================================
       SCROLL TO TOP BUTTON
       Shows after scrolling down, smooth scroll back to top
       ======================================================================= */
    function initScrollToTop() {
        var btn = byId('scroll-top-btn');
        var scrollThreshold = 400;

        // Show/hide based on scroll position
        window.addEventListener('scroll', function () {
            if (window.scrollY > scrollThreshold) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        });

        // Scroll to top on click
        on(btn, 'click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* =======================================================================
       SCROLL REVEAL ANIMATION
       Animate sections as they enter the viewport
       ======================================================================= */
    function initScrollReveal() {
        var sections = qsa('.section');

        // Set initial state
        sections.forEach(function (section) {
            section.style.opacity = '0';
            section.style.transform = 'translateY(40px)';
            section.style.transition = 'opacity 0.7s ease-out, transform 0.7s ease-out';
        });

        // Create intersection observer
        if ('IntersectionObserver' in window) {
            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.12,
                rootMargin: '0px 0px -40px 0px'
            });

            sections.forEach(function (section) {
                observer.observe(section);
            });
        } else {
            // Fallback for older browsers
            sections.forEach(function (section) {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            });
        }
    }

    /* =======================================================================
       INITIALIZE ALL COMPONENTS
       ======================================================================= */
    initDarkMode();
    initCounter();
    initTextChanger();
    initInfoCard();
    initCharCounter();
    initQuoteGenerator();
    initImageSwitcher();
    initThemeSwitcher();
    initFAQ();
    initContactForm();
    initScrollToTop();
    initScrollReveal();

    // Log initialization confirmation
    console.log('%c✨ Interactive Web Elements initialized!', 'color: #7c3aed; font-size: 14px; font-weight: bold;');
});
