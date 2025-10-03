# 🚀 Quick Setup Guide - Supabase Storage

## ⚡ 5-Minute Setup

### 1️⃣ Create Supabase Storage Bucket

1. Open Supabase Dashboard: https://app.supabase.com/project/qnxhmmubhfzmvfvmzbud/storage/buckets
2. Click **"New Bucket"**
3. Bucket name: `question-papers`
4. Check ✅ **"Public bucket"**
5. Click **"Create bucket"**

### 2️⃣ Add Storage Policies

Click on `question-papers` bucket → **Policies** tab → Click **"New Policy"**

**Add these 3 policies:**

#### Policy 1: Public Read
- Policy name: `Public read access`
- Allowed operation: `SELECT`
- Target roles: `public`
- Click **"Review"** then **"Save policy"**

Or use SQL editor:
```sql
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'question-papers');
```

#### Policy 2: Allow Uploads  
- Policy name: `Allow uploads`
- Allowed operation: `INSERT`
- Target roles: `anon, authenticated`

Or use SQL:
```sql
CREATE POLICY "Allow uploads"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'question-papers');
```

#### Policy 3: Allow Deletes
- Policy name: `Allow deletes`
- Allowed operation: `DELETE`
- Target roles: `anon, authenticated`

Or use SQL:
```sql
CREATE POLICY "Allow deletes"
ON storage.objects FOR DELETE
USING (bucket_id = 'question-papers');
```

### 3️⃣ Test Upload

1. Deploy your site to Vercel
2. Go to `/adminj.html`
3. Login with password: `admin@123`
4. Upload a test question paper
5. Images will now be stored in Supabase! ✅

## 📊 Storage Limits (Free Tier)

- **Storage:** 1 GB (enough for ~2000 question paper photos)
- **Bandwidth:** 2 GB/month
- **File size:** Up to 50 MB per file

## 🔍 Verify Setup

1. Go to Supabase Storage: https://app.supabase.com/project/qnxhmmubhfzmvfvmzbud/storage/buckets/question-papers
2. After uploading, you should see folders like `papers/1234567890/`
3. Click on a folder to see uploaded images

## ❓ Troubleshooting

### Issue: "Failed to upload"
- Check if bucket `question-papers` exists
- Verify all 3 policies are added
- Check browser console for errors

### Issue: "403 Forbidden"
- Make sure bucket is set to **Public**
- Verify policy for public SELECT exists

### Issue: Images not loading
- Check the public URL in Supabase Storage
- Verify CORS settings if needed

## 🎉 Done!

Your question papers are now stored in the cloud and accessible to all users!

**Next Steps:**
- Upload your question papers via admin panel
- Share the link with students
- Monitor storage usage in Supabase dashboard
