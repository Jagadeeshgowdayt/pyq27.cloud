// Supabase Configuration
const SUPABASE_URL = 'https://qnxhmmubhfzmvfvmzbud.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFueGhtbXViaGZ6bXZmdm16YnVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MzUwNTIsImV4cCI6MjA3NTAxMTA1Mn0.LI7QKM0adkdMVgH9-JoY9YrHtAIXMen8GnqmDKKbfDo';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Storage bucket name
const STORAGE_BUCKET = 'question-papers';
