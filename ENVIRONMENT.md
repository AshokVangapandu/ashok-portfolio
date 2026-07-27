# Supabase Environment Configuration Guide

This document outlines the expected environment configuration, the build-time validation process, and troubleshooting guides to ensure invalid builds are never deployed to production.

---

## 1. Expected Environment Variables

To run Ashok's Portfolio website with live data from Supabase, the following variables must be configured:

| Variable Name | Required | Prefix / Format | Example Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| `VITE_SUPABASE_URL` | Yes | `https://` | `https://xpuhbtsgwhgbcvmwzlyd.supabase.co` | The full HTTP/HTTPS URL of your Supabase project. (Do NOT use just the project reference ID). |
| `VITE_SUPABASE_ANON_KEY` | Yes | `sb_publishable_` | `sb_publishable_Rt97581bW4IkOBl...` | The public anonymous key for authentication and database queries. |

---

## 2. Pre-Build Validation Process

A validation script [scripts/validate-env.js](file:///d:/GitHub/ashok-portfolio/scripts/validate-env.js) is executed automatically before every production build (`npm run build`).

### What It Does:
1. **Loads Local Configuration:** Checks for a local `.env` file on disk and merges any defined variables into the runner's environment (useful for local builds).
2. **Validates Formats:**
   * Assertions for `VITE_SUPABASE_URL`: Must exist, start with `https://`, and match the standard Supabase project URL format (`https://<project-id>.supabase.co`).
   * Assertions for `VITE_SUPABASE_ANON_KEY`: Must exist, not be empty, and start with the prefix `sb_publishable_`.
3. **Aborts Invalid Builds:** If any check fails, the script outputs descriptive diagnostics and exits with code `1`, halting the compilation and blocking deployment.

---

## 3. Troubleshooting Guide

### Issue: "❌ Missing VITE_SUPABASE_URL" / "❌ Missing VITE_SUPABASE_ANON_KEY"
* **Local Development:** Verify that a `.env` file exists in your project root and contains the variables.
* **Production/CI:** Check your GitHub repository settings under *Settings > Secrets and variables > Actions* and confirm that repository secrets `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are defined.

### Issue: "❌ Invalid VITE_SUPABASE_URL"
* **Reason:** The value is not a full URL or is a placeholder.
* **Fix:** Ensure you did not copy the project Reference ID (e.g., `txoszrnjkrlbjzpjisvp`) alone. The URL must start with `https://` and end with `.supabase.co`.

### Issue: "❌ Invalid VITE_SUPABASE_ANON_KEY"
* **Reason:** The key does not start with the required `sb_publishable_` prefix.
* **Fix:** Check that you copied the correct API Anon Key from the Supabase dashboard (*Settings > API*).

---

## 4. Deployment Checklist Additions

Before pushing commits to the `main` branch:
- [ ] Run `npm run build` locally to verify that build validation passes.
- [ ] If changing Supabase projects, update both the local `.env` file and the GitHub repository secrets in the repository settings page.
- [ ] After pushing, monitor the GitHub Actions workflow logs. Verify the `Verify Environment Variables 🔍` step outputs `✓ VITE_SUPABASE_URL detected` and `✓ VITE_SUPABASE_ANON_KEY detected`.
