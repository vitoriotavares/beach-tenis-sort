-- Migration: Add creator_id to tournaments table
-- Description: Adds a creator_id column to the tournaments table to track which user created the tournament

-- First, check if the column already exists to avoid errors
DO $$
BEGIN
    -- Check if the creator_id column already exists
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'tournaments'
        AND column_name = 'creator_id'
    ) THEN
        -- Add the creator_id column as a foreign key to auth.users
        ALTER TABLE tournaments
        ADD COLUMN creator_id UUID REFERENCES auth.users(id);
        
        -- Log the migration
        RAISE NOTICE 'Added creator_id column to tournaments table';
    ELSE
        RAISE NOTICE 'Column creator_id already exists in tournaments table';
    END IF;
END
$$;

-- Add RLS policies to allow users to view all tournaments but only modify their own
DO $$
BEGIN
    -- First, check if RLS is enabled on the tournaments table
    IF NOT EXISTS (
        SELECT 1
        FROM pg_tables
        WHERE tablename = 'tournaments'
        AND rowsecurity = true
    ) THEN
        -- Enable row level security
        ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
        RAISE NOTICE 'Enabled Row Level Security on tournaments table';
    END IF;
END
$$;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Tournaments are viewable by everyone" ON tournaments;
DROP POLICY IF EXISTS "Tournaments can be created by authenticated users" ON tournaments;
DROP POLICY IF EXISTS "Tournaments can be updated by their creators" ON tournaments;
DROP POLICY IF EXISTS "Tournaments can be deleted by their creators" ON tournaments;

-- Create policies
-- Everyone can view tournaments
CREATE POLICY "Tournaments are viewable by everyone" 
ON tournaments FOR SELECT 
USING (true);

-- Authenticated users can create tournaments
CREATE POLICY "Tournaments can be created by authenticated users" 
ON tournaments FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Only creators can update their tournaments
CREATE POLICY "Tournaments can be updated by their creators" 
ON tournaments FOR UPDATE 
TO authenticated
USING (creator_id = auth.uid());

-- Only creators can delete their tournaments
CREATE POLICY "Tournaments can be deleted by their creators" 
ON tournaments FOR DELETE 
TO authenticated
USING (creator_id = auth.uid());

-- Update existing tournaments to set creator_id if possible
-- This is a best-effort approach and may not be accurate for existing data
DO $$
BEGIN
    -- For demonstration purposes, we'll set the creator_id to NULL for existing tournaments
    -- In a real scenario, you might want to set it to a specific admin user ID
    UPDATE tournaments
    SET creator_id = NULL
    WHERE creator_id IS NULL;
    
    RAISE NOTICE 'Updated existing tournaments with NULL creator_id';
END
$$;
