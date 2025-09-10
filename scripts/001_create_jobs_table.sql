-- Create jobs table for the job board
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  job_type TEXT NOT NULL CHECK (job_type IN ('full-time', 'part-time', 'contract', 'internship')),
  salary_min INTEGER,
  salary_max INTEGER,
  description TEXT NOT NULL,
  requirements TEXT,
  benefits TEXT,
  application_url TEXT,
  application_email TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Enable Row Level Security
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Create policies for jobs table
-- Allow anyone to view active jobs
CREATE POLICY "jobs_select_active" ON public.jobs 
  FOR SELECT USING (is_active = true);

-- Allow users to view their own jobs (including inactive ones)
CREATE POLICY "jobs_select_own" ON public.jobs 
  FOR SELECT USING (auth.uid() = user_id);

-- Allow authenticated users to insert their own jobs
CREATE POLICY "jobs_insert_own" ON public.jobs 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own jobs
CREATE POLICY "jobs_update_own" ON public.jobs 
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to delete their own jobs
CREATE POLICY "jobs_delete_own" ON public.jobs 
  FOR DELETE USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS jobs_created_at_idx ON public.jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS jobs_user_id_idx ON public.jobs(user_id);
CREATE INDEX IF NOT EXISTS jobs_active_idx ON public.jobs(is_active);
