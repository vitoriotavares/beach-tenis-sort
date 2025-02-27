# Migration: Adicionar creator_id à tabela tournaments

Esta migration adiciona um campo `creator_id` à tabela `tournaments` para rastrear qual usuário criou cada torneio.

## O que esta migration faz

1. Adiciona uma coluna `creator_id` à tabela `tournaments` como uma chave estrangeira para `auth.users(id)`
2. Configura políticas de Row Level Security (RLS) para a tabela `tournaments`:
   - Todos podem visualizar todos os torneios
   - Usuários autenticados podem criar torneios
   - Apenas o criador pode atualizar ou excluir seus próprios torneios
3. Atualiza os torneios existentes com um valor NULL para `creator_id`

## Como executar a migration

### Usando o CLI do Supabase

Se você tem o CLI do Supabase instalado, execute:

```bash
supabase db reset
```

Isso executará todas as migrations, incluindo esta.

### Usando o Studio do Supabase

1. Acesse o Supabase Studio
2. Vá para a seção "SQL Editor"
3. Cole o conteúdo do arquivo `20250227_add_creator_id_to_tournaments.sql`
4. Execute o script

Alternativamente, você pode executar o script `run_creator_id_migration.sql` que irá executar apenas esta migration específica.

### Script de teste simplificado

Se você encontrar problemas com o script principal, pode usar o script de teste simplificado:

```bash
psql -f test_creator_id_migration.sql
```

Este script adiciona apenas a coluna `creator_id` sem configurar as políticas de RLS.

## Solução de problemas

### Erro de sintaxe com IF NOT EXISTS

Se você encontrar um erro como:
```
ERROR: 42601: syntax error at or near "IF"
LINE 29: IF NOT EXISTS (
         ^
```

Isso geralmente ocorre porque a sintaxe `IF NOT EXISTS` só pode ser usada dentro de blocos PL/pgSQL (`DO $$...$$`). O script corrigido já resolve esse problema.

## Verificando se a migration foi aplicada

Execute a seguinte consulta SQL para verificar se a coluna foi adicionada:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'tournaments' 
AND column_name = 'creator_id';
```

Se a migration foi aplicada com sucesso, você verá uma linha com `creator_id` e o tipo de dados `uuid`.
