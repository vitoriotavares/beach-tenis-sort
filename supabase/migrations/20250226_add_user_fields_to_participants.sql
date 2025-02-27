-- Migration para adicionar campos relacionados ao usuário à tabela participants
ALTER TABLE participants ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) NULL;
ALTER TABLE participants ADD COLUMN IF NOT EXISTS avatar_url TEXT NULL;
ALTER TABLE participants ADD COLUMN IF NOT EXISTS checked_in BOOLEAN DEFAULT FALSE;

-- Adicionar comentários às colunas
COMMENT ON COLUMN participants.user_id IS 'ID do usuário autenticado relacionado a este participante';
COMMENT ON COLUMN participants.avatar_url IS 'URL do avatar do usuário';
COMMENT ON COLUMN participants.checked_in IS 'Indica se o participante fez check-in no torneio';
