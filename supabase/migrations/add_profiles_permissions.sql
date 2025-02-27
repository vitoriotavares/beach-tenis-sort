-- Script para adicionar permissões à tabela profiles
DO $$
BEGIN
    -- Verificar se a tabela profiles existe
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
        -- Conceder permissões ao role anon (cliente anônimo)
        GRANT SELECT ON public.profiles TO anon;
        
        -- Conceder permissões ao role authenticated (cliente autenticado)
        GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
        
        -- Adicionar política de segurança por linha (RLS) para a tabela profiles
        -- Primeiro, habilitar RLS na tabela
        ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
        
        -- Criar política para permitir que usuários vejam todos os perfis
        DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
        CREATE POLICY "Profiles are viewable by everyone" 
            ON public.profiles 
            FOR SELECT 
            USING (true);
        
        -- Criar política para permitir que usuários atualizem apenas seus próprios perfis
        DROP POLICY IF EXISTS "Users can update their own profiles" ON public.profiles;
        CREATE POLICY "Users can update their own profiles" 
            ON public.profiles 
            FOR UPDATE 
            USING (auth.uid() = id);
        
        -- Criar política para permitir que usuários insiram apenas seus próprios perfis
        DROP POLICY IF EXISTS "Users can insert their own profiles" ON public.profiles;
        CREATE POLICY "Users can insert their own profiles" 
            ON public.profiles 
            FOR INSERT 
            WITH CHECK (auth.uid() = id);
        
        RAISE NOTICE 'Permissões adicionadas à tabela profiles com sucesso';
    ELSE
        RAISE NOTICE 'Tabela profiles não existe, não foi possível adicionar permissões';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Erro ao adicionar permissões à tabela profiles: %', SQLERRM;
END;
$$;
