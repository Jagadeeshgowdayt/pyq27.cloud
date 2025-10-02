// Question Papers Data Storage
class QuestionPaperManager {
    constructor() {
        this.papers = JSON.parse(localStorage.getItem('questionPapers')) || [];
        this.currentViewing = null;
        this.currentPageIndex = 0;
        this.zoomLevel = 1;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderPapers();
        this.populateFilters();
        this.setupProtection();
    }

    setupEventListeners() {
        // Search functionality
        document.getElementById('searchInput').addEventListener('input', () => this.filterPapers());
        document.getElementById('searchBtn').addEventListener('click', () => this.filterPapers());
        
        // Filter dropdowns
        document.getElementById('yearFilter').addEventListener('change', () => this.filterPapers());
        document.getElementById('subjectFilter').addEventListener('change', () => this.filterPapers());

        // Admin modal
        document.getElementById('adminBtn').addEventListener('click', () => this.openAdminModal());
        
        // Modal close buttons
        document.querySelectorAll('.close').forEach(btn => {
            btn.addEventListener('click', (e) => this.closeModal(e.target.closest('.modal')));
        });

        // Click outside modal to close
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target);
            }
        });

        // Upload form
        document.getElementById('uploadForm').addEventListener('submit', (e) => this.handleUpload(e));
        document.getElementById('paperFiles').addEventListener('change', (e) => this.previewFiles(e));

        // Paper viewer controls
        document.getElementById('prevBtn').addEventListener('click', () => this.previousPage());
        document.getElementById('nextBtn').addEventListener('click', () => this.nextPage());
        document.getElementById('zoomInBtn').addEventListener('click', () => this.zoomIn());
        document.getElementById('zoomOutBtn').addEventListener('click', () => this.zoomOut());
        document.getElementById('fullscreenBtn').addEventListener('click', () => this.toggleFullscreen());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));

        // Touch gestures for mobile
        this.setupTouchGestures();
    }

    setupProtection() {
        // Disable right-click context menu
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            return false;
        });

        // Disable F12, Ctrl+Shift+I, Ctrl+U, etc.
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F12' || 
                (e.ctrlKey && e.shiftKey && e.key === 'I') ||
                (e.ctrlKey && e.shiftKey && e.key === 'C') ||
                (e.ctrlKey && e.key === 'u') ||
                (e.ctrlKey && e.key === 's') ||
                (e.key === 'PrintScreen')) {
                e.preventDefault();
                return false;
            }
        });

        // Disable drag and drop
        document.addEventListener('dragstart', (e) => {
            e.preventDefault();
            return false;
        });

        // Disable selection
        document.addEventListener('selectstart', (e) => {
            if (e.target.tagName === 'IMG') {
                e.preventDefault();
                return false;
            }
        });

        // Hide images when print is attempted
        window.addEventListener('beforeprint', () => {
            document.querySelectorAll('img').forEach(img => {
                img.style.display = 'none';
            });
        });

        window.addEventListener('afterprint', () => {
            document.querySelectorAll('img').forEach(img => {
                img.style.display = '';
            });
        });
    }

    setupTouchGestures() {
        let startX = 0;
        let startY = 0;

        document.getElementById('imageContainer').addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        document.getElementById('imageContainer').addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = startX - endX;
            const diffY = Math.abs(startY - endY);

            // Swipe threshold
            if (Math.abs(diffX) > 50 && diffY < 100) {
                if (diffX > 0) {
                    this.nextPage(); // Swipe left - next page
                } else {
                    this.previousPage(); // Swipe right - previous page
                }
            }
        });
    }

    openAdminModal() {
        const password = prompt("Enter admin password:");
        if (password === "admin123") { // Change this password!
            document.getElementById('adminModal').style.display = 'block';
        } else if (password !== null) {
            alert("Incorrect password!");
        }
    }

    closeModal(modal) {
        if (modal) {
            modal.style.display = 'none';
            // Reset upload form
            if (modal.id === 'adminModal') {
                document.getElementById('uploadForm').reset();
                document.getElementById('previewContainer').innerHTML = '';
            }
        }
    }

    parseFileName(filename) {
        // Expected format: SubjectName_School_PageNo.extension
        // Example: computer_networks_socse_1.jpg
        const nameWithoutExt = filename.substring(0, filename.lastIndexOf('.')) || filename;
        const parts = nameWithoutExt.split('_');
        
        if (parts.length >= 3) {
            // Last part should be page number
            const pageNo = parseInt(parts[parts.length - 1]);
            if (isNaN(pageNo)) {
                return null;
            }
            
            // Second to last is school
            const school = parts[parts.length - 2].trim();
            
            // Everything before school is subject name
            const subjectParts = parts.slice(0, -2);
            const subject = subjectParts.join(' ').replace(/-/g, ' ').trim();
            
            return {
                subject: this.capitalizeWords(subject),
                school: school.toUpperCase(),
                pageNo,
                baseFileName: `${subjectParts.join('_')}_${school}`,
                isValid: true
            };
        }
        
        return null;
    }

    capitalizeWords(text) {
        return text.split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
    }

    groupFilesByPaper(files) {
        const grouped = {};
        const invalidFiles = [];
        
        files.forEach((file, index) => {
            const metadata = this.parseFileName(file.name);
            
            if (metadata && metadata.isValid) {
                const key = metadata.baseFileName;
                if (!grouped[key]) {
                    grouped[key] = {
                        subject: metadata.subject,
                        school: metadata.school,
                        files: [],
                        isValid: true
                    };
                }
                grouped[key].files.push({
                    file,
                    pageNo: metadata.pageNo,
                    originalIndex: index
                });
            } else {
                invalidFiles.push({
                    file,
                    index,
                    error: 'Invalid filename format'
                });
            }
        });
        
        // Sort files within each group by page number
        Object.keys(grouped).forEach(key => {
            grouped[key].files.sort((a, b) => a.pageNo - b.pageNo);
        });
        
        return { grouped, invalidFiles };
    }

    async previewFiles(event) {
        const files = Array.from(event.target.files);
        const container = document.getElementById('previewContainer');
        container.innerHTML = '';

        if (files.length === 0) return;

        // Check if using bulk upload mode
        const { grouped, invalidFiles } = this.groupFilesByPaper(files);
        
        // Show warning for invalid files
        if (invalidFiles.length > 0) {
            const warningDiv = document.createElement('div');
            warningDiv.style.cssText = 'margin-bottom: 20px; padding: 15px; background: #fff3cd; border: 2px solid #ffc107; border-radius: 10px; color: #856404;';
            warningDiv.innerHTML = `
                <div style="display: flex; align-items: start; gap: 10px;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 24px; color: #ff6b6b;"></i>
                    <div style="flex: 1;">
                        <strong style="font-size: 16px;">⚠ ${invalidFiles.length} file(s) have incorrect format!</strong>
                        <p style="margin: 10px 0 5px 0;">Expected: <code>SubjectName_School_PageNo.jpeg</code></p>
                        <p style="margin: 5px 0;">Example: <code>computer_networks_socse_1.jpeg</code></p>
                        <details style="margin-top: 10px;">
                            <summary style="cursor: pointer; font-weight: bold;">Show invalid files</summary>
                            <ul style="margin: 10px 0 0 20px;">
                                ${invalidFiles.map(f => `<li><code>${this.escapeHtml(f.file.name)}</code></li>`).join('')}
                            </ul>
                        </details>
                        <p style="margin-top: 10px; font-weight: bold; color: #d9534f;">
                            ❌ These files will be skipped. Please rename and upload again.
                        </p>
                    </div>
                </div>
            `;
            container.appendChild(warningDiv);
        }
        
        if (Object.keys(grouped).length > 0) {
            // Bulk upload mode
            for (const [key, paperData] of Object.entries(grouped)) {
                const groupDiv = document.createElement('div');
                groupDiv.style.cssText = 'margin-bottom: 25px; padding: 15px; border: 2px solid #667eea; border-radius: 10px; background: #f7fafc;';
                
                groupDiv.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <div>
                            <div style="font-size: 18px; color: #667eea;">📚 ${this.escapeHtml(paperData.subject)}</div>
                            <div style="font-size: 14px; color: #718096; margin-top: 3px;">
                                <i class="fas fa-university"></i> ${this.escapeHtml(paperData.school)} | 
                                <i class="fas fa-file-image"></i> ${paperData.files.length} page(s)
                            </div>
                        </div>
                    </div>
                    <div id="group-${key}" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 10px;"></div>
                `;
                
                container.appendChild(groupDiv);
                
                const filesContainer = groupDiv.querySelector(`#group-${key}`);
                for (const fileData of paperData.files) {
                    if (fileData.file.type.startsWith('image/')) {
                        const previewItem = document.createElement('div');
                        previewItem.style.cssText = 'position: relative;';
                        
                        const img = document.createElement('img');
                        img.src = URL.createObjectURL(fileData.file);
                        img.alt = `Page ${fileData.pageNo}`;
                        img.style.cssText = 'width: 100%; height: auto; border-radius: 5px;';
                        
                        const pageLabel = document.createElement('div');
                        pageLabel.style.cssText = 'position: absolute; bottom: 5px; left: 5px; background: rgba(0,0,0,0.7); color: white; padding: 2px 6px; border-radius: 3px; font-size: 10px;';
                        pageLabel.textContent = `Page ${fileData.pageNo}`;
                        
                        previewItem.appendChild(img);
                        previewItem.appendChild(pageLabel);
                        filesContainer.appendChild(previewItem);
                    }
                }
            }
            
            // Store grouped data
            this.groupedFiles = grouped;
            
            // Show success message
            const infoDiv = document.createElement('div');
            infoDiv.style.cssText = 'margin-top: 15px; padding: 15px; background: #d4edda; border: 2px solid #c3e6cb; border-radius: 10px; color: #155724;';
            infoDiv.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-check-circle" style="font-size: 24px;"></i>
                    <div>
                        <strong style="font-size: 16px;">✅ Bulk Upload Ready!</strong><br>
                        <span>Found ${Object.keys(grouped).length} question paper(s) with ${files.length - invalidFiles.length} valid page(s).</span>
                    </div>
                </div>
            `;
            container.insertBefore(infoDiv, container.firstChild);
            
            // Disable manual fields
            document.getElementById('paperSubject').disabled = true;
            document.getElementById('paperSubject').value = '(Auto-detected)';
            document.getElementById('paperSchool').disabled = true;
            document.getElementById('paperSchool').value = '(Auto-detected)';
            
        } else {
            // Manual upload mode
            this.groupedFiles = null;
            document.getElementById('paperSubject').disabled = false;
            document.getElementById('paperSubject').value = '';
            document.getElementById('paperSchool').disabled = false;
            document.getElementById('paperSchool').value = '';
        }
    }

    async handleUpload(event) {
        event.preventDefault();
        
        const submitBtn = event.target.querySelector('.submit-btn');
        const fileInput = document.getElementById('paperFiles');
        const files = Array.from(fileInput.files);

        if (files.length === 0) {
            alert('Please select at least one image file.');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';

        try {
            let uploadedCount = 0;

            if (this.groupedFiles && Object.keys(this.groupedFiles).length > 0) {
                // Bulk upload mode
                for (const [key, paperData] of Object.entries(this.groupedFiles)) {
                    const pages = [];
                    
                    for (const fileData of paperData.files) {
                        const base64 = await this.fileToBase64(fileData.file);
                        pages.push({
                            name: fileData.file.name,
                            data: base64,
                            size: fileData.file.size,
                            pageNo: fileData.pageNo
                        });
                    }

                    const paper = {
                        id: Date.now() + uploadedCount,
                        subject: paperData.subject,
                        school: paperData.school,
                        pages: pages,
                        uploadDate: new Date().toISOString(),
                        totalPages: pages.length
                    };

                    this.papers.push(paper);
                    uploadedCount++;
                }

                alert(`✅ Successfully uploaded ${uploadedCount} question paper(s)!`);
                
            } else {
                // Manual upload mode
                const subject = document.getElementById('paperSubject').value.trim();
                const school = document.getElementById('paperSchool').value.trim();

                if (!subject || !school) {
                    alert('Please fill in subject and school.');
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-upload"></i> Upload Paper';
                    return;
                }

                const pages = [];
                for (const file of files) {
                    const base64 = await this.fileToBase64(file);
                    pages.push({
                        name: file.name,
                        data: base64,
                        size: file.size
                    });
                }

                const paper = {
                    id: Date.now(),
                    subject: subject,
                    school: school.toUpperCase(),
                    pages: pages,
                    uploadDate: new Date().toISOString(),
                    totalPages: pages.length
                };

                this.papers.push(paper);
                alert(`✅ Successfully uploaded ${paper.totalPages} page(s) for ${subject}!`);
            }

            this.savePapers();
            this.renderPapers();
            this.populateFilters();
            this.closeModal(document.getElementById('adminModal'));
            this.groupedFiles = null;
            
        } catch (error) {
            console.error('Upload error:', error);
            alert('❌ Error uploading files. Please try again.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-upload"></i> Upload Paper';
        }
    }

    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    savePapers() {
        localStorage.setItem('questionPapers', JSON.stringify(this.papers));
    }

    renderPapers(papersToShow = null) {
        const container = document.getElementById('papersGrid');
        const papers = papersToShow || this.papers;

        if (papers.length === 0) {
            if (this.papers.length === 0) {
                container.innerHTML = `
                    <div class="loading">
                        <i class="fas fa-book"></i>
                        <h3>No Papers Yet</h3>
                        <p>Use the admin upload to add question papers</p>
                    </div>
                `;
            } else {
                document.getElementById('noResults').style.display = 'block';
                container.innerHTML = '';
            }
            return;
        }

        document.getElementById('noResults').style.display = 'none';
        
        container.innerHTML = papers.map(paper => `
            <div class="paper-card" onclick="paperManager.openPaper(${paper.id})">
                <h3>${this.escapeHtml(paper.subject)}</h3>
                <div class="year">${paper.school || 'N/A'}</div>
                <div class="info">
                    <span class="pages">
                        <i class="fas fa-file-image"></i>
                        ${paper.totalPages} page${paper.totalPages > 1 ? 's' : ''}
                    </span>
                    <button class="view-btn" onclick="event.stopPropagation(); paperManager.openPaper(${paper.id})">
                        <i class="fas fa-eye"></i> View
                    </button>
                </div>
            </div>
        `).join('');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    populateFilters() {
        const schools = [...new Set(this.papers.map(paper => paper.school))].sort();
        const subjects = [...new Set(this.papers.map(paper => paper.subject))].sort();

        const yearFilter = document.getElementById('yearFilter');
        const subjectFilter = document.getElementById('subjectFilter');

        yearFilter.innerHTML = '<option value="">All Schools</option>' +
            schools.map(school => `<option value="${school}">${school}</option>`).join('');

        subjectFilter.innerHTML = '<option value="">All Subjects</option>' +
            subjects.map(subject => `<option value="${this.escapeHtml(subject)}">${this.escapeHtml(subject)}</option>`).join('');
    }

    filterPapers() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const schoolFilter = document.getElementById('yearFilter').value;
        const subjectFilter = document.getElementById('subjectFilter').value;

        const filteredPapers = this.papers.filter(paper => {
            const matchesSearch = paper.subject.toLowerCase().includes(searchTerm) ||
                                (paper.school && paper.school.toLowerCase().includes(searchTerm));
            const matchesSchool = !schoolFilter || paper.school === schoolFilter;
            const matchesSubject = !subjectFilter || paper.subject === subjectFilter;

            return matchesSearch && matchesSchool && matchesSubject;
        });

        this.renderPapers(filteredPapers);
    }

    openPaper(paperId) {
        const paper = this.papers.find(p => p.id === paperId);
        if (!paper) return;

        this.currentViewing = paper;
        this.currentPageIndex = 0;
        this.zoomLevel = 1;

        document.getElementById('viewerTitle').textContent = `${paper.subject} (${paper.school || 'N/A'})`;
        document.getElementById('paperModal').style.display = 'block';
        
        this.updateViewer();
        document.body.style.overflow = 'hidden';
    }

    updateViewer() {
        if (!this.currentViewing || !this.currentViewing.pages.length) return;

        const currentPage = this.currentViewing.pages[this.currentPageIndex];
        const img = document.getElementById('currentImage');
        
        img.src = currentPage.data;
        img.style.transform = `scale(${this.zoomLevel})`;
        
        document.getElementById('pageCounter').textContent = 
            `Page ${this.currentPageIndex + 1} of ${this.currentViewing.pages.length}`;

        document.getElementById('prevBtn').disabled = this.currentPageIndex === 0;
        document.getElementById('nextBtn').disabled = this.currentPageIndex === this.currentViewing.pages.length - 1;
    }

    previousPage() {
        if (this.currentViewing && this.currentPageIndex > 0) {
            this.currentPageIndex--;
            this.updateViewer();
        }
    }

    nextPage() {
        if (this.currentViewing && this.currentPageIndex < this.currentViewing.pages.length - 1) {
            this.currentPageIndex++;
            this.updateViewer();
        }
    }

    zoomIn() {
        this.zoomLevel = Math.min(this.zoomLevel * 1.2, 3);
        this.updateViewer();
    }

    zoomOut() {
        this.zoomLevel = Math.max(this.zoomLevel / 1.2, 0.5);
        this.updateViewer();
    }

    toggleFullscreen() {
        const modal = document.getElementById('paperModal');
        
        if (!document.fullscreenElement) {
            modal.requestFullscreen().catch(err => {
                console.log('Fullscreen not supported');
            });
        } else {
            document.exitFullscreen();
        }
    }

    handleKeyPress(event) {
        if (!this.currentViewing) return;

        switch(event.key) {
            case 'ArrowLeft':
                event.preventDefault();
                this.previousPage();
                break;
            case 'ArrowRight':
                event.preventDefault();
                this.nextPage();
                break;
            case 'Escape':
                this.closeModal(document.getElementById('paperModal'));
                document.body.style.overflow = '';
                break;
            case '+':
            case '=':
                event.preventDefault();
                this.zoomIn();
                break;
            case '-':
                event.preventDefault();
                this.zoomOut();
                break;
        }
    }

    // Sample data generator
    addSampleData() {
        const generateSVG = (title, school, pageNum) => {
            return "data:image/svg+xml;base64," + btoa(`<svg width="600" height="800" xmlns="http://www.w3.org/2000/svg">
<rect width="100%" height="100%" fill="#fff" stroke="#000" stroke-width="2"/>
<rect y="0" width="100%" height="60" fill="#4a90e2"/>
<text x="300" y="38" text-anchor="middle" font-size="20" font-weight="bold" fill="white">${title}</text>
<text x="50" y="100" font-size="16">School: ${school}</text>
<text x="50" y="140" font-size="14">Page ${pageNum} | Duration: 3 hours | Max Marks: 100</text>
<text x="50" y="200" font-size="14" font-weight="bold">Q1. Sample Question [20 marks]</text>
<text x="70" y="230" font-size="13">This is a demonstration question paper.</text>
<text x="50" y="280" font-size="14" font-weight="bold">Q2. Sample Question [15 marks]</text>
<text x="70" y="310" font-size="13">Answer in your own words.</text>
<text x="50" y="360" font-size="14" font-weight="bold">Q3. Sample Question [15 marks]</text>
<text x="70" y="390" font-size="13">Explain with examples.</text>
<text x="300" y="770" text-anchor="middle" font-size="12">Page ${pageNum}</text>
</svg>`);
        };
        
        const samplePapers = [
            {
                id: 1,
                subject: "Mathematics",
                school: "SOBS",
                pages: [{ name: "math1.jpg", data: generateSVG("MATHEMATICS", "SOBS", 1), size: 2048 }],
                uploadDate: new Date().toISOString(),
                totalPages: 1
            },
            {
                id: 2,
                subject: "Physics",
                school: "SOPS",
                pages: [{ name: "physics1.jpg", data: generateSVG("PHYSICS", "SOPS", 1), size: 2048 }],
                uploadDate: new Date().toISOString(),
                totalPages: 1
            },
            {
                id: 3,
                subject: "Computer Science",
                school: "SOCSE",
                pages: [{ name: "cs1.jpg", data: generateSVG("COMPUTER SCIENCE", "SOCSE", 1), size: 2048 }],
                uploadDate: new Date().toISOString(),
                totalPages: 1
            }
        ];

        this.papers = samplePapers;
        this.savePapers();
        this.renderPapers();
        this.populateFilters();
    }
}

// Initialize the application
let paperManager;

document.addEventListener('DOMContentLoaded', () => {
    paperManager = new QuestionPaperManager();
    
    // Add sample data if empty
    if (paperManager.papers.length === 0) {
        paperManager.addSampleData();
    }
});
