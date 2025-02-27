-- Script para executar todas as migrações em sequência
-- Este script deve ser executado no SQL Editor do Supabase

-- 1. Verificar a estrutura atual da tabela profiles
\i simple_verify_profiles.sql

-- 2. Adicionar função RPC para verificação de tabelas
\i add_check_table_exists_function.sql

-- 3. Verificar e corrigir referências à tabela auth.users
\i fix_auth_references.sql

-- 4. Criar a tabela profiles (se não existir)
\i 20250227_create_profiles_table.sql

-- 5. Corrigir as permissões da tabela profiles
\i fix_profiles_permissions.sql

-- 6. Adicionar permissões necessárias
\i add_profiles_permissions.sql

-- 7. Corrigir o erro de valores NULL na coluna name
\i fix_name_null_error.sql

-- 8. Verificar novamente a estrutura da tabela profiles
\i simple_verify_profiles.sql

-- NOTA: Se você estiver enfrentando o erro específico de coluna "full_name",
-- descomente a linha abaixo para adicionar essa coluna:
-- \i add_full_name_column.sql
