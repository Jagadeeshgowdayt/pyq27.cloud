# Question Paper Collection Website

A comprehensive web application for displaying and managing college question paper collections with advanced protection features and mobile-friendly design.

## Features

### 🔒 **Security & Protection**
- Right-click disabled on all images
- Keyboard shortcuts (F12, Ctrl+U, etc.) disabled
- Drag & drop prevention
- Text selection disabled on images
- Print protection
- Developer tools detection and blocking
- Source code obfuscation

### 📱 **User Interface**
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Fast Search**: Real-time search by subject name or year
- **Smart Filters**: Filter by year and subject with dropdown menus
- **Grid Layout**: Clean card-based layout showing paper details

### 📖 **Multi-Page Viewer**
- **Page Navigation**: Next/Previous buttons for multi-page documents
- **Touch Gestures**: Swipe left/right on mobile devices
- **Keyboard Navigation**: Arrow keys for page navigation
- **Zoom Controls**: Zoom in/out functionality
- **Fullscreen Mode**: Immersive viewing experience
- **Page Counter**: Shows current page and total pages

### 🔐 **Admin Upload System**
- **Password Protected**: Secure admin access (default: admin123)
- **Bulk Upload**: Upload hundreds of files at once with automatic metadata extraction
- **Smart Grouping**: Files are automatically grouped by subject and year from filename
- **Filename Pattern**: `SubjectName_Year_PageNo.jpg` (e.g., `Mathematics_2024_1.jpg`)
- **Live Preview**: See grouped papers with page counts before upload
- **Manual Mode**: Traditional upload with form fields for single papers
- **File Management**: Remove individual groups before upload

### 💾 **Data Management**
- **Local Storage**: All data stored in browser's local storage
- **No Server Required**: Runs completely client-side
- **Instant Loading**: Fast access to papers
- **Persistent Data**: Papers remain available across browser sessions

## 🚀 Vercel Deployment (Recommended)

### One-Click Deploy:
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Jagadeeshgowdayt/QP-U-WEBSITE)

### Manual Deployment:
1. **Fork this repository** to your GitHub account
2. **Go to [Vercel.com](https://vercel.com)** and sign in with GitHub
3. **Click "New Project"** and import your forked repository
4. **Click "Deploy"** - Your site will be live in seconds! 🎉

Your website will be available at: `https://your-project-name.vercel.app`

## Quick Start (Local)

1. **Open the Website**
   ```
   Simply open index.html in any modern web browser
   ```

2. **Add Question Papers**
   
   **Option A - Bulk Upload (Recommended for multiple papers):**
   - Rename your files using pattern: `SubjectName_Year_PageNo.jpg`
   - Examples: 
     - `Mathematics_2024_1.jpg`
     - `Mathematics_2024_2.jpg`
     - `Physics_2023_1.png`
   - Click "Admin Upload" → Enter password `admin123`
   - Select multiple files at once (50-100+ files)
   - Files are automatically grouped by subject and year
   - Click "Upload Paper"
   
   **Option B - Manual Upload (For single papers):**
   - Click "Admin Upload" → Enter password `admin123`
   - Fill in subject and year
   - Select image files for that paper
   - Click "Upload Paper"
   
   📖 **See [BULK-UPLOAD-GUIDE.md](BULK-UPLOAD-GUIDE.md) for detailed instructions**

3. **Browse Papers**
   - Use the search bar to find specific papers
   - Filter by year or subject using dropdown menus
   - Click on any paper card to view it

4. **View Papers**
   - Use Next/Previous buttons to navigate pages
   - Zoom in/out using the control buttons
   - Press ESC to close the viewer
   - Use arrow keys for keyboard navigation
   - Swipe left/right on mobile devices

## File Structure

```
QP-U-WEBSITE/
├── index.html          # Main HTML file
├── vercel.json         # Vercel deployment configuration
├── package.json        # Project metadata for deployment
├── DEPLOY.md          # Detailed deployment guide
├── css/
│   ├── styles.css      # Main CSS styles
│   └── protection.css  # Security and protection styles
├── js/
│   └── main.js         # JavaScript functionality and protection
├── data/               # Directory for any additional data files
├── .gitignore         # Git ignore file
└── README.md          # This file
```

## Browser Compatibility

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🔐 Security Notes

### For Production Deployment:
1. **Change the default password** in `js/main.js` line 72:
   ```javascript
   if (password === "YOUR_SECURE_PASSWORD") {
   ```

2. **Remove sample data** in production by commenting out the `addSampleData()` call in `main.js`

3. **Vercel automatically provides**:
   - HTTPS encryption
   - Security headers
   - DDoS protection
   - Global CDN

### Protection Features:
- Images are stored as base64 data in local storage
- Multiple layers of right-click and keyboard shortcut protection
- Developer tools detection and blocking
- Automatic console clearing
- Print protection that hides images during printing

## Customization

### Changing Colors:
Edit the CSS variables in `css/styles.css`:
```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
}
```

### Adding More Filters:
Extend the filter system in `js/main.js` by modifying the `filterPapers()` method.

### Mobile Optimization:
The site is already optimized for mobile with:
- Touch gesture support
- Responsive grid layout
- Mobile-friendly button sizes
- Optimized image loading

## 📊 Sample Data Included

The website comes with **7 realistic question papers** for testing:
- **Mathematics** (2024) - 3 pages with calculus, linear algebra, complex analysis
- **Physics** (2024) - 2 pages with quantum mechanics, wave theory
- **Chemistry** (2023) - 1 page with organic chemistry reactions
- **Computer Science** (2024) - 2 pages with algorithms, databases, ML
- **Biology** (2023) - 1 page with molecular biology concepts
- **Engineering Mechanics** (2024) - 1 page with statics and dynamics
- **Statistics** (2023) - 1 page with probability and hypothesis testing

## 💾 Data Storage

All question papers are stored in the browser's local storage as base64 encoded images. This means:
- **No server required** - everything runs client-side
- **Data persists** across browser sessions
- **Storage limit** - typically 5-10MB per domain (varies by browser)
- **Privacy** - data stays on the user's device
- **Vercel hosting** - Static files served from global CDN

## Troubleshooting

### Papers not showing:
1. Check if JavaScript is enabled
2. Clear browser cache and reload
3. Check browser console for errors

### Upload not working:
1. Ensure images are in supported formats (JPEG, PNG, GIF, WebP)
2. Check file sizes (large files may cause issues)
3. Try uploading fewer files at once

### Mobile issues:
1. Ensure the browser supports touch events
2. Check if the viewport meta tag is present
3. Test in different mobile browsers

## Performance Tips

1. **Optimize Images**: Compress images before upload for better performance
2. **File Limits**: Keep individual files under 2MB for best results
3. **Browser Storage**: Monitor local storage usage to avoid limits
4. **Mobile Data**: Consider image compression on mobile networks

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please check the browser console for error messages and ensure all files are properly loaded.