-- Script para corrigir o erro "null value in column 'name' violates not-null constraint"
DO $$
BEGIN
    RAISE NOTICE '=== CORRIGINDO ERRO DE NULL NA COLUNA NAME ===';
    
    -- Verificar se a tabela profiles existe
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
        RAISE NOTICE 'Tabela profiles existe';
        
        -- Verificar se há registros com name NULL
        IF EXISTS (
            SELECT FROM public.profiles WHERE name IS NULL
        ) THEN
            RAISE NOTICE 'Existem registros com name NULL, atualizando...';
            
            -- Atualizar registros com name NULL para usar email ou valor padrão
            UPDATE public.profiles 
            SET name = COALESCE(
                email, 
                SUBSTRING(email FROM '^[^@]+'),
                'Usuário'
            )
            WHERE name IS NULL;
            
            RAISE NOTICE 'Registros atualizados com sucesso';
        ELSE
            RAISE NOTICE 'Não existem registros com name NULL';
        END IF;
        
        -- Adicionar valor padrão à coluna name
        ALTER TABLE public.profiles 
        ALTER COLUMN name SET DEFAULT 'Usuário';
        
        RAISE NOTICE 'Valor padrão adicionado à coluna name';
        
        -- Verificar novamente se há registros com name NULL
        IF EXISTS (
            SELECT FROM public.profiles WHERE name IS NULL
        ) THEN
            RAISE NOTICE 'ATENÇÃO: Ainda existem registros com name NULL!';
        ELSE
            RAISE NOTICE 'Não existem mais registros com name NULL';
        END IF;
    ELSE
        RAISE NOTICE 'Tabela profiles não existe!';
    END IF;
    
    RAISE NOTICE '=== CORREÇÃO CONCLUÍDA ===';
    RAISE NOTICE 'Se não existem mais registros com name NULL, o erro deve estar resolvido.';
    RAISE NOTICE 'Tente fazer login novamente e verifique se o erro persiste.';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Erro ao corrigir valores NULL: %', SQLERRM;
END;
$$;
