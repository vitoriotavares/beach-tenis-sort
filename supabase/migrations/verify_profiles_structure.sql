-- Script para verificar e corrigir a estrutura da tabela profiles
DO $$
DECLARE
    column_exists BOOLEAN;
    column_record RECORD;
    constraint_record RECORD;
    acl_record RECORD;
    policy_record RECORD;
BEGIN
    -- Verificar se a tabela profiles existe
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
        RAISE NOTICE 'Tabela profiles existe';
        
        -- Listar todas as colunas da tabela profiles
        RAISE NOTICE 'Colunas da tabela profiles:';
        FOR column_record IN 
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_schema = 'public' AND table_name = 'profiles'
        LOOP
            RAISE NOTICE '- % (%)', column_record.column_name, column_record.data_type;
        END LOOP;
        
        -- Verificar se há alguma coluna que está sendo referenciada mas não existe
        SELECT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'profiles' 
            AND column_name = 'full_name'
        ) INTO column_exists;
        
        IF NOT column_exists THEN
            RAISE NOTICE 'Coluna full_name não existe na tabela profiles';
            RAISE NOTICE 'Isso pode causar erros se o código estiver tentando acessar essa coluna';
            RAISE NOTICE 'Recomendação: Atualize o código para usar apenas a coluna name em vez de full_name';
        END IF;
        
        -- Verificar restrições e índices
        RAISE NOTICE 'Restrições da tabela profiles:';
        FOR constraint_record IN 
            SELECT conname, contype, pg_get_constraintdef(oid) as def
            FROM pg_constraint
            WHERE conrelid = 'public.profiles'::regclass
        LOOP
            RAISE NOTICE '- % (%) %', constraint_record.conname, 
                CASE constraint_record.contype 
                    WHEN 'p' THEN 'PRIMARY KEY'
                    WHEN 'f' THEN 'FOREIGN KEY'
                    WHEN 'u' THEN 'UNIQUE'
                    WHEN 'c' THEN 'CHECK'
                    ELSE constraint_record.contype::text
                END,
                constraint_record.def;
        END LOOP;
        
        -- Verificar permissões
        RAISE NOTICE 'Permissões da tabela profiles:';
        FOR acl_record IN 
            SELECT grantee, privilege_type
            FROM information_schema.role_table_grants
            WHERE table_schema = 'public' AND table_name = 'profiles'
        LOOP
            RAISE NOTICE '- % tem permissão % na tabela', acl_record.grantee, acl_record.privilege_type;
        END LOOP;
        
        -- Verificar políticas RLS
        RAISE NOTICE 'Políticas RLS da tabela profiles:';
        FOR policy_record IN 
            SELECT polname, polcmd, pg_get_expr(polqual, 'public.profiles'::regclass) as qual
            FROM pg_policy
            WHERE polrelid = 'public.profiles'::regclass
        LOOP
            RAISE NOTICE '- % (%) %', policy_record.polname, 
                CASE policy_record.polcmd
                    WHEN 'r' THEN 'SELECT'
                    WHEN 'a' THEN 'INSERT'
                    WHEN 'w' THEN 'UPDATE'
                    WHEN 'd' THEN 'DELETE'
                    WHEN '*' THEN 'ALL'
                    ELSE policy_record.polcmd::text
                END,
                policy_record.qual;
        END LOOP;
    ELSE
        RAISE NOTICE 'Tabela profiles não existe!';
        RAISE NOTICE 'Execute o script de criação da tabela: 20250227_create_profiles_table.sql';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Erro ao verificar a estrutura da tabela profiles: %', SQLERRM;
END;
$$;
