# Haritam Restaurant Website

Mobile-first, high-performance, accessible static site for Haritam.

## Run locally

- Python: `python3 -m http.server 8000` (then open http://localhost:8000/haritam-site/)
- Or any static server (serve `/haritam-site`)

## Structure

- HTML pages at repo root (`index.html`, `menu.html`, etc.)
- Assets under `assets/` (`css`, `js`, `img`, `fonts`)

## Performance

- Images: provide AVIF/WebP + JPG fallbacks in `assets/img/`
- Fonts: using Google Fonts with `display=swap`; self-host WOFF2 for production preferred
- CSS: single stylesheet; keep under ~40KB gz
- JS: ES modules; keep under ~70KB gz

## Accessibility

- Keyboard navigable, focus-visible, ARIA labels
- Lightbox and mobile nav with focus trap and Escape close

## SEO

- Structured data (Restaurant) on home page
- `robots.txt` and `sitemap.xml` included

## Deployment

- Serve over HTTPS with Brotli + HTTP/2
- Set long cache for static assets with hash filenames (if using a bundler)

## Assets

- Placeholder images are SVGs under `assets/img/`. Replace with optimized AVIF/WebP/JPG and update HTML if needed.
- For production, self-host fonts as WOFF2 and reference via `@font-face`.

## Image optimization

1) Install dependencies:

```bash
cd haritam-site
npm install
```

2) Run optimizer with your source folder (absolute path recommended). On Windows, wrap path in quotes:

```bash
npm run optimize:images -- "C:\\Users\\Hari\\Desktop\\HARITHAM IMAGES\\Krea AI\\Website Pictures"
```

- Outputs go to `assets/img` with responsive sizes: `name-1600.(avif|webp|jpg)`, `name-1200.*`, `name-800.*`, and `name-thumb.*`.
- Replace the SVG placeholders in HTML with the generated assets. I can wire this automatically if you share which filenames map to hero, gallery, etc.
3) Wire images into pages automatically:

```bash
npm run wire:images
```

- This replaces the homepage hero and gallery thumbnails with the optimized outputs.
Optionally choose a specific hero image (use base name or filename; extension ignored):

```bash
npm run wire:images -- --hero "your-hero-file-name"
# examples
npm run wire:images -- --hero "hero"
npm run wire:images -- --hero "Interior 1.jpg"
```