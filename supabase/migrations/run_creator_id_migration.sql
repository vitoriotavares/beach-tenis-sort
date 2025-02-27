-- Script to run the creator_id migration
\echo 'Running migration to add creator_id to tournaments table...'

-- Uncomment the line below to run the full migration
\i '20250227_add_creator_id_to_tournaments.sql'

-- Uncomment the line below to run only the simplified test migration
-- \i 'test_creator_id_migration.sql'

\echo 'Migration completed successfully!'

-- Verify the column was added
\echo 'Verifying migration...'
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'tournaments' 
AND column_name = 'creator_id';
