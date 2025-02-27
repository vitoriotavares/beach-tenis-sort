-- Script para verificar se a tabela profiles existe e mostrar informações úteis para debug
DO $$
DECLARE
    table_exists BOOLEAN;
    table_info RECORD;
BEGIN
    -- Verificar se a tabela profiles existe
    SELECT EXISTS (
        SELECT FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'profiles'
    ) INTO table_exists;
    
    RAISE NOTICE 'Tabela profiles existe: %', table_exists;
    
    -- Se a tabela existir, mostrar informações sobre ela
    IF table_exists THEN
        -- Mostrar a estrutura da tabela
        RAISE NOTICE 'Estrutura da tabela profiles:';
        FOR table_info IN 
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_schema = 'public'
            AND table_name = 'profiles'
            ORDER BY ordinal_position
        LOOP
            RAISE NOTICE 'Coluna: %, Tipo: %, Nullable: %', 
                table_info.column_name, 
                table_info.data_type, 
                table_info.is_nullable;
        END LOOP;
        
        -- Verificar se há registros na tabela
        DECLARE
            record_count INTEGER;
        BEGIN
            EXECUTE 'SELECT COUNT(*) FROM public.profiles' INTO record_count;
            RAISE NOTICE 'Número de registros na tabela profiles: %', record_count;
        END;
        
        -- Verificar se há triggers na tabela
        DECLARE
            trigger_count INTEGER;
        BEGIN
            SELECT COUNT(*) INTO trigger_count
            FROM pg_trigger t
            JOIN pg_class c ON t.tgrelid = c.oid
            JOIN pg_namespace n ON c.relnamespace = n.oid
            WHERE n.nspname = 'public'
            AND c.relname = 'profiles'
            AND NOT t.tgisinternal;
            
            RAISE NOTICE 'Número de triggers na tabela profiles: %', trigger_count;
        END;
    ELSE
        -- Verificar se a função update_updated_at_column existe
        DECLARE
            function_exists BOOLEAN;
        BEGIN
            SELECT EXISTS (
                SELECT FROM pg_proc 
                WHERE proname = 'update_updated_at_column'
            ) INTO function_exists;
            
            RAISE NOTICE 'Função update_updated_at_column existe: %', function_exists;
        END;
    END IF;
    
    -- Verificar se a tabela auth.users existe
    DECLARE
        auth_users_exists BOOLEAN;
    BEGIN
        SELECT EXISTS (
            SELECT FROM pg_tables 
            WHERE schemaname = 'auth' 
            AND tablename = 'users'
        ) INTO auth_users_exists;
        
        RAISE NOTICE 'Tabela auth.users existe: %', auth_users_exists;
    END;
END;
$$;
