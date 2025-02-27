-- Script completo para corrigir o erro de "column full_name does not exist"
-- Execute este script no SQL Editor do Supabase

-- Parte 1: Diagnóstico inicial
DO $$
BEGIN
    RAISE NOTICE '=== DIAGNÓSTICO INICIAL ===';
    
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
            RAISE NOTICE 'Isso é a causa do erro "column full_name does not exist"';
        END IF;
    ELSE
        RAISE NOTICE 'Tabela profiles NÃO existe!';
    END IF;
END;
$$;

-- Parte 2: Adicionar a coluna full_name à tabela profiles
DO $$
BEGIN
    RAISE NOTICE '=== ADICIONANDO COLUNA FULL_NAME ===';
    
    -- Verificar se a tabela profiles existe
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
        -- Verificar se a coluna full_name já existe
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'profiles' 
            AND column_name = 'full_name'
        ) THEN
            -- Adicionar a coluna full_name
            ALTER TABLE public.profiles ADD COLUMN full_name TEXT;
            
            -- Atualizar os registros existentes para copiar o valor de name para full_name
            UPDATE public.profiles SET full_name = name WHERE full_name IS NULL;
            
            RAISE NOTICE 'Coluna full_name adicionada à tabela profiles com sucesso';
        ELSE
            RAISE NOTICE 'Coluna full_name já existe na tabela profiles';
        END IF;
    ELSE
        RAISE NOTICE 'Tabela profiles não existe, criando a tabela...';
        
        -- Criar a tabela profiles
        CREATE TABLE public.profiles (
            id UUID PRIMARY KEY,
            email TEXT NOT NULL,
            name TEXT NOT NULL DEFAULT 'Usuário',
            full_name TEXT,
            avatar_url TEXT,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        
        RAISE NOTICE 'Tabela profiles criada com sucesso';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Erro ao adicionar coluna full_name: %', SQLERRM;
END;
$$;

-- Parte 3: Verificar as permissões da tabela
DO $$
BEGIN
    RAISE NOTICE '=== VERIFICANDO PERMISSÕES ===';
    
    -- Verificar se a tabela profiles existe
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
        -- Garantir que o RLS está habilitado
        ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
        
        -- Conceder permissões aos roles
        GRANT SELECT ON public.profiles TO anon;
        GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
        GRANT ALL ON public.profiles TO service_role;
        
        -- Criar política para permitir que usuários vejam todos os perfis
        DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
        CREATE POLICY "Profiles are viewable by everyone" 
            ON public.profiles 
            FOR SELECT 
            USING (true);
        
        -- Criar política para permitir que usuários atualizem seus próprios perfis
        DROP POLICY IF EXISTS "Users can update their own profiles" ON public.profiles;
        CREATE POLICY "Users can update their own profiles" 
            ON public.profiles 
            FOR UPDATE 
            USING (auth.uid() = id);
        
        -- Criar política para permitir que usuários insiram seus próprios perfis
        DROP POLICY IF EXISTS "Users can insert their own profiles" ON public.profiles;
        CREATE POLICY "Users can insert their own profiles" 
            ON public.profiles 
            FOR INSERT 
            WITH CHECK (auth.uid() = id);
        
        RAISE NOTICE 'Permissões configuradas com sucesso';
    ELSE
        RAISE NOTICE 'Tabela profiles não existe, não foi possível configurar permissões';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Erro ao configurar permissões: %', SQLERRM;
END;
$$;

-- Parte 4: Diagnóstico final
DO $$
BEGIN
    RAISE NOTICE '=== DIAGNÓSTICO FINAL ===';
    
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
            RAISE NOTICE 'O erro "column full_name does not exist" deve estar resolvido';
        ELSE
            RAISE NOTICE 'Coluna full_name NÃO existe na tabela profiles';
            RAISE NOTICE 'Ocorreu um erro ao adicionar a coluna';
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
        RAISE NOTICE 'Ocorreu um erro ao criar a tabela';
    END IF;
    
    RAISE NOTICE '=== CORREÇÃO CONCLUÍDA ===';
    RAISE NOTICE 'Se o diagnóstico final indicar que a coluna full_name existe, o erro deve estar resolvido.';
    RAISE NOTICE 'Tente fazer login novamente e verifique se o erro persiste.';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Erro no diagnóstico final: %', SQLERRM;
END;
$$;
