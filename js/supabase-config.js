// Supabase Configuration
const SUPABASE_URL = 'https://qnxhmmubhfzmvfvmzbud.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFueGhtbXViaGZ6bXZmdm16YnVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MzUwNTIsImV4cCI6MjA3NTAxMTA1Mn0.LI7QKM0adkdMVgH9-JoY9YrHtAIXMen8GnqmDKKbfDo';

// Initialize Supabase client
let supabase;

// Function to initialize Supabase client
function initSupabaseClient() {
    if (typeof window.supabase === 'undefined') {
        console.error('❌ Supabase library not loaded yet!');
        return null;
    }
    
    if (!supabase) {
        try {
            supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('✅ Supabase client initialized successfully');
            return supabase;
        } catch (error) {
            console.error('❌ Error initializing Supabase client:', error);
            return null;
        }
    }
    
    return supabase;
}

// Try to initialize immediately
if (typeof window.supabase !== 'undefined') {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✅ Supabase client initialized on load');
} else {
    console.warn('⚠️ Supabase library not yet loaded, will initialize later');
}

// Storage bucket name
const STORAGE_BUCKET = 'question-papers';
