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