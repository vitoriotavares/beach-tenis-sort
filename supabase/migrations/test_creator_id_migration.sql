-- Simplified migration test script
-- This script only adds the creator_id column without the RLS policies

-- Add creator_id column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'tournaments'
        AND column_name = 'creator_id'
    ) THEN
        ALTER TABLE tournaments
        ADD COLUMN creator_id UUID REFERENCES auth.users(id);
        RAISE NOTICE 'Added creator_id column to tournaments table';
    ELSE
        RAISE NOTICE 'Column creator_id already exists in tournaments table';
    END IF;
END
$$;
