-- Migration para adicionar campos relacionados ao usuário à tabela participants
ALTER TABLE participants ADD COLUMN user_id UUID REFERENCES auth.users(id) NULL;
ALTER TABLE participants ADD COLUMN avatar_url TEXT NULL;

-- Adicionar comentários às colunas
COMMENT ON COLUMN participants.user_id IS 'ID do usuário autenticado relacionado a este participante';
COMMENT ON COLUMN participants.avatar_url IS 'URL do avatar do usuário';
