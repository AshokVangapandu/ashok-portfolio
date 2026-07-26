# Production Release & Verification Guide

This document details the repeatable release process, verification checklists, and rollback procedures for deploying Ashok's Portfolio website.

---

## 1. Production Release Checklist

Use this checklist for every production release to ensure build safety and execution integrity.

### Phase A: Pre-Release Development
- [ ] **Working Tree Clean:** Run `git status` to verify there are no uncommitted changes.
- [ ] **Dependencies Installed:** Run `npm ci` to ensure all clean production dependencies match the lockfile.
- [ ] **Lint and Type Check:** Run `npx tsc --noEmit` to verify TypeScript type-safety across the codebase.
- [ ] **Environment Validation:** Verify local `.env` has valid format configurations.

### Phase B: Local Build & Diagnostics
- [ ] **Run Build:** Execute `npm run build`.
- [ ] **Check Build Logs:** Confirm the validation step completes successfully:
  * `✓ VITE_SUPABASE_URL detected`
  * `✓ Valid HTTPS URL`
  * `✓ VITE_SUPABASE_ANON_KEY detected`
  * `✓ Environment validation passed`
- [ ] **No Warnings:** Confirm there are no compilation warnings or errors.

### Phase C: Local Verification (Smoke Test)
- [ ] **Start Preview:** Execute `npm run preview` to spin up a local server serving the `dist/` directory.
- [ ] **Feature Audit:** Navigate the local preview (`http://localhost:4173`) and test:
  - [ ] **Home:** Hero section, dynamic overlays, animations load correctly.
  - [ ] **Expertise:** Grid cards populate and display matching metadata chips.
  - [ ] **Process:** Timeline build steps display chronological items.
  - [ ] **Widgets/Projects:** Navigate to dynamic folders, verify layouts populate correctly.
- [ ] **Browser Console Audit:** Inspect DevTools console. Ensure there are no JavaScript errors, uncaught exceptions, or unexpected warnings.
- [ ] **Browser Network Audit:** Inspect DevTools network tab. Confirm all requests return `200 OK` (no `404 Not Found` or `500 Internal Server Error`).

---

## 2. Deployment Verification Guide

Once the release branch is pushed to GitHub and the pipeline deploys to GitHub Pages:

### Step 1: GitHub Actions Run Verification
1. Go to the Actions tab of the repository on GitHub.
2. Select the latest run of **Deploy to GitHub Pages**.
3. Confirm all steps under the job completed successfully.
4. Verify in the logs that `Verify Environment Variables 🔍` outputs:
   ```
   ✓ VITE_SUPABASE_URL detected
   ✓ VITE_SUPABASE_ANON_KEY detected
   ```

### Step 2: Production Smoke Test
Visit `https://ashokvangapandu.com/` and perform a live sanity check:
1. **Homepage:** Verify that the loader overlay disappears and the Hero, Avatar, Expertise, and Process sections load correctly.
2. **Subpages:** Navigate to the Widgets page (`/widgets/`) and Projects page (`/pages/projects/`). Ensure they are not blank and show items.
3. **Contact Form:** Submit a mock message on the contact form to confirm the pipeline is active.
4. **Console Integrity:** Open DevTools console. Verify there are no red syntax errors or uncaught exceptions. (If Supabase is intentionally disabled or offline, verify it outputs the descriptive `[Portfolio] Supabase disabled.` warning instead of crashing the thread).

---

## 3. Rollback Procedure

In the event of a critical issue or regression in production:

### A. How to Identify a Failed Deployment
- The website displays a completely blank page on loading.
- Browser DevTools console outputs uncaught runtime/syntax errors.
- Network assets (CSS, JS bundles) fail to load with `404` errors.
- Forms or dynamic grids crash when loaded.

### B. Rollback Recovery Protocol
Since the site is hosted on GitHub Pages and deployed using a deployment branch (`gh-pages`), the fastest rollback method is using git on the local command line:

1. **Locate the Previous Working Commit:**
   Find the SHA-1 of the last known good commit on the `main` branch or the deploy logs:
   ```bash
   git log --oneline
   ```
2. **Revert or Reset Main to Last Good Commit:**
   If you need to quickly push the rollback:
   ```bash
   # Reset local main branch to the last working commit
   git reset --hard <GOOD_COMMIT_SHA>
   
   # Force push the working version to trigger GitHub Actions redeployment
   git push origin main --force
   ```
3. **Alternative: Force Push directly to gh-pages (Instant Rollback):**
   If the build pipeline is down and you need to restore the live site immediately, you can force push the local `dist` folder directly to the `gh-pages` branch:
   ```bash
   # Build the last known good state locally
   git checkout <GOOD_COMMIT_SHA>
   npm ci
   npm run build
   
   # Push the dist folder directly to gh-pages branch
   npx gh-pages -d dist
   ```
4. **Verification:** Verify that the live site is restored and console errors disappear.
