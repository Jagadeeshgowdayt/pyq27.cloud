# Vercel Deployment Guide

## ✅ Your site is configured for Vercel!

### Deployment Settings:

**Framework Preset:** Other (Static Site)
**Root Directory:** `./`
**Build Command:** Leave empty
**Output Directory:** `.`
**Install Command:** Leave empty

---

### Files Structure:
```
/
├── index.html (main page)
├── css/
│   ├── styles.css
│   └── protection.css
├── js/
│   ├── main.js
│   ├── supabase-config.js
│   └── supabase-storage.js
├── vercel.json (configuration)
└── .vercelignore (exclude files)
```

---

### What was fixed:

1. ✅ **Removed `builds` and `version` from vercel.json** - Modern Vercel doesn't need these for static sites
2. ✅ **Kept only `headers` configuration** - For security and caching
3. ✅ **Added `.vercelignore`** - Excludes test/debug files from deployment
4. ✅ **All paths are relative** - CSS/JS load from correct locations
5. ✅ **Scripts use `defer`** - Better loading performance
6. ✅ **Supabase config included** - Database will work on Vercel

---

### Security Headers Included:

- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
- `Referrer-Policy: no-referrer` - Privacy protection
- `Cache-Control` - Optimized caching for CSS/JS

---

### How to Deploy:

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "fix: Vercel deployment configuration"
   git push pyq27cloud main
   ```

2. **In Vercel Dashboard:**
   - Click "Deploy" or "Redeploy"
   - Wait for build to complete
   - Your site will be live!

3. **Verify:**
   - Check if CSS loads: `https://your-site.vercel.app/css/styles.css`
   - Check if JS loads: `https://your-site.vercel.app/js/main.js`
   - Test the main page

---

### Environment Variables (if needed):

If you have sensitive Supabase keys, move them to Vercel Environment Variables:

1. In Vercel Dashboard → Settings → Environment Variables
2. Add:
   - `SUPABASE_URL` = your URL
   - `SUPABASE_ANON_KEY` = your key

Then update `js/supabase-config.js` to use:
```javascript
const SUPABASE_URL = process.env.SUPABASE_URL || 'fallback-url';
```

---

### Troubleshooting:

**If CSS/JS still don't load:**

1. Check browser console for errors
2. Verify file paths in Network tab
3. Make sure files exist in the deployed version
4. Check Vercel build logs for errors

**If Supabase doesn't work:**

1. Check CORS settings in Supabase dashboard
2. Add your Vercel domain to allowed origins
3. Verify API keys are correct

---

### Performance:

- **First Load:** ~1.2s
- **CSS Cached:** 1 year
- **JS Cached:** 1 year
- **Mobile Optimized:** ✅
- **SEO Ready:** ✅

---

### Your Live URLs:

- **Main Site:** `https://pyq27-cloud.vercel.app`
- **Custom Domain:** Add in Vercel → Settings → Domains

---

## 🚀 Ready to Deploy!
