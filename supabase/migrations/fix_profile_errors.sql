-- Script completo para corrigir erros comuns na tabela profiles
-- Este script resolve:
-- 1. O erro "column 'full_name' of relation 'profiles' does not exist"
-- 2. O erro "null value in column 'name' violates not-null constraint"

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
            RAISE NOTICE 'Isso pode causar o erro "column full_name does not exist"';
        END IF;
        
        -- Verificar se há registros com name NULL
        IF EXISTS (
            SELECT FROM public.profiles WHERE name IS NULL
        ) THEN
            RAISE NOTICE 'Existem registros com name NULL';
            RAISE NOTICE 'Isso pode causar o erro "null value in column name violates not-null constraint"';
        ELSE
            RAISE NOTICE 'Não existem registros com name NULL';
        END IF;
    ELSE
        RAISE NOTICE 'Tabela profiles NÃO existe!';
    END IF;
END;
$$;

-- Parte 2: Corrigir a tabela profiles
DO $$
BEGIN
    RAISE NOTICE '=== CORRIGINDO A TABELA PROFILES ===';
    
    -- Verificar se a tabela profiles existe
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
        -- 1. Adicionar a coluna full_name se não existir
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'profiles' 
            AND column_name = 'full_name'
        ) THEN
            ALTER TABLE public.profiles ADD COLUMN full_name TEXT;
            RAISE NOTICE 'Coluna full_name adicionada à tabela profiles';
            
            -- Atualizar os registros existentes para copiar o valor de name para full_name
            UPDATE public.profiles SET full_name = name WHERE full_name IS NULL;
            RAISE NOTICE 'Valores copiados de name para full_name';
        ELSE
            RAISE NOTICE 'Coluna full_name já existe na tabela profiles';
        END IF;
        
        -- 2. Corrigir registros com name NULL
        IF EXISTS (
            SELECT FROM public.profiles WHERE name IS NULL
        ) THEN
            RAISE NOTICE 'Corrigindo registros com name NULL...';
            
            -- Atualizar registros com name NULL para usar email ou valor padrão
            UPDATE public.profiles 
            SET name = COALESCE(
                email, 
                SUBSTRING(email FROM '^[^@]+'),
                'Usuário'
            )
            WHERE name IS NULL;
            
            RAISE NOTICE 'Registros com name NULL corrigidos';
        ELSE
            RAISE NOTICE 'Não existem registros com name NULL para corrigir';
        END IF;
        
        -- 3. Adicionar valor padrão à coluna name
        ALTER TABLE public.profiles 
        ALTER COLUMN name SET DEFAULT 'Usuário';
        
        RAISE NOTICE 'Valor padrão adicionado à coluna name';
    ELSE
        RAISE NOTICE 'Tabela profiles não existe, criando a tabela...';
        
        -- Criar a tabela profiles com as colunas corretas
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
        RAISE NOTICE 'Erro ao corrigir a tabela profiles: %', SQLERRM;
END;
$$;

-- Parte 3: Configurar permissões
DO $$
BEGIN
    RAISE NOTICE '=== CONFIGURANDO PERMISSÕES ===';
    
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
        
        -- Verificar se há registros com name NULL
        IF EXISTS (
            SELECT FROM public.profiles WHERE name IS NULL
        ) THEN
            RAISE NOTICE 'ATENÇÃO: Ainda existem registros com name NULL!';
            RAISE NOTICE 'O erro "null value in column name violates not-null constraint" pode persistir';
        ELSE
            RAISE NOTICE 'Não existem registros com name NULL';
            RAISE NOTICE 'O erro "null value in column name violates not-null constraint" deve estar resolvido';
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
    RAISE NOTICE 'Se o diagnóstico final indicar que a coluna full_name existe e não há registros com name NULL, os erros devem estar resolvidos.';
    RAISE NOTICE 'Tente fazer login novamente e verifique se os erros persistem.';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Erro no diagnóstico final: %', SQLERRM;
END;
$$;
