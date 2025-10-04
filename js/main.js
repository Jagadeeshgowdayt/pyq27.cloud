// Question Papers Data Storage
class QuestionPaperManager {
    constructor() {
        this.papers = [];
        this.currentViewing = null;
        this.currentPageIndex = 0;
        this.zoomLevel = 1;
        
        // Initialize Supabase Storage Manager
        this.storageManager = new SupabaseStorageManager();
        
        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.setupProtection();
        
        // Load papers from Supabase database
        await this.loadPapersFromDB();
        
        this.renderPapers();
        this.populateFilters();
        
        // Check URL AFTER papers are loaded
        this.checkUrlForPaper();
    }
    
    // Load papers from Supabase database
    async loadPapersFromDB() {
        try {
            console.log('📥 Loading papers from Supabase database...');
            
            // Wait for all dependencies to be available
            let retries = 0;
            const maxRetries = 10;
            
            while ((typeof supabasePapersDB === 'undefined' || !supabasePapersDB) && retries < maxRetries) {
                console.warn(`⚠️ Supabase DB not loaded yet, waiting... (${retries + 1}/${maxRetries})`);
                
                // Try to initialize if function exists
                if (typeof initSupabasePapersDB === 'function') {
                    initSupabasePapersDB();
                }
                
                await new Promise(resolve => setTimeout(resolve, 300));
                retries++;
            }
            
            if (typeof supabasePapersDB === 'undefined' || !supabasePapersDB) {
                throw new Error('SupabasePapersDB failed to load after 3 seconds');
            }
            
            console.log('✅ Supabase DB helper loaded, fetching papers...');
            this.papers = await supabasePapersDB.getAllPapers();
            console.log(`✅ Loaded ${this.papers.length} papers from database`);
            
            // Also sync to localStorage for offline access
            if (this.papers.length > 0) {
                localStorage.setItem('questionPapers', JSON.stringify(this.papers));
                console.log(`💾 Synced ${this.papers.length} papers to localStorage`);
            }
            
            // If no papers in DB, check localStorage
            if (this.papers.length === 0) {
                const localPapers = localStorage.getItem('questionPapers');
                if (localPapers) {
                    this.papers = JSON.parse(localPapers);
                    console.log(`⚠️ Using ${this.papers.length} papers from localStorage (database is empty)`);
                } else {
                    console.warn('⚠️ No papers in database or localStorage');
                }
            }
        } catch (error) {
            console.error('❌ Failed to load papers from database:', error);
            console.log('🔍 Error details:', error.message);
            console.log('🔍 Error stack:', error.stack);
            
            // Fallback to localStorage
            const localPapers = localStorage.getItem('questionPapers');
            if (localPapers) {
                this.papers = JSON.parse(localPapers);
                console.log(`⚠️ Using ${this.papers.length} papers from localStorage (offline mode)`);
            } else {
                console.warn('⚠️ No papers found in database or localStorage');
                console.log('💡 To fix: Check Supabase Dashboard → SQL Editor');
                console.log('💡 Or visit migrate-to-database.html to migrate papers');
            }
        }
    }

