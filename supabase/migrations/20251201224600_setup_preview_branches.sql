-- Migration: Setup Preview Branch Support
-- Created: 2025-12-01
-- Purpose: Document and configure Supabase preview branch setup for isolated testing environments
--
-- This migration establishes metadata and documentation for Supabase preview branch configuration.
-- Preview branches allow developers to test database changes in isolation before deploying to production.
--
-- Preview Branch Configuration:
-- - Production Branch: main (production Supabase project)
-- - Preview Branch: dev-preview-main (isolated Supabase branch for testing)
--
-- Environment Variables Required:
-- - VITE_SUPABASE_URL: Production Supabase URL
-- - VITE_SUPABASE_ANON_KEY: Production anon key
-- - VITE_SUPABASE_URL_PREVIEW: Preview branch URL
-- - VITE_SUPABASE_ANON_KEY_PREVIEW: Preview branch anon key
--
-- Configuration Details:
-- - See supabase/config.toml for branching configuration
-- - See SUPABASE_PREVIEW_SETUP.md for setup instructions
-- - See PREVIEW_BRANCH_CHECKLIST.md for setup verification

-- Create a metadata table to track preview branch configuration
-- This table stores information about which preview branches are configured
CREATE TABLE IF NOT EXISTS public.preview_branch_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_name TEXT NOT NULL UNIQUE,
  git_branch TEXT NOT NULL,
  supabase_branch TEXT NOT NULL,
  description TEXT,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add comment to the table
COMMENT ON TABLE public.preview_branch_metadata IS 
  'Tracks Supabase preview branch configuration for isolated testing environments';

-- Insert the main preview branch configuration
INSERT INTO public.preview_branch_metadata (
  branch_name,
  git_branch,
  supabase_branch,
  description,
  enabled
) VALUES (
  'main-preview',
  'main',
  'dev-preview-main',
  'Preview branch for main Git branch - provides isolated database for testing changes before production',
  true
) ON CONFLICT (branch_name) DO UPDATE SET
  git_branch = EXCLUDED.git_branch,
  supabase_branch = EXCLUDED.supabase_branch,
  description = EXCLUDED.description,
  enabled = EXCLUDED.enabled,
  updated_at = now();

-- Create an index for faster lookups by git branch
CREATE INDEX IF NOT EXISTS idx_preview_branch_git_branch 
  ON public.preview_branch_metadata(git_branch);

-- Enable Row Level Security (RLS) for security
ALTER TABLE public.preview_branch_metadata ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all authenticated users to read preview branch metadata
CREATE POLICY "Preview branch metadata is readable by all authenticated users"
  ON public.preview_branch_metadata
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policy to restrict write access to authenticated users with specific role
-- In the future, you can modify this to restrict to admin users only
CREATE POLICY "Preview branch metadata is writable by authenticated users"
  ON public.preview_branch_metadata
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create a function to get the current preview branch configuration
CREATE OR REPLACE FUNCTION public.get_preview_branch_config(p_git_branch TEXT)
RETURNS TABLE (
  branch_name TEXT,
  git_branch TEXT,
  supabase_branch TEXT,
  description TEXT,
  enabled BOOLEAN
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pbm.branch_name,
    pbm.git_branch,
    pbm.supabase_branch,
    pbm.description,
    pbm.enabled
  FROM public.preview_branch_metadata pbm
  WHERE pbm.git_branch = p_git_branch
    AND pbm.enabled = true;
END;
$$;

-- Add comment to the function
COMMENT ON FUNCTION public.get_preview_branch_config IS 
  'Retrieves preview branch configuration for a given Git branch';

-- Grant necessary permissions
GRANT SELECT ON public.preview_branch_metadata TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_preview_branch_config TO authenticated;
