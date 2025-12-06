
# 🚀 Deployment Guide: FluencyFlow on Hostinger

This guide explains how to deploy the **FluencyFlow** React application to **Hostinger Business Web Hosting**.

Since FluencyFlow is a **Single Page Application (SPA)** built with Vite, we will deploy it as a **Static Site**.

---

## ✅ Prerequisites

1.  **Hostinger Business Account** (or any plan supporting File Manager/Git).
2.  **Access to hPanel**.
3.  **The Project Source Code** on your local machine.

---

## 📦 Step 1: Build the Application

Before uploading, we need to compile the TypeScript/React code into optimized HTML, CSS, and JavaScript files.

1.  Open your project terminal (VS Code).
2.  Run the build command:
    ```bash
    npm run build
    ```
3.  This will create a **`dist`** folder in your project root.
    *   *Note:* Ensure your `.env` file contains your Production API Key before building, as Vite embeds it during the build process (See Security Warning below).

---

## ☁️ Step 2: Upload to Hostinger

1.  Log in to **Hostinger hPanel**.
2.  Go to **Websites** -> **Manage** (for your target domain).
3.  Search for **File Manager**.
4.  Navigate to the **`public_html`** folder.
    *   *Clean up:* Delete any default `default.php` files if present.
5.  **Upload the content of the `dist` folder**:
    *   **Do not** upload the `dist` folder itself.
    *   Open the `dist` folder on your computer.
    *   Select **ALL** files (`index.html`, `assets/`, `vite.svg`, etc.).
    *   Drag and drop them into the `public_html` folder on Hostinger.

---

## ⚙️ Step 3: Fix Routing (The 404 Error Fix)

React apps are SPAs. If a user refreshes the page or goes to a direct link (e.g., `yourdomain.com/drills`), the server will look for a folder named "drills" and fail (404 Error). We need to tell the server to always serve `index.html`.

1.  In Hostinger **File Manager** (inside `public_html`).
2.  Create a New File named **`.htaccess`**.
3.  Paste the following code:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```
4.  Save the file.

---

## 🔒 Step 4: Security & API Keys (Critical)

### The Risk
Because this is a static frontend deployment, your `VITE_API_KEY` is embedded in the Javascript code. A savvy user can inspect the network and find your key.

### The Solution (For Production)
To secure your quota and wallet on Hostinger:

1.  **Restrict the Key in Google Cloud Console:**
    *   Go to [Google AI Studio / Cloud Console](https://console.cloud.google.com/).
    *   Find your API Key settings.
    *   **Application Restrictions**: Set to "HTTP Referrers (Websites)".
    *   **Website Restrictions**: Add your domain (e.g., `https://fluencyflow.com/*`).
    *   *Effect:* The key will ONLY work when the request comes from your Hostinger website.

2.  **The Pro Solution (Node.js Backend):**
    *   Hostinger Business supports **Node.js**.
    *   Instead of static upload, create a small Node.js server (Express) that holds the Key and acts as a proxy between your React App and Google Gemini.

---

## 🌍 Step 5: Test & Launch

1.  Open your domain in the browser.
2.  Check the **Console** (F12) for any errors.
3.  Test the **Microphone permissions** (Browser will ask for permission).
    *   *Note:* Microphone access requires **HTTPS**. Hostinger provides free SSL; ensure it is active.

**Congratulations! Your Elite AI Coach is live. 🚀**
