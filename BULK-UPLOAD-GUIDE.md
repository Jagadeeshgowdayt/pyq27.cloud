# 📚 Bulk Upload Guide

## Filename Pattern for Bulk Upload

The system automatically extracts metadata from filenames using this pattern:

```
SubjectName_Year_PageNo.extension
```

### Components:
- **SubjectName**: The subject/topic name (use hyphens for spaces)
- **Year**: The year (e.g., 2024, 2023)
- **PageNo**: Page number (1, 2, 3, etc.)
- **extension**: File format (jpg, jpeg, png, gif, webp)

## ✅ Valid Examples

### Single Subject, Multiple Pages:
```
Mathematics_2024_1.jpg
Mathematics_2024_2.jpg
Mathematics_2024_3.jpg
```
These will be automatically grouped as **ONE** question paper with 3 pages.

### Multiple Subjects:
```
Physics_2023_1.png
Physics_2023_2.png
Chemistry_2024_1.jpg
Chemistry_2024_2.jpg
Biology_2023_1.jpg
```
This will create:
- **Physics 2023** with 2 pages
- **Chemistry 2024** with 2 pages  
- **Biology 2023** with 1 page

### Subject Names with Spaces:
```
Computer-Science_2024_1.jpg
Computer-Science_2024_2.jpg
Data-Structures_2023_1.png
Operating-Systems_2024_1.jpg
```
Hyphens in subject names are automatically converted to spaces.

### Mixed Years and Subjects:
```
Mathematics_2024_1.jpg
Mathematics_2024_2.jpg
Mathematics_2023_1.jpg
Physics_2024_1.png
Physics_2024_2.png
Physics_2023_1.png
```
This creates 4 separate papers:
- Mathematics 2024 (2 pages)
- Mathematics 2023 (1 page)
- Physics 2024 (2 pages)
- Physics 2023 (1 page)

## 🎯 Step-by-Step Bulk Upload Process

### Step 1: Prepare Your Files
1. Scan or photograph all question paper pages
2. Name each file according to the pattern above
3. Keep all files in one folder for easy selection

### Step 2: Upload
1. Click **"Admin Upload"** button
2. Enter admin password (default: `admin123`)
3. Click **"Select Images"** button
4. Select ALL files at once (you can select 100+ files)
5. Preview will show grouped papers automatically

### Step 3: Verify
- Check the preview showing grouped papers
- Each group shows: Subject, Year, and page count
- Page numbers are displayed on thumbnails
- Remove any group if needed using "Remove Group" button

### Step 4: Submit
- Click **"Upload Paper"** button
- All papers will be uploaded and grouped automatically
- Manual Subject/Year fields are ignored in bulk mode

## 🔄 How Grouping Works

Files are grouped by: `SubjectName_Year`

Example grouping:
```
Input Files:
├── Mathematics_2024_1.jpg  ┐
├── Mathematics_2024_2.jpg  ├─► Mathematics 2024 (2 pages)
├── Mathematics_2024_3.jpg  ┘
├── Physics_2024_1.png      ┐
├── Physics_2024_2.png      ├─► Physics 2024 (2 pages)
└── Physics_2023_1.png      ─► Physics 2023 (1 page)

Result: 3 question papers uploaded
```

## 📝 Tips for Best Results

### 1. Consistent Naming
✅ **Good:**
```
Mathematics_2024_1.jpg
Mathematics_2024_2.jpg
Mathematics_2024_3.jpg
```

❌ **Bad:**
```
Mathematics_2024_1.jpg
Math_2024_2.jpg          ← Different subject name
Mathematics_2024_page3.jpg  ← Wrong format
```

### 2. Page Numbering
- Start from 1 for each paper
- Use sequential numbers (1, 2, 3, 4...)
- Pages are automatically sorted by number

### 3. File Formats
- Supported: JPG, JPEG, PNG, GIF, WebP
- Recommended: JPG for best compatibility
- Keep file sizes reasonable (under 5MB per image)

### 4. Subject Names
- Use descriptive names: `Computer-Science`, `Data-Structures`
- Avoid special characters except hyphens
- Use PascalCase or hyphens for multi-word names

## 🚀 Bulk Upload vs Manual Upload

### Bulk Upload (Automatic)
✅ **Advantages:**
- Upload hundreds of files at once
- Automatic metadata extraction
- Automatic grouping by subject and year
- Faster for large collections
- No need to fill form fields

