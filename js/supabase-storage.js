// Supabase Storage Helper Functions

class SupabaseStorageManager {
    constructor() {
        this.bucket = STORAGE_BUCKET;
        this.initialized = false;
    }

    async init() {
        if (this.initialized) return true;

        try {
            // Check if bucket exists, if not create it
            const { data: buckets, error } = await supabase.storage.listBuckets();
            
            if (error) {
                console.error('Error listing buckets:', error);
                return false;
            }

            const bucketExists = buckets.some(b => b.name === this.bucket);
            
            if (!bucketExists) {
                const { error: createError } = await supabase.storage.createBucket(this.bucket, {
                    public: true,
                    fileSizeLimit: 10485760 // 10MB per file
                });

                if (createError) {
                    console.error('Error creating bucket:', createError);
                    return false;
                }
            }

            this.initialized = true;
            return true;
        } catch (error) {
            console.error('Initialization error:', error);
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
        const uploadPromises = files.map(async (file, index) => {
            const fileName = `${folderPrefix}/page_${index + 1}_${Date.now()}.${file.name.split('.').pop()}`;
            return await this.uploadImage(file, fileName);
        });

        return await Promise.all(uploadPromises);
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
