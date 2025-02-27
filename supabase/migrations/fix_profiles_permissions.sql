-- Script para corrigir permissões específicas para a tabela profiles
DO $$
BEGIN
    -- Verificar se a tabela profiles existe
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
        -- Garantir que o RLS está habilitado
        ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
        
        -- Remover todas as políticas existentes para evitar conflitos
        DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
        DROP POLICY IF EXISTS "Users can update their own profiles" ON public.profiles;
        DROP POLICY IF EXISTS "Users can insert their own profiles" ON public.profiles;
        DROP POLICY IF EXISTS "Service role can manage all profiles" ON public.profiles;
        
        -- Criar política para permitir que usuários vejam todos os perfis
        CREATE POLICY "Profiles are viewable by everyone" 
            ON public.profiles 
            FOR SELECT 
            USING (true);
        
        -- Criar política para permitir que usuários atualizem seus próprios perfis
        CREATE POLICY "Users can update their own profiles" 
            ON public.profiles 
            FOR UPDATE 
            USING (auth.uid() = id);
        
        -- Criar política para permitir que usuários insiram seus próprios perfis
        CREATE POLICY "Users can insert their own profiles" 
            ON public.profiles 
            FOR INSERT 
            WITH CHECK (auth.uid() = id);
        
        -- Criar política para permitir que o service_role gerencie todos os perfis
        CREATE POLICY "Service role can manage all profiles" 
            ON public.profiles 
            FOR ALL 
            TO service_role
            USING (true);
        
        -- Conceder permissões aos roles
        GRANT SELECT ON public.profiles TO anon;
        GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
        GRANT ALL ON public.profiles TO service_role;
        
        -- Verificar se há alguma restrição de chave estrangeira que possa estar causando problemas
        DO $$
        DECLARE
            fk_exists BOOLEAN;
        BEGIN
            SELECT EXISTS (
                SELECT FROM pg_constraint 
                WHERE conname = 'profiles_id_fkey'
            ) INTO fk_exists;
            
            IF fk_exists THEN
                RAISE NOTICE 'Foreign key constraint profiles_id_fkey exists';
                
                -- Verificar se o schema auth existe
                IF EXISTS (SELECT FROM pg_namespace WHERE nspname = 'auth') THEN
                    -- Verificar se a tabela auth.users existe
                    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'auth' AND tablename = 'users') THEN
                        RAISE NOTICE 'auth.users table exists, foreign key should work correctly';
                    ELSE
                        RAISE NOTICE 'auth.users table does not exist, this could cause foreign key issues';
                        
                        -- Opcionalmente, remover a restrição de chave estrangeira
                        -- Descomente a linha abaixo se quiser remover a restrição
                        -- ALTER TABLE public.profiles DROP CONSTRAINT profiles_id_fkey;
                    END IF;
                ELSE
                    RAISE NOTICE 'auth schema does not exist, this could cause foreign key issues';
                END IF;
            ELSE
                RAISE NOTICE 'No foreign key constraint profiles_id_fkey found';
            END IF;
        END;
        $$;
        
        RAISE NOTICE 'Permissões corrigidas para a tabela profiles';
    ELSE
        RAISE NOTICE 'Tabela profiles não existe, não foi possível corrigir permissões';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Erro ao corrigir permissões: %', SQLERRM;
END;
$$;
