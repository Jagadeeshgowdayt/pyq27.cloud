# 📁 Bulk Upload Guide

## Filename Format

### Required Format
```
SubjectName_School_PageNo.extension
```

### Components
- **SubjectName**: The name of the subject (can include underscores for multi-word names)
- **School**: The school/department code (e.g., SOCSE, SOBS, SOME)
- **PageNo**: The page number (must be a number: 1, 2, 3, etc.)
- **extension**: Image file extension (.jpeg, .jpg, .png, .gif, .webp)

## ✅ Valid Examples

```
computer_networks_socse_1.jpeg
computer_networks_socse_2.jpeg
computer_networks_socse_3.jpeg
data_structures_socse_1.png
data_structures_socse_2.png
operating_systems_socs_1.jpg
thermodynamics_soms_1.jpeg
thermodynamics_soms_2.jpeg
fluid_mechanics_some_1.png
mathematics_sobs_1.jpeg
physics_sops_1.jpg
digital_electronics_soece_1.png
```

## ❌ Invalid Examples

```
❌ computer_networks_1.jpeg          (Missing school)
❌ computer_networks_socse.jpeg      (Missing page number)
❌ computernetworks_socse_1.jpeg     (Should use underscores)
❌ computer_networks_socse_one.jpeg  (Page number must be numeric)
❌ socse_computer_networks_1.jpeg    (Wrong order)
```

## 🎯 How It Works

### 1. **Automatic Grouping**
Files with the same subject and school are automatically grouped into one question paper:

```
computer_networks_socse_1.jpeg  ┐
computer_networks_socse_2.jpeg  ├─► Grouped as "Computer Networks (SOCSE)" - 3 pages
computer_networks_socse_3.jpeg  ┘

data_structures_socse_1.jpeg    ┐
data_structures_socse_2.jpeg    ├─► Grouped as "Data Structures (SOCSE)" - 2 pages
```

### 2. **Metadata Extraction**
The system automatically extracts:
- **Subject**: `computer_networks` → "Computer Networks"
- **School**: `socse` → "SOCSE"
- **Page Number**: `1`, `2`, `3`, etc.

### 3. **Text Formatting**
- Subject names are automatically formatted with proper capitalization
- Underscores in subject names are converted to spaces
- School codes are converted to uppercase

## 📤 Bulk Upload Steps

### Step 1: Prepare Your Files
Rename all your question paper images following the format:
```
subject_name_school_pagenum.extension
```

### Step 2: Access Admin Panel
1. Click the "Admin Upload" button
2. Enter admin password (default: `admin123`)

### Step 3: Select Files
1. Click on the file input or drag & drop
2. Select multiple files at once (you can select hundreds!)
3. The system will automatically:
   - Parse filenames
   - Group related pages
   - Show preview with detected metadata

### Step 4: Review
The preview will show:
- ✅ Valid files with detected metadata
- ⚠️ Invalid files that need manual entry
- 📚 Grouped papers with page counts

### Step 5: Upload
- Click "Upload Paper" button
- All valid files will be uploaded with auto-detected metadata
- Invalid files will be skipped (rename and try again)

## 🏫 Common School Codes

| Code | School Name |
|------|------------|
| SOCSE | School of Computer Science & Engineering |
| SOBS | School of Basic Sciences |
| SOME | School of Mechanical Engineering |
| SOECE | School of Electronics & Communication Engineering |
| SOCE | School of Civil Engineering |
| SOCS | School of Chemical Sciences |
| SOPS | School of Physical Sciences |
| SOMS | School of Mathematical Sciences |
| SOBT | School of Biotechnology |
| SOMC | School of Management & Commerce |

## 💡 Tips & Best Practices

### 1. **Consistent Naming**
Always use the same format for all pages of a question paper:
```
✅ Good:
- algorithms_socse_1.jpeg
- algorithms_socse_2.jpeg
- algorithms_socse_3.jpeg

❌ Bad:
- algorithms_socse_1.jpeg
- algorithms_SOCSE_2.jpeg  (inconsistent case)
- algorithms_socse_page3.jpeg  (different format)
```

### 2. **Use Underscores**
For multi-word subject names, use underscores:
```
✅ computer_networks_socse_1.jpeg
✅ data_structures_and_algorithms_socse_1.jpeg
✅ object_oriented_programming_socse_1.jpeg
```

### 3. **Sequential Page Numbers**
Use sequential numbering starting from 1:
```
✅ _1.jpeg, _2.jpeg, _3.jpeg
❌ _01.jpeg, _02.jpeg (avoid leading zeros, but will still work)
```

### 4. **Batch Organization**
Organize files in folders before uploading:
```
My_Question_Papers/
├── Computer_Networks/
│   ├── computer_networks_socse_1.jpeg
│   ├── computer_networks_socse_2.jpeg
│   └── computer_networks_socse_3.jpeg
├── Data_Structures/
│   ├── data_structures_socse_1.jpeg
│   └── data_structures_socse_2.jpeg
```

### 5. **Test with Small Batch**
Start with 2-3 papers to verify the naming format works correctly.

## 🔧 Troubleshooting

### Problem: Files Not Grouping
**Solution**: Ensure subject name and school code are exactly the same:
```
❌ computer_networks_socse_1.jpeg
❌ Computer_Networks_socse_2.jpeg  (Different capitalization)

✅ computer_networks_socse_1.jpeg
✅ computer_networks_socse_2.jpeg  (Consistent)
```

### Problem: "Invalid Format" Warning
**Reasons**:
1. Missing components (subject, school, or page number)
2. Page number is not numeric
3. Incorrect separator (must use underscores `_`)

**Solution**: Check the filename carefully and rename:
```
❌ networks-socse-1.jpeg  (using dashes)
✅ networks_socse_1.jpeg  (using underscores)
```

### Problem: Manual Entry Required
If you have files that don't match the format:
1. Upload them separately using manual mode
2. Or rename them to match the bulk upload format

## 📊 Example Bulk Upload Session

### Scenario
You have 5 question papers with multiple pages each:

```
Files to Upload:
1. computer_networks_socse_1.jpeg
2. computer_networks_socse_2.jpeg
3. computer_networks_socse_3.jpeg
4. database_systems_socse_1.jpeg
5. database_systems_socse_2.jpeg
6. operating_systems_socs_1.jpeg
7. operating_systems_socs_2.jpeg
8. operating_systems_socs_3.jpeg
9. operating_systems_socs_4.jpeg
10. algorithms_socse_1.jpeg
```

### Result
The system will automatically create:
- **Computer Networks (SOCSE)** - 3 pages
- **Database Systems (SOCSE)** - 2 pages
- **Operating Systems (SOCS)** - 4 pages
- **Algorithms (SOCSE)** - 1 page

All in a single upload session!

## ⚠️ Important Notes

1. **File Size**: Keep individual files under 2MB for best performance
2. **Browser Storage**: Browser localStorage has limits (typically 5-10MB per domain)
3. **Format Validation**: Invalid files will be skipped, not uploaded
4. **Manual Override**: If bulk upload doesn't work, use manual upload mode
5. **No Year Required**: The new format doesn't use year, only subject and school

## 🎓 Ready to Upload!

Once your files are properly named, the bulk upload process takes just seconds:
1. Select all files
2. System auto-groups them
3. Click upload
4. Done! ✨

Happy uploading! 🚀