    setupEventListeners() {
        // Debounced search for better performance
        const debouncedFilter = this.debounce(() => this.filterPapers(), 300);
        
        // Search functionality
        document.getElementById('searchInput').addEventListener('input', debouncedFilter);
        document.getElementById('searchBtn').addEventListener('click', () => this.filterPapers());
        
        // Enter key for search
        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.filterPapers();
            }
        });

        // Modal close buttons
        const closeButtons = document.querySelectorAll('.close');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) this.closeModal(modal);
            });
        });

        // Click outside modal to close
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target);
            }
        });

        // Paper viewer controls - use event delegation
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) prevBtn.addEventListener('click', () => this.previousPage());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextPage());
        
        document.getElementById('zoomInBtn').addEventListener('click', () => this.zoomIn());
        document.getElementById('zoomOutBtn').addEventListener('click', () => this.zoomOut());
        document.getElementById('fullscreenBtn').addEventListener('click', () => this.toggleFullscreen());
        document.getElementById('shareWhatsAppBtn').addEventListener('click', () => this.shareOnWhatsApp());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));

        // Touch gestures for mobile
        this.setupTouchGestures();
    }
    
    // Debounce function for performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
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

    closeModal(modal) {
        if (modal) {
            modal.style.display = 'none';
            // Restore body scrolling
            document.body.style.overflow = '';
            // Reset current viewing if closing paper modal
            if (modal.id === 'paperModal') {
                this.currentViewing = null;
                this.currentPageIndex = 0;
                this.zoomLevel = 1;
            }
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
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading to cloud...';

        try {
            // Initialize storage manager
            console.log('🔄 Initializing storage manager...');
            const initSuccess = await this.storageManager.init();
            if (!initSuccess) {
                throw new Error('Storage manager initialization failed');
            }
            console.log('✅ Storage manager initialized successfully');

            let uploadedCount = 0;

            if (this.groupedFiles && Object.keys(this.groupedFiles).length > 0) {
                // Bulk upload mode with Supabase Storage
                for (const [key, paperData] of Object.entries(this.groupedFiles)) {
                    const paperId = Date.now() + uploadedCount;
                    const folderPath = `papers/${paperId}`;
                    
                    // Upload all files to Supabase Storage
                    const fileDataArray = paperData.files.map(f => f.file);
                    const imageUrls = await this.storageManager.uploadMultipleImages(fileDataArray, folderPath);
                    
                    const pages = imageUrls.map((url, index) => ({
                        name: paperData.files[index].file.name,
                        data: url, // Store URL instead of base64
                        size: paperData.files[index].file.size,
                        pageNo: paperData.files[index].pageNo,
                        storagePath: `${folderPath}/page_${index + 1}_${Date.now()}.${paperData.files[index].file.name.split('.').pop()}`
                    }));

                    const paper = {
                        id: paperId,
                        subject: paperData.subject,
                        school: paperData.school,
                        pages: pages,
                        uploadDate: new Date().toISOString(),
                        totalPages: pages.length,
                        storageType: 'supabase' // Mark as cloud storage
                    };

                    this.papers.push(paper);
                    uploadedCount++;
                }

                alert(`✅ Successfully uploaded ${uploadedCount} question paper(s) to cloud storage!`);
                
            } else {
                // Manual upload mode with Supabase Storage
                const subject = document.getElementById('paperSubject').value.trim();
                const school = document.getElementById('paperSchool').value.trim();

                if (!subject || !school) {
                    alert('Please fill in subject and school.');
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-upload"></i> Upload Paper';
                    return;
                }

                const paperId = Date.now();
                const folderPath = `papers/${paperId}`;
                
                // Upload all files to Supabase Storage
                const imageUrls = await this.storageManager.uploadMultipleImages(files, folderPath);
                
                const pages = imageUrls.map((url, index) => ({
                    name: files[index].name,
                    data: url, // Store URL instead of base64
                    size: files[index].size,
                    storagePath: `${folderPath}/page_${index + 1}_${Date.now()}.${files[index].name.split('.').pop()}`
                }));

                const paper = {
                    id: paperId,
                    subject: subject,
                    school: school.toUpperCase(),
                    pages: pages,
                    uploadDate: new Date().toISOString(),
                    totalPages: pages.length,
                    storageType: 'supabase' // Mark as cloud storage
                };

                this.papers.push(paper);
                alert(`✅ Successfully uploaded ${paper.totalPages} page(s) for ${subject} to cloud storage!`);
            }

            this.savePapers();
            this.renderPapers();
            this.populateFilters();
            this.closeModal(document.getElementById('adminModal'));
            this.groupedFiles = null;
            
        } catch (error) {
            console.error('❌ Upload error:', error);
            console.error('Error details:', error);
            alert(`❌ Upload failed: ${error.message}\n\nCheck browser console for details.`);
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

    async savePapers() {
        // Save paper metadata to localStorage (backup)
        localStorage.setItem('questionPapers', JSON.stringify(this.papers));
        
        // Also save to Supabase database (if available)
        if (typeof supabasePapersDB !== 'undefined') {
            try {
                console.log('💾 Syncing papers to database...');
                // Note: Individual papers should be saved when created
                // This is just a backup sync
            } catch (error) {
                console.error('❌ Failed to sync papers to database:', error);
            }
        }
    }

    renderPapers(papersToShow = null) {
        const container = document.getElementById('papersGrid');
        const papers = papersToShow || this.papers;

        // Clear container
        container.innerHTML = '';

        if (papers.length === 0) {
            if (this.papers.length === 0) {
                container.innerHTML = `
                    <div class="loading">
                        <i class="fas fa-book"></i>
                        <h3>No Papers Yet</h3>
                        <p>Use admin panel to add papers</p>
                    </div>
                `;
            } else {
                document.getElementById('noResults').style.display = 'block';
            }
            return;
        }

        document.getElementById('noResults').style.display = 'none';
        
        // Use DocumentFragment for better performance
        const fragment = document.createDocumentFragment();
        
        papers.forEach(paper => {
            const card = document.createElement('div');
            card.className = 'paper-card';
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            
            // Create share button
            const shareBtn = document.createElement('button');
            shareBtn.className = 'share-badge-btn';
            shareBtn.innerHTML = '<i class="fas fa-share-alt"></i> Share';
            shareBtn.onclick = (e) => {
                e.stopPropagation();
                this.quickShare(paper.id);
            };
            
            // Create content
            card.innerHTML = `
                <h3>${this.escapeHtml(paper.subject)}</h3>
                <div class="info">
                    <span class="pages">
                        <i class="fas fa-file-image"></i>
                        ${paper.totalPages} page${paper.totalPages > 1 ? 's' : ''}
                    </span>
                    <button class="view-btn">
                        <i class="fas fa-eye"></i> View
                    </button>
                </div>
            `;
            
            // Prepend share button
            card.insertBefore(shareBtn, card.firstChild);
            
            // Add click handler
            card.onclick = () => this.openPaper(paper.id);
            
            // Keyboard support
            card.onkeypress = (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.openPaper(paper.id);
                }
            };
            
            fragment.appendChild(card);
        });
        
        container.appendChild(fragment);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    populateFilters() {
        // Filters removed - no longer filtering by school
        const yearFilter = document.getElementById('yearFilter');
        yearFilter.innerHTML = '<option value="">All Papers</option>';
    }

    filterPapers() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();

        const filteredPapers = this.papers.filter(paper => {
            const matchesSearch = paper.subject.toLowerCase().includes(searchTerm);
            return matchesSearch;
        });

        this.renderPapers(filteredPapers);
    }

    openPaper(paperId) {
        // Convert paperId to number for comparison
        const numericPaperId = Number(paperId);
        
        const paper = this.papers.find(p => Number(p.id) === numericPaperId);
        
        if (!paper) {
            console.error('Paper not found:', paperId);
            this.showNotification('Document not found!', 'error');
            
            // Remove paperId from URL and redirect to homepage
            const url = new URL(window.location);
            url.searchParams.delete('paperId');
            window.history.replaceState({}, '', url);
            return;
        }

        this.currentViewing = paper;
        this.currentPageIndex = 0;
        this.zoomLevel = 1;

        document.getElementById('viewerTitle').textContent = paper.subject;
        document.getElementById('paperModal').style.display = 'block';
        
        this.updateViewer();
        document.body.style.overflow = 'hidden';
        
        // Update URL without reloading page for sharing
        const url = new URL(window.location);
        url.searchParams.set('paperId', paperId);
        window.history.pushState({}, '', url);
    }
    
    shareOnWhatsApp() {
        if (!this.currentViewing) return;
        
        const shareUrl = `${window.location.origin}${window.location.pathname}?paperId=${this.currentViewing.id}`;
        const message = `Check out this question paper: ${this.currentViewing.subject}\n\n${shareUrl}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        
        window.open(whatsappUrl, '_blank');
    }
    
    quickShare(paperId) {
        const paper = this.papers.find(p => p.id === paperId);
        if (!paper) return;
        
        const shareUrl = `${window.location.origin}${window.location.pathname}?paperId=${paperId}`;
        const message = `Check out this question paper: ${paper.subject}\n\n${shareUrl}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        
        window.open(whatsappUrl, '_blank');
    }
    
    checkUrlForPaper() {
        const urlParams = new URLSearchParams(window.location.search);
        const paperId = urlParams.get('paperId');
        
        if (paperId) {
            console.log('📄 Opening paper from URL:', paperId);
            
            // Improved retry logic with multiple attempts
            let attempts = 0;
            const maxAttempts = 20; // 20 attempts × 500ms = 10 seconds max wait
            
            const tryOpenPaper = () => {
                attempts++;
                console.log(`🔄 Attempt ${attempts}/${maxAttempts} - Papers loaded: ${this.papers.length}`);
                
                if (this.papers.length > 0) {
                    console.log(`✅ Papers loaded (${this.papers.length} papers), opening paper ${paperId}`);
                    this.openPaper(paperId);
                } else if (attempts < maxAttempts) {
                    console.log(`⏳ Waiting for papers... (attempt ${attempts}/${maxAttempts})`);
                    setTimeout(tryOpenPaper, 500);
                } else {
                    console.error(`❌ No papers loaded after ${maxAttempts} attempts (${maxAttempts * 500}ms)`);
                    this.showNotification('No papers available. Please try again later.', 'error');
                    
                    // Clean URL and redirect to homepage
                    const url = new URL(window.location);
                    url.searchParams.delete('paperId');
                    window.history.replaceState({}, '', url);
                }
            };
            
            // Start the retry loop immediately
            tryOpenPaper();
        }
    }
    
    showNotification(message, type = 'info') {
        // Create notification element if it doesn't exist
        let notification = document.getElementById('notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'notification';
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                z-index: 10000;
                animation: slideIn 0.3s ease-out;
                max-width: 300px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            `;
            document.body.appendChild(notification);
            
            // Add animation styles
            if (!document.getElementById('notification-styles')) {
                const style = document.createElement('style');
                style.id = 'notification-styles';
                style.textContent = `
                    @keyframes slideIn {
                        from { transform: translateX(400px); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                    @keyframes slideOut {
                        from { transform: translateX(0); opacity: 1; }
                        to { transform: translateX(400px); opacity: 0; }
                    }
                `;
                document.head.appendChild(style);
            }
        }
        
        // Set background color based on type
        const colors = {
            success: '#4CAF50',
            error: '#f44336',
            warning: '#ff9800',
            info: '#2196F3'
        };
        notification.style.backgroundColor = colors[type] || colors.info;
        notification.textContent = message;
        notification.style.display = 'block';
        
        // Auto-hide after 4 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                notification.style.display = 'none';
            }, 300);
        }, 4000);
    }

    updateViewer() {
        if (!this.currentViewing || !this.currentViewing.pages.length) return;
        console.log('Update viewer', this.currentPageIndex, this.currentViewing.pages.length);
        const currentPage = this.currentViewing.pages[this.currentPageIndex];
        const img = document.getElementById('currentImage');
        
        // Handle both old localStorage papers (data field) and new Supabase papers (url field)
        const imageSrc = currentPage.url || currentPage.data;
        if (imageSrc) {
            img.src = imageSrc;
            console.log('Loading image from:', imageSrc);
            
            // Add error handling for image loading
            img.onerror = () => {
                console.error('Failed to load image:', imageSrc);
                img.alt = 'Failed to load image. Please check if the file exists.';
            };
            
            img.onload = () => {
                console.log('Image loaded successfully:', imageSrc);
            };
        } else {
            console.error('No image source found for page:', currentPage);
            img.alt = 'No image source available';
        }
        
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
        console.log('Next page clicked', this.currentPageIndex, this.currentViewing?.pages?.length);
        if (this.currentViewing && this.currentPageIndex < this.currentViewing.pages.length - 1) {
            this.currentPageIndex++;
            console.log('Advanced to page index', this.currentPageIndex);
            this.updateViewer();
        } else {
            console.warn('nextPage: cannot advance', {
                currentViewing: this.currentViewing,
                currentPageIndex: this.currentPageIndex,
                totalPages: this.currentViewing ? this.currentViewing.pages.length : 0
            });
            // Safety: if pages exist but index not updating, try forcing update
            if (this.currentViewing && this.currentViewing.pages && this.currentViewing.pages.length > 0) {
                const attemptedIndex = Math.min(this.currentPageIndex + 1, this.currentViewing.pages.length - 1);
                if (attemptedIndex !== this.currentPageIndex) {
                    this.currentPageIndex = attemptedIndex;
                    console.log('Forced advance to', this.currentPageIndex);
                    this.updateViewer();
                }
            }
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

document.addEventListener('DOMContentLoaded', async () => {
    paperManager = new QuestionPaperManager();
    
    // No need to add sample data - papers come from database now
});
