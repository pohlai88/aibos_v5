# AI-BOS Accounting System

A modern, static, single-page accounting system with a beautiful Apple-inspired UI. Built with HTML, CSS (Tailwind), and JavaScript. Designed for easy deployment on Netlify and integration with Supabase for authentication and database features.

---

## 🚀 Project Overview
- **Brand:** AI-BOS
- **Type:** Static web app (no backend required)
- **UI:** Apple-inspired, responsive, clean design
- **Tech:** HTML, Tailwind CSS, JavaScript
- **Recommended Hosting:** Netlify (or Vercel)
- **Recommended Database/Auth:** Supabase

---

## ✨ Features
- **Landing/Login Page** (`login.html`)
- **Dashboard** (`index.html`)
- **Chart of Accounts** (`accounts.html`)
- **General Ledger** (`transactions.html`)
- **AP/AR Management** (`ap-ar.html`)
- **Customer Database** (`customers.html`)
- **Supplier Database** (`suppliers.html`)
- **Organization Settings** (`organization.html`)
- **User Management** (`users.html`)
- **Audit, Tax, Banking, Reports** (HTML pages)
- **Modern Roboto font and brand color**

---

## 🛠️ Deployment (Netlify)
1. **Push your code to GitHub.**
2. **Sign up at [Netlify](https://app.netlify.com/).**
3. **Connect your GitHub repo and deploy.**
   - No build command needed (static site)
   - Publish directory: `/` (root)
4. **Your site will be live at `https://your-site-name.netlify.app`**

---

## 🔗 Supabase Integration
- Add Supabase JS client via CDN in your HTML:
  ```html
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js"></script>
  ```
- Initialize in your JS:
  ```js
  const supabase = supabase.createClient('https://YOUR_PROJECT_ID.supabase.co', 'YOUR_ANON_KEY');
  ```
- Use Supabase for authentication, user management, and database CRUD.

---

## 🗂️ Version Control & Changelog

### How to Use Version Control
- All changes are tracked using Git.
- Commit messages should be clear and descriptive (e.g., `Add customer management page`, `Update login UI`, `Remove old backend code`).
- Use branches for major features or experiments.
- Pull requests and issues can be used for team collaboration.

### Changelog
- **v1.0.0** (2024-06-09):
  - Initial release: Static HTML/CSS/JS accounting system
  - Apple-inspired UI, Roboto font, brand color #F9F9F9
  - Pages: login, dashboard, accounts, transactions, AP/AR, customers, suppliers, organization, users, audit, tax, banking, reports
  - Removed all legacy Limestone Accounting backend code

---

## 📁 Project Structure
```
/ (project root)
  |-- login.html
  |-- index.html
  |-- accounts.html
  |-- transactions.html
  |-- ap-ar.html
  |-- customers.html
  |-- suppliers.html
  |-- organization.html
  |-- users.html
  |-- audit.html
  |-- tax.html
  |-- banking.html
  |-- reports.html
  |-- app.js
  |-- database.js
  |-- AI-BOS_schema.md
  |-- README.md
```

---

## 📣 Notes
- This project is now fully static and ready for modern deployment.
- For database/auth, connect to Supabase as described above.
- For any changes, use clear commit messages and update the changelog.

---

**AI-BOS — Modern Accounting, Simplified.** 