# Question Papers Data

This folder stores uploaded question paper images.

## Structure:
```
papers/
  ├── 1234567890/
  │   ├── page_1.jpg
  │   ├── page_2.jpg
  │   └── ...
  └── papers.json (metadata)
```

## Upload Process:
1. Admin uploads images via admin panel
2. Images are stored in browser localStorage
3. To make them permanent, export the data using the export button
4. Commit the exported data to this folder
