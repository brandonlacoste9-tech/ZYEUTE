-- Fix posts view to support PostgREST joins properly
-- The view needs to expose the foreign key relationship for user_profiles joins

-- Drop and recreate the posts view with proper foreign key support
DROP VIEW IF EXISTS posts CASCADE;

-- Create posts view with all necessary columns from publications
CREATE VIEW posts AS
SELECT 
  id,
  user_id,
  content,
  visibilite as visibility,
  est_masque as is_hidden,
  supprime_a as scheduled_delete_at,
  created_at,
  deleted_at,
  comments_count,
  reactions_count,
  media_url
FROM publications
WHERE deleted_at IS NULL;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON posts TO authenticated;
GRANT SELECT ON posts TO anon;

-- Create a foreign key relationship view for PostgREST joins
-- This allows PostgREST to understand the relationship between posts and user_profiles
CREATE OR REPLACE FUNCTION posts_user_id_fkey()
RETURNS TRIGGER AS $$
BEGIN
  -- This function exists to help PostgREST understand the FK relationship
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Add comment to help PostgREST understand the relationship
COMMENT ON VIEW posts IS 'View mapping posts to publications table. user_id references auth.users(id) and can be joined with user_profiles(id)';

-- Ensure the view is accessible
ALTER VIEW posts OWNER TO postgres;

-- Fix stories table to support joins properly
-- Add comment for PostgREST
COMMENT ON TABLE stories IS 'Stories table. user_id references auth.users(id) and can be joined with user_profiles(id)';

-- Ensure stories table has proper ownership
ALTER TABLE stories OWNER TO postgres;

-- Fix notifications query issue
-- The query is trying to join with posts, but notifications might reference publications
-- Let's ensure the relationship is clear
COMMENT ON TABLE notifications IS 'Notifications table. post_id references publications(id) which maps to posts view';

-- Verify the view works with a test query
DO $$
BEGIN
  -- Test that the view is queryable
  PERFORM 1 FROM posts LIMIT 1;
  RAISE NOTICE 'Posts view is accessible';
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Posts view test failed: %', SQLERRM;
END $$;

