# Christiaan Swanepoel - Creative Portfolio

A minimalist, highly performant creative portfolio website built using core web technologies (HTML, CSS, JavaScript) featuring an interactive Perlin Noise flow field simulation.

## Features

- **Interactive Flow Field**: Elegant 3D Perlin noise particle simulation in the header, rendering active trackers and smooth trails.
- **Click Mechanics**: Canvas clicks temporarily accelerate particle physics for a dynamic interaction overlay.
- **Obsidian Mono / Silver Mono Theme Engine**: Seamless dark and light theme transitions with persistent local storage.
- **Glassmorphic Grid System**: Tight, responsive 3D tilt cards showcasing a Tech Stack and Projects list.
- **Clean Responsive Styling**: Tailored viewport overrides and typography adjustments for mobile.
- **Lightweight Assets**: Embedded SVG favicon and icons, requiring zero external asset downloads.

## Tech Stack

- **Structure**: HTML5
- **Style**: Vanilla CSS3 (Outfit & Inter fonts via Google Fonts API)
- **Math & Physics**: Custom 3D Perlin Noise module and dynamic 2D Canvas rendering

## Local Run

Simply open `index.html` directly in any modern browser, or run a local static server:

```bash
# Python 3
python -m http.server 8000

# Node.js / npx
npx serve .
```

## GitHub Pages Deployment

To host this portfolio for free on GitHub Pages:

1. Create a new repository on GitHub (recommended name: `swantaan.github.io` for a root domain, or `portfolio` for a sub-path).
2. Run the following commands in this directory:

```bash
# Link your local repository to GitHub
git remote add origin https://github.com/swantaan/<YOUR-REPO-NAME>.git

# Push to GitHub
git push -u origin main
```

3. Enable GitHub Pages:
   - If named `swantaan.github.io`, it deploys automatically.
   - Otherwise, go to **Settings** -> **Pages** on your GitHub repository, choose **Deploy from a branch**, select `main` (root `/`), and click **Save**.
