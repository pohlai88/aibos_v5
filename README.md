![CI](https://github.com/pohlai88/aibos_v5/actions/workflows/ci.yml/badge.svg)

# AIBOS v5

A modular, Apple-inspired accounting SaaS built with HTML, Tailwind CSS, and Supabase.

## Project Structure

```
aibos_v5/
  public/                # Static assets
  src/
    components/          # Reusable UI components (HTML + Tailwind)
    modules/             # Feature modules (dashboard, etc.)
    styles/              # Global and Tailwind styles
    utils/               # JS helpers (Supabase, etc.)
    index.html           # Main entry point
  supabase/              # Supabase config, migrations
  tailwind.config.js     # Tailwind config
  postcss.config.js      # PostCSS config
  package.json           # Project dependencies
  README.md              # Project overview
  .env                   # Environment variables (Supabase keys, etc.)
```

## Stack
- **HTML-first** frontend
- **Tailwind CSS** (build process, theming, dark mode ready)
- **Inter** font for Apple-style minimalism
- **Supabase** for auth, database, and storage
- **Modular**: Each feature/module is self-contained with its own README

## Getting Started
1. Install dependencies: `npm install`
2. Run Tailwind build: `npm run dev` (or your preferred script)
3. Open `src/index.html` in your browser (use Live Server or similar for best results)

## Customization
- Accent color: `#007AFF` (Apple blue)
- All components and modules are in `src/`

## Supabase
- Configure your Supabase keys in `.env`
- See `src/utils/supabase.js` for usage

---

For more details, see the README in each module/component folder.
 