-- Migration para criar a tabela de perfis de usuários
DO $$
BEGIN
    -- Verificar se a tabela já existe para evitar erros
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
        -- Criar a tabela profiles
        CREATE TABLE public.profiles (
            id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
            email TEXT NOT NULL,
            name TEXT NOT NULL,
            avatar_url TEXT,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        -- Criar índice para buscas por email
        CREATE INDEX idx_profiles_email ON public.profiles(email);

        -- Verificar se a função update_updated_at_column já existe
        IF NOT EXISTS (SELECT FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
            -- Criar a função se não existir
            CREATE OR REPLACE FUNCTION update_updated_at_column()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = NOW();
                RETURN NEW;
            END;
            $$ language 'plpgsql';
        END IF;

        -- Criar trigger para atualizar o campo updated_at
        CREATE TRIGGER update_profiles_updated_at
            BEFORE UPDATE ON public.profiles
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();

        -- Adicionar comentários às colunas
        COMMENT ON TABLE public.profiles IS 'Perfis de usuários autenticados';
        COMMENT ON COLUMN public.profiles.id IS 'ID do usuário autenticado';
        COMMENT ON COLUMN public.profiles.email IS 'Email do usuário';
        COMMENT ON COLUMN public.profiles.name IS 'Nome do usuário';
        COMMENT ON COLUMN public.profiles.avatar_url IS 'URL do avatar do usuário';
        COMMENT ON COLUMN public.profiles.created_at IS 'Data de criação do perfil';
        COMMENT ON COLUMN public.profiles.updated_at IS 'Data da última atualização do perfil';
        
        RAISE NOTICE 'Tabela profiles criada com sucesso';
    ELSE
        RAISE NOTICE 'Tabela profiles já existe, pulando criação';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Erro ao criar tabela profiles: %', SQLERRM;
END;
$$;
