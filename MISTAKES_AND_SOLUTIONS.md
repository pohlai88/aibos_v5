# Mistakes & Solutions

A living knowledge base of common issues, errors, and their solutions for the AIBOS project. Add to this doc whenever you solve a tricky problem!

---

## CI/CD

### Problem: GitHub Actions workflow fails on 'package-name' input
- **Symptom:** Workflow error: 'Invalid action input package-name'
- **Solution:** Remove the 'package-name' input from the release-please action in your workflow. Only use 'release-type'.

### Problem: Tailwind build not running in CI
- **Symptom:** No CSS output in `public/` after CI run
- **Solution:** Ensure your build script is correct and Tailwind is installed as a dependency. Check the build logs for errors.

---

## Tailwind CSS

### Problem: Styles not updating in browser
- **Symptom:** Changes to CSS or classes don't appear
- **Solution:** Clear your browser cache and ensure you're editing the correct file. If using a build process, make sure it's running (`npm run dev`).

---

## Supabase

### Problem: Auth or data fetch fails in production
- **Symptom:** Supabase calls work locally but fail on Netlify
- **Solution:** Double-check your environment variables in Netlify. Make sure your Supabase URL and anon key are set in the Netlify dashboard.

---

## Deployment

### Problem: Site not updating after push
- **Symptom:** Netlify deploys but site doesn't reflect changes
- **Solution:** Check build logs on Netlify. Make sure the correct build command and publish directory are set. Try clearing Netlify's cache and redeploying.

---

## Add your own!
Whenever you solve a weird bug or deployment issue, add it here for future reference. 