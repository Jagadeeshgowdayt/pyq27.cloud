// Supabase Storage Helper Functions

class SupabaseStorageManager {
    constructor() {
        this.bucket = STORAGE_BUCKET;
        this.initialized = false;
    }

    async init() {
        if (this.initialized) return true;

        try {
            console.log('🔍 Checking if bucket exists:', this.bucket);
            
            // Check if bucket exists, if not create it
            const { data: buckets, error } = await supabase.storage.listBuckets();
            
            if (error) {
                console.error('❌ Error listing buckets:', error);
                alert(`Error connecting to storage: ${error.message}\n\nPlease check:\n1. Supabase URL and API key are correct\n2. You have internet connection`);
                return false;
            }

            console.log('📦 Found buckets:', buckets.map(b => b.name));
            const bucketExists = buckets.some(b => b.name === this.bucket);
            
            if (!bucketExists) {
                console.log('⚠️ Bucket not found. Creating bucket:', this.bucket);
                
                const { data: newBucket, error: createError } = await supabase.storage.createBucket(this.bucket, {
                    public: true,
                    fileSizeLimit: 52428800, // 50MB per file
                    allowedMimeTypes: ['image/*']
                });

                if (createError) {
                    console.error('❌ Error creating bucket:', createError);
                    alert(`Failed to create storage bucket: ${createError.message}\n\nPlease create the bucket manually in Supabase dashboard:\n1. Go to Storage → Buckets\n2. Click "New Bucket"\n3. Name: "${this.bucket}"\n4. Check "Public bucket"\n5. Save`);
                    return false;
                }
                
                console.log('✅ Bucket created successfully:', newBucket);
                alert(`✅ Storage bucket "${this.bucket}" created!\n\nIMPORTANT: You need to add storage policies in Supabase:\n1. Go to Storage → ${this.bucket} → Policies\n2. Add SELECT, INSERT, UPDATE, DELETE policies\n\nOr run this SQL:\n\nCREATE POLICY "Public access" ON storage.objects FOR ALL USING (bucket_id = '${this.bucket}');`);
            } else {
                console.log('✅ Bucket exists:', this.bucket);
            }

            this.initialized = true;
            return true;
        } catch (error) {
            console.error('❌ Initialization error:', error);
            alert(`Storage initialization failed: ${error.message}`);
            return false;
        }
    }

    async uploadImage(file, path) {
        await this.init();

        try {
            const { data, error } = await supabase.storage
                .from(this.bucket)
                .upload(path, file, {
                    cacheControl: '3600',
                    upsert: true
                });

            if (error) {
                console.error('Upload error:', error);
                return null;
            }

            // Get public URL
            const { data: urlData } = supabase.storage
                .from(this.bucket)
                .getPublicUrl(path);

            return urlData.publicUrl;
        } catch (error) {
            console.error('Upload error:', error);
            return null;
        }
    }

    async uploadMultipleImages(files, folderPrefix) {
        console.log('📤 Starting multiple upload:', files.length, 'files to', folderPrefix);
        
        try {
            const uploadPromises = files.map(async (file, index) => {
                const fileName = `${folderPrefix}/page_${index + 1}_${Date.now()}.${file.name.split('.').pop()}`;
                console.log(`  Uploading ${index + 1}/${files.length}: ${fileName}`);
                const url = await this.uploadImage(file, fileName);
                if (!url) {
                    throw new Error(`Failed to upload ${file.name}`);
                }
                console.log(`  ✅ Uploaded: ${url}`);
                return url;
            });

            const results = await Promise.all(uploadPromises);
            console.log('✅ All uploads complete:', results.length, 'files');
            return results;
        } catch (error) {
            console.error('❌ uploadMultipleImages error:', error);
            alert(`Upload failed: ${error.message}\n\nCheck browser console for details.`);
            throw error;
        }
    }

    getPublicUrl(path) {
        const { data } = supabase.storage
            .from(this.bucket)
            .getPublicUrl(path);
        
        return data.publicUrl;
    }

    async deleteImage(path) {
        const { error } = await supabase.storage
            .from(this.bucket)
            .remove([path]);

        if (error) {
            console.error('Delete error:', error);
            return false;
        }

        return true;
    }

    async deleteFolder(folderPath) {
        try {
            const { data: files, error: listError } = await supabase.storage
                .from(this.bucket)
                .list(folderPath);

            if (listError || !files) return false;

            const filesToDelete = files.map(file => `${folderPath}/${file.name}`);
            
            if (filesToDelete.length > 0) {
                const { error: deleteError } = await supabase.storage
                    .from(this.bucket)
                    .remove(filesToDelete);

                if (deleteError) {
                    console.error('Delete folder error:', deleteError);
                    return false;
                }
            }

            return true;
        } catch (error) {
            console.error('Delete folder error:', error);
            return false;
        }
    }
}

// Initialize storage manager
const storageManager = new SupabaseStorageManager();
