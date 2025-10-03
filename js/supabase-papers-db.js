// Supabase Database Helper - Question Papers CRUD operations

class SupabasePapersDB {
    constructor() {
        this.tableName = 'question_papers';
    }

    // Create/Insert a new paper
    async createPaper(paperData) {
        try {
            // Convert ID to integer (remove decimal part if present)
            const paperId = Math.floor(Number(paperData.id));
            
            const { data, error } = await supabase
                .from(this.tableName)
                .insert([{
                    id: paperId,
                    subject: paperData.subject,
                    total_pages: paperData.totalPages,
                    storage_type: paperData.storageType || 'supabase',
                    source: paperData.source || 'manual',
                    doc_no: paperData.docNo || null,
                    pages: paperData.pages,
                    upload_date: paperData.uploadDate || new Date().toISOString()
                }])
                .select();

            if (error) {
                console.error('❌ Error creating paper:', error);
                throw error;
            }

            console.log('✅ Paper created in database:', data);
            return data[0];
        } catch (error) {
            console.error('❌ Failed to create paper:', error);
            throw error;
        }
    }

    // Read/Get all papers
    async getAllPapers() {
        try {
            const { data, error } = await supabase
                .from(this.tableName)
                .select('*')
                .order('upload_date', { ascending: false });

            if (error) {
                console.error('❌ Error fetching papers:', error);
                throw error;
            }

            console.log(`✅ Fetched ${data.length} papers from database`);
            
            // Convert database format to app format
            return data.map(paper => ({
                id: paper.id,
                subject: paper.subject,
                totalPages: paper.total_pages,
                storageType: paper.storage_type,
                source: paper.source,
                docNo: paper.doc_no,
                pages: paper.pages,
                uploadDate: paper.upload_date
            }));
        } catch (error) {
            console.error('❌ Failed to fetch papers:', error);
            return [];
        }
    }

    // Get a single paper by ID
    async getPaperById(id) {
        try {
            // Convert ID to integer
            const paperId = Math.floor(Number(id));
            
            const { data, error } = await supabase
                .from(this.tableName)
                .select('*')
                .eq('id', paperId)
                .single();

            if (error) {
                console.error('❌ Error fetching paper:', error);
                return null;
            }

            return {
                id: data.id,
                subject: data.subject,
                totalPages: data.total_pages,
                storageType: data.storage_type,
                source: data.source,
                docNo: data.doc_no,
                pages: data.pages,
                uploadDate: data.upload_date
            };
        } catch (error) {
            console.error('❌ Failed to fetch paper:', error);
            return null;
        }
    }

    // Update a paper
    async updatePaper(id, updates) {
        try {
            // Convert ID to integer
            const paperId = Math.floor(Number(id));
            
            const dbUpdates = {};
            if (updates.subject) dbUpdates.subject = updates.subject;
            if (updates.totalPages) dbUpdates.total_pages = updates.totalPages;
            if (updates.pages) dbUpdates.pages = updates.pages;
            
            const { data, error } = await supabase
                .from(this.tableName)
                .update(dbUpdates)
                .eq('id', paperId)
                .select();

            if (error) {
                console.error('❌ Error updating paper:', error);
                throw error;
            }

            console.log('✅ Paper updated:', data);
            return data[0];
        } catch (error) {
            console.error('❌ Failed to update paper:', error);
            throw error;
        }
    }

    // Delete a paper
    async deletePaper(id) {
        try {
            // Convert ID to integer
            const paperId = Math.floor(Number(id));
            
            const { error } = await supabase
                .from(this.tableName)
                .delete()
                .eq('id', paperId);

            if (error) {
                console.error('❌ Error deleting paper:', error);
                throw error;
            }

            console.log('✅ Paper deleted from database');
            return true;
        } catch (error) {
            console.error('❌ Failed to delete paper:', error);
            throw error;
        }
    }

    // Search papers by subject
    async searchPapers(searchTerm) {
        try {
            const { data, error } = await supabase
                .from(this.tableName)
                .select('*')
                .ilike('subject', `%${searchTerm}%`)
                .order('upload_date', { ascending: false });

            if (error) {
                console.error('❌ Error searching papers:', error);
                return [];
            }

            return data.map(paper => ({
                id: paper.id,
                subject: paper.subject,
                totalPages: paper.total_pages,
                storageType: paper.storage_type,
                source: paper.source,
                docNo: paper.doc_no,
                pages: paper.pages,
                uploadDate: paper.upload_date
            }));
        } catch (error) {
            console.error('❌ Failed to search papers:', error);
            return [];
        }
    }

    // Bulk insert papers (for migration)
    async bulkCreatePapers(papersArray) {
        try {
            const dbPapers = papersArray.map(paper => ({
                id: Math.floor(Number(paper.id)), // Convert to integer
                subject: paper.subject,
                total_pages: paper.totalPages,
                storage_type: paper.storageType || 'supabase',
                source: paper.source || 'manual',
                doc_no: paper.docNo || null,
                pages: paper.pages,
                upload_date: paper.uploadDate || new Date().toISOString()
            }));

            const { data, error } = await supabase
                .from(this.tableName)
                .insert(dbPapers)
                .select();

            if (error) {
                console.error('❌ Error bulk creating papers:', error);
                throw error;
            }

            console.log(`✅ Bulk created ${data.length} papers`);
            return data;
        } catch (error) {
            console.error('❌ Failed to bulk create papers:', error);
            throw error;
        }
    }

    // Get papers count
    async getCount() {
        try {
            const { count, error } = await supabase
                .from(this.tableName)
                .select('*', { count: 'exact', head: true });

            if (error) {
                console.error('❌ Error getting count:', error);
                return 0;
            }

            return count;
        } catch (error) {
            console.error('❌ Failed to get count:', error);
            return 0;
        }
    }
}

// Create global instance
const supabasePapersDB = new SupabasePapersDB();
