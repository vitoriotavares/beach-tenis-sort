-- Drop old matches table
DROP TABLE IF EXISTS matches;

-- Create new matches table with individual player columns
CREATE TABLE matches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    team1_player1_id UUID NOT NULL REFERENCES participants(id) ON DELETE RESTRICT,
    team1_player2_id UUID NOT NULL REFERENCES participants(id) ON DELETE RESTRICT,
    team2_player1_id UUID NOT NULL REFERENCES participants(id) ON DELETE RESTRICT,
    team2_player2_id UUID NOT NULL REFERENCES participants(id) ON DELETE RESTRICT,
    score1 INTEGER NOT NULL DEFAULT 0,
    score2 INTEGER NOT NULL DEFAULT 0,
    court TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index
CREATE INDEX idx_matches_tournament ON matches(tournament_id);

-- Create trigger
CREATE TRIGGER update_matches_updated_at
    BEFORE UPDATE ON matches
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
