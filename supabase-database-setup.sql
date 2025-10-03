-- Create question_papers table in Supabase
-- Run this SQL in: Supabase Dashboard → SQL Editor → New Query

CREATE TABLE IF NOT EXISTS question_papers (
    id BIGINT PRIMARY KEY,
    subject TEXT NOT NULL,
    upload_date TIMESTAMPTZ DEFAULT NOW(),
    total_pages INTEGER NOT NULL,
    storage_type TEXT DEFAULT 'supabase',
    source TEXT,
    doc_no INTEGER,
    pages JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_subject ON question_papers(subject);
CREATE INDEX IF NOT EXISTS idx_upload_date ON question_papers(upload_date DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE question_papers ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" 
ON question_papers 
FOR SELECT 
TO public 
USING (true);

-- Create policy to allow public insert access (for uploads)
CREATE POLICY "Allow public insert access" 
ON question_papers 
FOR INSERT 
TO public 
WITH CHECK (true);

-- Create policy to allow public update access
CREATE POLICY "Allow public update access" 
ON question_papers 
FOR UPDATE 
TO public 
USING (true);

-- Create policy to allow public delete access
CREATE POLICY "Allow public delete access" 
ON question_papers 
FOR DELETE 
TO public 
USING (true);

-- Optional: Create a view for easier querying
CREATE OR REPLACE VIEW papers_summary AS
SELECT 
    id,
    subject,
    total_pages,
    upload_date,
    storage_type,
    source,
    doc_no,
    (pages->0->>'url') as first_page_url
FROM question_papers
ORDER BY upload_date DESC;

COMMENT ON TABLE question_papers IS 'Stores metadata for uploaded question papers';
