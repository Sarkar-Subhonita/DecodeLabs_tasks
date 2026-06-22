# 🚀 Frontend Developer Portfolio

A modern, sleek, and fully responsive personal portfolio website built with **HTML5** and **CSS3**. Designed with a dark theme, smooth micro-animations, and a premium visual identity — perfect for showcasing frontend development skills and projects.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Responsive](https://img.shields.io/badge/Responsive-00C853?style=for-the-badge&logo=google-chrome&logoColor=white)

---

## ✨ Features

- **Dark Theme** — A carefully curated dark color palette with purple/cyan accent gradients
- **Fully Responsive** — Adapts seamlessly across desktop, tablet, and mobile (breakpoints at 992px, 640px, 400px)
- **Smooth Animations** — Floating hero shapes, hover transforms, gradient glows, and transition effects
- **CSS Custom Properties** — Complete design token system for colors, typography, spacing, and more
- **Semantic HTML** — Accessible, well-structured markup with proper heading hierarchy and ARIA labels
- **Google Fonts** — Uses [Inter](https://fonts.google.com/specimen/Inter) (body) and [Outfit](https://fonts.google.com/specimen/Outfit) (headings) for a modern typographic feel
- **No JavaScript Required** — Pure HTML + CSS implementation

---

## 📄 Sections

| Section     | Description                                                                 |
|-------------|-----------------------------------------------------------------------------|
| **Hero**    | Gradient background with greeting text, CTA buttons, and a circular profile image |
| **About**   | Bio, toolkit highlights (HTML5, CSS3, Flexbox, Grid), and stat counters     |
| **Skills**  | 4 interactive skill cards — HTML5, CSS3, Responsive Design, UI Design       |
| **Projects**| 3 project showcase cards with image overlays and tech tags                   |
| **Contact** | Contact info (email, location) alongside a styled contact form              |
| **Footer**  | Logo, nav links, social icons (GitHub, LinkedIn, X/Twitter), and copyright  |

---

## 🛠️ Tech Stack

| Technology        | Usage                                       |
|-------------------|---------------------------------------------|
| HTML5             | Semantic structure & content                |
| CSS3              | Styling, layout, animations                 |
| CSS Flexbox       | Navigation, buttons, stat counters          |
| CSS Grid          | Hero, about, skills, projects, contact grids|
| CSS Custom Props  | Design tokens & theming                     |
| Google Fonts      | Inter & Outfit typefaces                    |
| SVG               | Skill icons, contact icons, social icons    |

---

## 📁 Project Structure

```
FrontendDev-P1/
├── index.html              # Main HTML file (all sections)
├── style.css               # Complete stylesheet with responsive breakpoints
├── images/
│   ├── developer-hero.png      # Hero section profile image
│   ├── about-developer.png     # About section image
│   ├── project-portfolio.png   # Project 1 thumbnail
│   ├── project-landing.png     # Project 2 thumbnail
│   └── project-webapp.png      # Project 3 thumbnail
└── README.md               # This file
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
   If you have VS Code, install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension and click **"Go Live"**.

---

## 🎨 Design System

The stylesheet uses a comprehensive **CSS Custom Properties** system:

```css
/* Color Palette */
--clr-bg:            #0a0a0f;      /* Deep dark background */
--clr-primary:       #7c3aed;      /* Purple accent */
--clr-accent:        #06b6d4;      /* Cyan accent */
--clr-gradient:      linear-gradient(135deg, #7c3aed, #06b6d4);

/* Typography */
--ff-heading:  'Outfit', sans-serif;
--ff-body:     'Inter', sans-serif;

/* Breakpoints */
/* Tablet:  max-width: 992px  */
/* Mobile:  max-width: 640px  */
/* Small:   max-width: 400px  */
```

---

## 📱 Responsive Breakpoints

| Breakpoint   | Target Device      | Key Layout Changes                                |
|--------------|--------------------|---------------------------------------------------|
| `≤ 992px`    | Tablet             | Single-column hero/about, 2-col skills & projects |
| `≤ 640px`    | Mobile             | Single-column grids, stacked buttons              |
| `≤ 400px`    | Small mobile       | Wrapped nav, vertical stat counters               |

---

> *Built with ❤️ using just HTML & CSS*
