-- Script para adicionar a coluna full_name à tabela profiles
DO $$
BEGIN
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
        RAISE NOTICE 'Tabela profiles não existe, não foi possível adicionar a coluna full_name';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Erro ao adicionar coluna full_name: %', SQLERRM;
END;
$$;
