-- Migration para adicionar a coluna checked_in à tabela participants
ALTER TABLE participants ADD COLUMN checked_in BOOLEAN DEFAULT false;

-- Atualizar todos os registros existentes para terem checked_in = false
UPDATE participants SET checked_in = false WHERE checked_in IS NULL;

-- Adicionar comentário à coluna
COMMENT ON COLUMN participants.checked_in IS 'Indica se o participante fez check-in no torneio';
