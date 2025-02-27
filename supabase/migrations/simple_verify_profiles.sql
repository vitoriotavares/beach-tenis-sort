-- Script simplificado para verificar a estrutura da tabela profiles
DO $$
BEGIN
    -- Verificar se a tabela profiles existe
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
        RAISE NOTICE 'Tabela profiles existe';
        
        -- Verificar se a coluna full_name existe
        IF EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'profiles' 
            AND column_name = 'full_name'
        ) THEN
            RAISE NOTICE 'Coluna full_name existe na tabela profiles';
        ELSE
            RAISE NOTICE 'Coluna full_name NÃO existe na tabela profiles';
            RAISE NOTICE 'Isso pode causar erros se o código estiver tentando acessar essa coluna';
        END IF;
        
        -- Verificar se a coluna name existe
        IF EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'profiles' 
            AND column_name = 'name'
        ) THEN
            RAISE NOTICE 'Coluna name existe na tabela profiles';
        ELSE
            RAISE NOTICE 'Coluna name NÃO existe na tabela profiles - ISSO É UM PROBLEMA!';
        END IF;
        
        -- Verificar se o RLS está habilitado
        IF EXISTS (
            SELECT FROM pg_tables 
            WHERE schemaname = 'public' 
            AND tablename = 'profiles' 
            AND rowsecurity = true
        ) THEN
            RAISE NOTICE 'Row Level Security (RLS) está HABILITADO para a tabela profiles';
        ELSE
            RAISE NOTICE 'Row Level Security (RLS) está DESABILITADO para a tabela profiles';
        END IF;
        
        -- Contar o número de políticas RLS
        RAISE NOTICE 'Número de políticas RLS: %', (
            SELECT COUNT(*) 
            FROM pg_policy 
            WHERE polrelid = 'public.profiles'::regclass
        );
    ELSE
        RAISE NOTICE 'Tabela profiles NÃO existe!';
        RAISE NOTICE 'Execute o script de criação da tabela: 20250227_create_profiles_table.sql';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Erro ao verificar a estrutura da tabela profiles: %', SQLERRM;
END;
$$;
