# Rinku Goyal – 3D Portfolio

Static site: HTML, CSS, JavaScript, Three.js r128, GSAP 3.12.5 (all from cdnjs). No build step.

## Structure
index.html · css/style.css · js/scene.js (3D) · js/animations.js (GSAP) · js/main.js (projects, form, nav) · assets/

## Run locally
Open `index.html` in a browser, or for best results run `python -m http.server 8000` in this folder and visit http://localhost:8000.

## Deploy to GitHub Pages
1. Create a new public repository on GitHub (e.g. `portfolio`).
2. Upload all files (keep the folder structure) via "Add file > Upload files", or use git:
   `git init && git add . && git commit -m "Portfolio" && git branch -M main && git remote add origin https://github.com/YOUR-USERNAME/portfolio.git && git push -u origin main`
3. Repository Settings > Pages > Source: "Deploy from a branch", branch `main`, folder `/ (root)`, Save.
4. After a minute your site is live at `https://YOUR-USERNAME.github.io/portfolio/`. All paths are relative, so the subpath works.

## Customize
- **Projects:** edit the `PROJECTS` array at the top of `js/main.js`. Fill in `github` and `live` only with real URLs; empty links show "not yet available". Change `status` to "Completed" only when it is.
- **Email, GitHub, LinkedIn:** search `index.html` for `your.email@example.com` and `YOUR-USERNAME` / `YOUR-PROFILE` (contact and footer) and replace.
- **Skills / education / about text:** edit `index.html`.
- **Accent colour:** `--accent` in `css/style.css`.
- **Your photo:** put `photo.jpg` in `assets/` and add `<img src="assets/photo.jpg" alt="Portrait of Rinku Goyal">` to the About section.
- **3D model:** put a `.glb` in `assets/`, add the GLTFLoader script (same Three.js r128 version, from cdnjs examples or jsDelivr), and replace the `node` group in `js/scene.js`. GitHub Pages serves .glb files fine.

## Make the contact form real
GitHub Pages has no backend. Create a free form at https://formspree.io (or Web3Forms / Getform), copy its endpoint URL, and paste it into `FORM_ENDPOINT` in `js/main.js`. Until then the form validates but tells visitors that nothing was sent.