**When to use:**
- You have many papers to upload
- Files follow the naming convention
- You want to save time

### Manual Upload (Form-based)
✅ **Advantages:**
- No need to rename files
- Simple for single papers
- Direct control over metadata

**When to use:**
- Single paper upload
- Files don't follow naming pattern
- Quick one-time uploads

## 🔧 Advanced Examples

### Example 1: Full Semester Upload
```
Semester-4/
├── Mathematics-4_2024_1.jpg
├── Mathematics-4_2024_2.jpg
├── Mathematics-4_2024_3.jpg
├── Physics-4_2024_1.jpg
├── Physics-4_2024_2.jpg
├── Chemistry-Lab_2024_1.jpg
├── Engineering-Drawing_2024_1.jpg
├── Engineering-Drawing_2024_2.jpg
```
Select all 8 files → Creates 4 papers automatically

### Example 2: Multiple Years Archive
```
Archive/
├── Mathematics_2024_1.jpg
├── Mathematics_2024_2.jpg
├── Mathematics_2023_1.jpg
├── Mathematics_2023_2.jpg
├── Mathematics_2022_1.jpg
```
Select all → Creates 3 separate papers (one per year)

### Example 3: Different Subjects Same Year
```
2024-Papers/
├── Math_2024_1.jpg
├── Math_2024_2.jpg
├── Physics_2024_1.jpg
├── Physics_2024_2.jpg
├── Chemistry_2024_1.jpg
├── Biology_2024_1.jpg
```
Select all → Creates 4 papers for 2024

## ⚠️ Common Mistakes to Avoid

### 1. Inconsistent Subject Names
❌ Wrong:
```
Math_2024_1.jpg
Mathematics_2024_2.jpg  ← Different subject name!
```
✅ Correct:
```
Mathematics_2024_1.jpg
Mathematics_2024_2.jpg
```

### 2. Wrong Separator
❌ Wrong:
```
Mathematics-2024-1.jpg    ← Using hyphens as separator
Mathematics 2024 1.jpg    ← Using spaces
```
✅ Correct:
```
Mathematics_2024_1.jpg    ← Using underscores
```

### 3. Missing Components
❌ Wrong:
```
Mathematics_1.jpg         ← Missing year
Mathematics_2024.jpg      ← Missing page number
2024_1.jpg               ← Missing subject
```
✅ Correct:
```
Mathematics_2024_1.jpg
```

### 4. Invalid Page Numbers
❌ Wrong:
```
Mathematics_2024_A.jpg    ← Letter instead of number
Mathematics_2024_01.jpg   ← Leading zero (works but not ideal)
Mathematics_2024_p1.jpg   ← Extra character
```
✅ Correct:
```
Mathematics_2024_1.jpg
Mathematics_2024_2.jpg
```

## 📊 Upload Capacity

- **Files per upload**: Unlimited (limited by browser memory)
- **Recommended batch size**: 50-100 files for optimal performance
- **File size limit**: 5-10MB per image (browser dependent)
- **Storage**: Uses browser's localStorage (typically 5-10MB total)

## 🔍 Verification After Upload

After successful upload:
1. Papers appear in the main grid
2. Each paper shows correct subject and year
3. Click to view and verify all pages
4. Use search/filter to find specific papers

## 💡 Pro Tips

1. **Organize Before Upload**: Create folders for each semester/year
2. **Batch Rename**: Use file renaming tools for large collections
3. **Quality Check**: Verify all images are clear before upload
4. **Backup**: Keep original scans/photos as backup
5. **Test First**: Try with 2-3 files to verify naming pattern works

## 🆘 Troubleshooting

### Issue: Files not grouping correctly
**Solution**: Check filename pattern matches exactly: `Subject_Year_Page.ext`

### Issue: Subject names have spaces
**Solution**: Use hyphens: `Computer-Science_2024_1.jpg`

### Issue: Upload fails
**Solution**: 
- Check file formats (JPG, PNG supported)
- Reduce batch size (try 20 files at a time)
- Ensure files aren't too large

### Issue: Pages in wrong order
**Solution**: Page numbers must be numeric and sequential (1, 2, 3...)

## 📞 Support

For issues or questions:
1. Check filename pattern matches examples above
2. Try with a small test batch first
3. Verify file formats are supported
4. Clear browser cache and retry if problems persist

---

**Ready to bulk upload? Click "Admin Upload" and select your properly named files! 🚀**