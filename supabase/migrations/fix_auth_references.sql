-- Script para verificar e corrigir problemas com referências à tabela auth.users
DO $$
DECLARE
    auth_users_exists BOOLEAN;
    auth_schema_exists BOOLEAN;
    profiles_exists BOOLEAN;
    auth_role_exists BOOLEAN;
    service_role_exists BOOLEAN;
BEGIN
    -- Verificar se o schema auth existe
    SELECT EXISTS (
        SELECT FROM pg_namespace 
        WHERE nspname = 'auth'
    ) INTO auth_schema_exists;
    
    RAISE NOTICE 'Schema auth existe: %', auth_schema_exists;
    
    -- Verificar se a tabela auth.users existe
    IF auth_schema_exists THEN
        SELECT EXISTS (
            SELECT FROM pg_tables 
            WHERE schemaname = 'auth' 
            AND tablename = 'users'
        ) INTO auth_users_exists;
        
        RAISE NOTICE 'Tabela auth.users existe: %', auth_users_exists;
    ELSE
        RAISE NOTICE 'Schema auth não existe, não é possível verificar a tabela auth.users';
        auth_users_exists := FALSE;
    END IF;
    
    -- Verificar se a tabela profiles existe
    SELECT EXISTS (
        SELECT FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'profiles'
    ) INTO profiles_exists;
    
    RAISE NOTICE 'Tabela profiles existe: %', profiles_exists;
    
    -- Verificar se os roles necessários existem
    SELECT EXISTS (
        SELECT FROM pg_roles 
        WHERE rolname = 'auth'
    ) INTO auth_role_exists;
    
    RAISE NOTICE 'Role auth existe: %', auth_role_exists;
    
    SELECT EXISTS (
        SELECT FROM pg_roles 
        WHERE rolname = 'service_role'
    ) INTO service_role_exists;
    
    RAISE NOTICE 'Role service_role existe: %', service_role_exists;
    
    -- Se a tabela profiles existe mas a tabela auth.users não existe, precisamos criar uma solução alternativa
    IF profiles_exists AND NOT auth_users_exists THEN
        RAISE NOTICE 'A tabela profiles existe, mas a tabela auth.users não existe. Tentando corrigir...';
        
        -- Remover a restrição de chave estrangeira
        BEGIN
            ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
            RAISE NOTICE 'Restrição de chave estrangeira removida com sucesso';
        EXCEPTION
            WHEN OTHERS THEN
                RAISE NOTICE 'Erro ao remover restrição de chave estrangeira: %', SQLERRM;
        END;
    END IF;
    
    -- Verificar se há algum problema com as permissões
    IF profiles_exists THEN
        -- Conceder permissões ao role anon (cliente anônimo)
        BEGIN
            GRANT SELECT ON public.profiles TO anon;
            RAISE NOTICE 'Permissões SELECT concedidas ao role anon';
        EXCEPTION
            WHEN OTHERS THEN
                RAISE NOTICE 'Erro ao conceder permissões SELECT ao role anon: %', SQLERRM;
        END;
        
        -- Conceder permissões ao role authenticated (cliente autenticado)
        BEGIN
            GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
            RAISE NOTICE 'Permissões SELECT, INSERT, UPDATE concedidas ao role authenticated';
        EXCEPTION
            WHEN OTHERS THEN
                RAISE NOTICE 'Erro ao conceder permissões ao role authenticated: %', SQLERRM;
        END;
        
        -- Conceder permissões ao role service_role
        IF service_role_exists THEN
            BEGIN
                GRANT ALL ON public.profiles TO service_role;
                RAISE NOTICE 'Permissões ALL concedidas ao role service_role';
            EXCEPTION
                WHEN OTHERS THEN
                    RAISE NOTICE 'Erro ao conceder permissões ao role service_role: %', SQLERRM;
            END;
        END IF;
    END IF;
END;
$$;
