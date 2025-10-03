# Database Migration Guide - Moving Papers to Supabase

## 🎯 What Changed?

Your website now uses **Supabase Database** instead of just browser localStorage. This means:

✅ Papers are accessible from **any device**  
✅ Works on **Vercel deployment**  
✅ **No data loss** when clearing browser  
✅ **Faster** and more reliable  

---

## 📋 Step-by-Step Setup

### Step 1: Create Database Table in Supabase

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy and paste the SQL from `supabase-database-setup.sql`
6. Click **Run** (or press Ctrl+Enter)

**Expected Output:**
```
Success! Created table question_papers
Success! Created policies
Success! Created view papers_summary
```

---

### Step 2: Migrate Existing Papers

**Option A: Using the Migration Tool (Recommended)**

1. Open `migrate-to-database.html` in your browser
2. Click "Refresh Counts" to see your local papers
3. Click "Start Migration"
4. Wait for migration to complete
5. Verify counts match

**Option B: Manual Re-upload**

1. Go to `adminjs.html` admin panel
2. Re-upload your question papers
3. They will automatically be saved to the database

---

### Step 3: Verify Everything Works

1. Open `index.html` in your browser
2. You should see all papers loading from database
3. Try searching, opening papers, etc.
4. Open browser DevTools Console (F12)
5. You should see: `✅ Loaded X papers from database`

---

### Step 4: Deploy to Vercel

1. Commit and push all changes:
   ```bash
   git add .
   git commit -m "feat: Add Supabase database for paper metadata"
   git push pyq27cloud main
   ```

2. Vercel will automatically redeploy

3. Visit your Vercel URL - papers should now appear!

---

## 🔧 New Files Added

1. **`js/supabase-papers-db.js`** - Database operations (CRUD)
2. **`supabase-database-setup.sql`** - SQL to create table
3. **`migrate-to-database.html`** - Migration tool
4. **`DATABASE_MIGRATION_GUIDE.md`** - This file

---

## 📊 Database Structure

**Table: `question_papers`**

| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Unique paper ID (timestamp-based) |
| subject | TEXT | Subject name (e.g., "Math", "Computer Networks") |
| upload_date | TIMESTAMPTZ | When paper was uploaded |
| total_pages | INTEGER | Number of pages in the paper |
| storage_type | TEXT | 'supabase' or 'local' |
| source | TEXT | 'auto-detected' or 'manual' |
| doc_no | INTEGER | Document number (for multiple papers of same subject) |
| pages | JSONB | Array of page objects with URLs |
| created_at | TIMESTAMPTZ | Row creation time |
| updated_at | TIMESTAMPTZ | Last update time |

---

## 🔍 How It Works Now

### Before (localStorage only):
```
Upload Papers → Save to localStorage → View on same browser only
```

### After (with database):
```
Upload Papers → Save to Supabase Database → Accessible anywhere
                 ↓
           Also backup to localStorage (for offline)
```

### Loading Papers:
```
Page Load → Load from Supabase DB → Display papers
             ↓
       Fallback to localStorage if offline
```

---

## 🚨 Troubleshooting

### "No papers showing on Vercel"
- ✅ **Solved!** Run the migration tool to move papers to database
- Papers in localStorage are browser-specific and won't appear on Vercel

### "Error loading papers from database"
- Check Supabase SQL was run successfully
- Verify RLS policies are created
- Check browser console for error messages
- Verify SUPABASE_URL and SUPABASE_ANON_KEY are correct

### "Migration fails"
- Check internet connection
- Verify Supabase credentials in `js/supabase-config.js`
- Check browser console for specific errors
- Try migrating papers one at a time

### "Papers duplicated"
- Migration tool checks for existing papers before adding
- If duplicates occur, delete from Supabase Table Editor

---

## 📱 Testing Checklist

- [ ] Run SQL setup in Supabase
- [ ] Migrate existing papers
- [ ] Upload a new paper from admin panel
- [ ] Verify paper appears on main page
- [ ] Open paper in viewer
- [ ] Search for papers
- [ ] Share on WhatsApp
- [ ] Check on mobile device
- [ ] Deploy to Vercel
- [ ] Verify works on Vercel URL

---

## 💾 Data Flow

```
┌─────────────────┐
│  Admin Upload   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Supabase Storage│ ← Images (JPG/PNG files)
│   (Files)       │
└─────────────────┘
         +
┌─────────────────┐
│ Supabase DB     │ ← Metadata (subject, pages, URLs)
│   (Table)       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Main Website   │ ← Loads from DB
│  (index.html)   │
└─────────────────┘
```

---

## 🎉 Benefits

1. **Universal Access** - Papers visible from any device
2. **Vercel Compatible** - Works on cloud deployment
3. **No Data Loss** - Data persists even if browser cleared
4. **Better Performance** - Database queries faster than localStorage
5. **Scalable** - Can handle thousands of papers
6. **Searchable** - Database supports advanced queries
7. **Backup** - Still saves to localStorage as fallback

---

## 📞 Support

If you encounter issues:

1. Check browser console (F12) for errors
2. Verify Supabase dashboard → Table Editor → `question_papers` has data
3. Test with a simple paper upload first
4. Check Supabase logs in Dashboard → Logs

---

**Next:** Run the SQL setup, then use the migration tool to move your papers! 🚀
