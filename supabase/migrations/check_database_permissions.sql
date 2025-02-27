-- Script para verificar as permissões do banco de dados
DO $$
DECLARE
    role_info RECORD;
    table_info RECORD;
    schema_info RECORD;
BEGIN
    -- Verificar os roles disponíveis
    RAISE NOTICE 'Roles disponíveis:';
    FOR role_info IN 
        SELECT rolname, rolsuper, rolinherit, rolcreaterole, rolcreatedb
        FROM pg_roles
        ORDER BY rolname
    LOOP
        RAISE NOTICE 'Role: %, Super: %, Inherit: %, Create Role: %, Create DB: %', 
            role_info.rolname, 
            role_info.rolsuper, 
            role_info.rolinherit, 
            role_info.rolcreaterole, 
            role_info.rolcreatedb;
    END LOOP;
    
    -- Verificar os schemas disponíveis
    RAISE NOTICE 'Schemas disponíveis:';
    FOR schema_info IN 
        SELECT nspname
        FROM pg_namespace
        WHERE nspname NOT LIKE 'pg_%' AND nspname != 'information_schema'
        ORDER BY nspname
    LOOP
        RAISE NOTICE 'Schema: %', schema_info.nspname;
    END LOOP;
    
    -- Verificar as tabelas disponíveis no schema public
    RAISE NOTICE 'Tabelas no schema public:';
    FOR table_info IN 
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = 'public'
        ORDER BY tablename
    LOOP
        RAISE NOTICE 'Tabela: %', table_info.tablename;
    END LOOP;
    
    -- Verificar as tabelas disponíveis no schema auth
    RAISE NOTICE 'Tabelas no schema auth:';
    FOR table_info IN 
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = 'auth'
        ORDER BY tablename
    LOOP
        RAISE NOTICE 'Tabela: %', table_info.tablename;
    END LOOP;
    
    -- Verificar as permissões do role anon (usado pelo cliente anônimo do Supabase)
    RAISE NOTICE 'Permissões do role anon:';
    FOR table_info IN 
        SELECT table_schema, table_name, privilege_type
        FROM information_schema.role_table_grants
        WHERE grantee = 'anon'
        ORDER BY table_schema, table_name, privilege_type
    LOOP
        RAISE NOTICE 'Schema: %, Tabela: %, Privilégio: %', 
            table_info.table_schema, 
            table_info.table_name, 
            table_info.privilege_type;
    END LOOP;
    
    -- Verificar as permissões do role authenticated (usado pelo cliente autenticado do Supabase)
    RAISE NOTICE 'Permissões do role authenticated:';
    FOR table_info IN 
        SELECT table_schema, table_name, privilege_type
        FROM information_schema.role_table_grants
        WHERE grantee = 'authenticated'
        ORDER BY table_schema, table_name, privilege_type
    LOOP
        RAISE NOTICE 'Schema: %, Tabela: %, Privilégio: %', 
            table_info.table_schema, 
            table_info.table_name, 
            table_info.privilege_type;
    END LOOP;
END;
$$;
