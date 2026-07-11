# 📚 StudyHub — Student Productivity Platform

A modern, premium landing page for **StudyHub**, a student productivity platform featuring notes, tasks, mind maps, and AI-powered study tools. Built with **HTML5**, **CSS3**, and **vanilla JavaScript** — no frameworks, no dependencies.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Responsive](https://img.shields.io/badge/Responsive-00C853?style=for-the-badge&logo=google-chrome&logoColor=white)

---

## ✨ Features

### Design & UI
- **Glassmorphism UI** — Frosted-glass cards with `backdrop-filter: blur()` throughout
- **Dark / Light Mode** — Toggle with system preference detection and `localStorage` persistence
- **Premium Animations** — Floating blobs, shimmer effects, scroll reveals with staggered delays, hover transforms, and micro-interactions
- **Fully Responsive** — Mobile-first CSS with 4 breakpoints (320px, 480px, 768px, 1024px)
- **Hamburger Navigation** — Pure CSS checkbox-driven slide-in drawer with backdrop overlay and animated X transition
- **CSS Custom Properties** — Complete design token system (colors, spacing, shadows, radii, typography)
- **Google Fonts** — [Inter](https://fonts.google.com/specimen/Inter) (body) and [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) (code/badges)
- **Semantic HTML** — Accessible markup with `aria-label`, proper heading hierarchy, and `focus-visible` outlines
- **No Horizontal Scroll** — `overflow-x: hidden` with responsive container constraints

### Interactive Features (Vanilla JS)
- **Study Timer** — 25-minute Pomodoro timer with Start, Pause, and Reset controls; tracks completed sessions
- **Study Tip Generator** — Randomized study tips with emoji icons, displayed in a styled card
- **Feature Search** — Live-filtering search bar for feature cards with match counter
- **Favorite Features** — Heart-toggle buttons on feature cards with animated pop effect and floating counter
- **FAQ Accordion** — Click-to-expand FAQ cards with chevron rotation and smooth max-height transitions
- **Animated Stat Counters** — Numbers count up from zero on scroll using `IntersectionObserver`
- **Scroll Reveal** — Elements fade in on scroll with staggered delays per card
- **Scroll-to-Top** — Floating button appears after scrolling 300px
- **Dismissible Banner** — Announcement bar with close button
- **Contact Form Validation** — Client-side validation with error states and character counter with progress bar
- **Active Nav Highlighting** — Navigation links update based on scroll position
- **Mobile Nav Auto-Close** — Drawer closes on link click

---

## 📄 Sections

| Section | Description |
|---------|-------------|
| **Announcement Banner** | Dismissible gradient banner promoting new features |
| **Navigation** | Sticky glassmorphism navbar with logo, links, login button, and dark mode toggle |
| **Hero** | Split layout with heading, CTA buttons, trust badges, and a mini dashboard preview with floating cards |
| **Trusted By** | Animated brand logo strip (Google, Microsoft, Notion, etc.) |
| **Features** | 6 feature cards in a searchable, favoritable grid with SVG icons |
| **How It Works** | 3-step flow cards with animated connectors |
| **Dashboard Preview** | Full dashboard mockup with sidebar, charts, notes, tasks, deadlines, and activity feed |
| **Statistics** | 4 animated stat counters (students, notes, hours saved, satisfaction) |
| **Testimonials** | 3 student review cards with star ratings and author avatars |
| **FAQ** | 6 expandable FAQ cards in accordion format |
| **Contact** | Contact info panel + styled form with validation and character counter |
| **Study Timer** | Pomodoro timer widget (25 min) with Start / Pause / Reset |
| **Study Tips** | Random tip generator card with "Get New Tip" button |
| **CTA Banner** | Final call-to-action with gradient background |
| **Footer** | 4-column footer with brand info, product links, resources, and legal |

---

## 🛠️ Tech Stack

| Technology | Usage |
|------------|-------|
| HTML5 | Semantic structure, SVG icons, accessible markup |
| CSS3 | Styling, layout, animations, glassmorphism, dark mode |
| JavaScript (ES6) | 14 modular interactive features (no frameworks) |
| CSS Grid | Hero, features, dashboard, stats, testimonials, FAQ, contact, footer layouts |
| CSS Flexbox | Navigation, buttons, step cards, activity items |
| CSS Custom Properties | 50+ design tokens for colors, spacing, shadows, radii |
| CSS Media Queries | Mobile-first responsive design (4 breakpoints) |
| Google Fonts | Inter (body) & JetBrains Mono (code/badges) |
| IntersectionObserver | Scroll reveal animations & stat counter triggers |
| localStorage | Dark mode preference persistence |

---

## 📁 Project Structure

```
FrontendDev-P1/
├── index.html          # Main HTML file — all sections & structure
├── style.css           # Complete stylesheet (~4500 lines) with responsive breakpoints
├── script.js           # Vanilla JS (~680 lines) — 14 modular feature initializers
├── images/
│   ├── features-illustration.png   # Features section illustration
│   └── hero-illustration.png       # Hero section illustration
└── README.md           # This file
```

---

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/FrontendDev-P1.git
   ```

2. **Open in browser**
   ```bash
   cd FrontendDev-P1
   ```
   Open `index.html` directly in your browser — no build tools or server needed.

3. **Or use a live server**
   - **VS Code**: Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension and click **"Go Live"**
   - **Python**: Run `python -m http.server 8000` and visit `http://localhost:8000`

---

## 🎨 Design System

The stylesheet uses a comprehensive **CSS Custom Properties** system:

```css
/* Color Palette */
--purple-600:    #7c3aed;       /* Primary brand */
--blue-500:      #3b82f6;       /* Secondary accent */
--cyan-500:      #06b6d4;       /* Tertiary accent */
--emerald-500:   #10b981;       /* Success */
--rose-500:      #f43f5e;       /* Danger / Favorites */
--amber-500:     #f59e0b;       /* Warning */

/* Gradients */
--gradient-primary:  linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%);
--gradient-text:     linear-gradient(135deg, #7c3aed 0%, #3b82f6 50%, #06b6d4 100%);

/* Typography */
--font-sans:  'Inter', system-ui, sans-serif;
--font-mono:  'JetBrains Mono', monospace;

/* Glassmorphism */
--glass-bg:      rgba(255, 255, 255, 0.6);
--glass-blur:    16px;
--glass-border:  rgba(255, 255, 255, 0.2);

/* Breakpoints (Mobile-First) */
/* Base:    ≤ 479px  (Mobile)         */
/* 480px+:  Large mobile              */
/* 768px+:  Tablet                    */
/* 1024px+: Desktop / Laptop          */
/* 1280px+: Large desktop             */
```

---

## 📱 Responsive Breakpoints

| Breakpoint | Target Device | Key Layout Changes |
|------------|---------------|-------------------|
| Base (≤ 479px) | Mobile | Single-column everything, hamburger menu, compact padding, full-width buttons |
| `≥ 480px` | Large mobile | Horizontal hero CTA buttons, 2-column footer, larger stat cards |
| `≥ 768px` | Tablet | 2-column features/stats/testimonials/FAQ, horizontal steps, sidebar restored |
| `≥ 1024px` | Desktop | 3-column features/testimonials, 4-column stats/footer, side-by-side hero, floating cards |
| `≥ 1280px` | Large desktop | Extra spacing for breathing room |

---

## 🍔 Hamburger Menu

The mobile navigation uses a **pure CSS checkbox** approach (no JS required for toggle):

- **Animated icon** — Three bars transform into an **X** on `:checked`
- **Slide-in drawer** — Navigation slides from right with `backdrop-filter: blur(20px)` glassmorphism
- **Backdrop overlay** — Semi-transparent overlay covers the page when menu is open
- **Auto-close** — JS closes the menu when a nav link is clicked
- **Accessible** — Uses `aria-label` on the toggle checkbox and label

---

## ⏱️ Study Timer

A built-in **Pomodoro timer** with:
- 25-minute countdown display (monospace font)
- **Start** — Begins the countdown
- **Pause** — Freezes the timer and shows "Paused" label
- **Reset** — Returns to 25:00 and resets the label
- Session counter tracks completed focus sessions
- Green color pulse animation on completion

---

## 🧠 JavaScript Architecture

All JS is in a single `script.js` file, wrapped in `DOMContentLoaded`. It uses **14 modular init functions**:

```
initDarkMode()          — Theme toggle + localStorage + system preference
initFeatureSearch()     — Live search filtering for feature cards
initFavorites()         — Heart toggle + floating counter
initStatCounters()      — IntersectionObserver-triggered count-up animation
initFAQ()               — Accordion expand/collapse
initScrollToTop()       — Floating back-to-top button
initAnnouncementBanner()— Dismissible top banner
initCharCounter()       — Textarea character counter with progress bar
initStudyTimer()        — Pomodoro timer (Start/Pause/Reset)
initStudyTips()         — Random study tip generator
initScrollReveal()      — Fade-in-on-scroll animations
initMobileNavClose()    — Auto-close hamburger on link click
initActiveNavHighlight()— Scroll-based active nav highlighting
initContactForm()       — Client-side form validation
```

---

> *Built with ❤️ using HTML, CSS & vanilla JS — no frameworks, no dependencies*
