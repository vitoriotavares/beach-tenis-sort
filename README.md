# Beach Tennis Tournament Manager

Aplicativo para gerenciamento de torneios de beach tennis.

## Funcionalidades

- Criação e gerenciamento de torneios
- Registro de participantes
- Sorteio automático de partidas
- Inscrição em torneios via autenticação Google
- Acompanhamento de status de pagamento e check-in

## Tecnologias

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Zustand (Gerenciamento de Estado)
- Headless UI (Componentes)
- Supabase (Autenticação e Banco de Dados)

## Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

O servidor estará disponível em `http://localhost:3000`

## Deploy na Vercel

1. Crie uma conta na [Vercel](https://vercel.com)

2. Instale a CLI da Vercel:
```bash
npm i -g vercel
```

3. Faça login na sua conta:
```bash
vercel login
```

4. Deploy:
```bash
# Para ambiente de desenvolvimento
vercel

# Para produção
vercel --prod
```

## Configuração

O projeto já está configurado para deploy na Vercel com:

- Região: São Paulo (GRU1)
- Headers de segurança
- Build otimizada
- Cache configurado

## Variáveis de Ambiente

Se necessário, configure as seguintes variáveis de ambiente na Vercel:

```env
# Exemplo (substitua pelos valores reais)
NEXT_PUBLIC_API_URL=https://api.exemplo.com

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# URL do site em produção (importante para autenticação)
NEXT_PUBLIC_SITE_URL=https://your-production-url.vercel.app
```

## Configuração do Supabase para Autenticação

Para que a autenticação funcione corretamente em produção, siga estes passos:

1. Acesse o painel de controle do Supabase
2. Vá para Authentication > URL Configuration
3. Adicione o URL do seu site em produção (ex: https://your-production-url.vercel.app) em "Site URL"
4. Vá para Authentication > Providers > Google
5. Adicione o URL de redirecionamento em produção:
   - https://your-production-url.vercel.app/auth/callback
6. Certifique-se de que o URL de redirecionamento também esteja configurado no Console do Google Cloud Platform no projeto que fornece o OAuth

Isso garantirá que o redirecionamento após a autenticação funcione corretamente em produção.

## Banco de Dados

### Migrações

O projeto utiliza o Supabase como banco de dados. Para executar as migrações e criar as tabelas necessárias:

1. Instale a CLI do Supabase:
```bash
npm install -g supabase
```

2. Faça login na sua conta Supabase:
```bash
supabase login
```

3. Vincule seu projeto:
```bash
supabase link --project-ref <sua-referencia-de-projeto>
```

4. Execute as migrações:
```bash
supabase db push
```

### Tabela de Perfis de Usuários

Para que o login automático funcione corretamente, é necessário criar a tabela `profiles` no banco de dados. Uma migração para isso foi adicionada em `supabase/migrations/20250227_create_profiles_table.sql`.

Se você estiver enfrentando erros de "Database error saving new user" durante o login, siga estes passos:

#### Diagnóstico do Problema

Primeiro, verifique os logs do console do navegador durante o processo de login. Procure por mensagens de erro específicas que podem indicar a causa do problema:

- `Table "profiles" does not exist` - A tabela de perfis não foi criada
- `Permission denied` - Problemas de permissão no banco de dados
- `Foreign key violation` - Problemas com a referência à tabela de usuários
- `Duplicate key violation` - Tentativa de criar um perfil que já existe
- `column "full_name" of relation "profiles" does not exist` - Problema com a coluna full_name

#### Solução para o Erro de Coluna "full_name"

Se você encontrar o erro específico `column "full_name" of relation "profiles" does not exist`, isso indica que o código está tentando acessar uma coluna que não existe na tabela. Duas soluções são possíveis:

1. **Solução Recomendada**: Atualize o código para usar apenas a coluna `name` em vez de `full_name`. As atualizações já foram feitas nos arquivos:
   - `src/app/auth/callback/page.tsx`
   - `src/lib/supabase/queries.ts`

2. **Solução Alternativa**: Execute o script para adicionar a coluna `full_name` à tabela:
   ```sql
   -- Cole o conteúdo do arquivo supabase/migrations/add_full_name_column.sql
   ```

#### Solução para o Erro de Valor NULL na Coluna "name"

Se você encontrar o erro `null value in column "name" of relation "profiles" violates not-null constraint`, isso indica que o código está tentando inserir um valor NULL na coluna "name", mas essa coluna tem uma restrição NOT NULL. Para resolver esse problema:

1. **Solução via código**: As atualizações já foram feitas nos arquivos:
   - `src/app/auth/callback/page.tsx` - Adicionamos valores padrão para garantir que name nunca seja NULL
   - `src/lib/supabase/queries.ts` - Melhoramos a validação do nome do usuário

2. **Solução via banco de dados**: Execute o script para corrigir os registros existentes e adicionar um valor padrão à coluna:
   ```sql
   -- Cole o conteúdo do arquivo supabase/migrations/fix_name_null_error.sql
   ```

Este script irá:
- Verificar se existem registros com name NULL
- Atualizar esses registros para usar o email ou um valor padrão
- Adicionar um valor padrão à coluna name
- Verificar se a correção foi bem-sucedida

Após executar o script, tente fazer login novamente e o erro deve estar resolvido.

#### Solução Rápida com Script Único

Para resolver o problema rapidamente, você pode executar um único script que fará o diagnóstico, adicionará a coluna `full_name` e configurará as permissões necessárias:

1. Acesse o painel do Supabase (https://app.supabase.io)
2. Selecione seu projeto
3. Vá para a seção "SQL Editor"
4. Cole e execute o seguinte script:
   ```sql
   -- Cole o conteúdo do arquivo supabase/migrations/fix_full_name_error.sql
   ```

Este script completo irá:
- Diagnosticar o problema atual
- Adicionar a coluna `full_name` à tabela `profiles` (se não existir)
- Copiar os valores da coluna `name` para `full_name`
- Configurar as permissões necessárias
- Verificar se a correção foi bem-sucedida

Após executar o script, tente fazer login novamente e o erro deve estar resolvido.

#### Solução Passo a Passo

1. Acesse o painel do Supabase (https://app.supabase.io)
2. Selecione seu projeto
3. Vá para a seção "SQL Editor"
4. Execute os seguintes scripts na ordem:

   a. Primeiro, execute o script de diagnóstico para verificar o estado atual:
   ```sql
   -- Cole o conteúdo do arquivo supabase/migrations/simple_verify_profiles.sql
   ```

   b. Adicione a função RPC para verificação de tabelas:
   ```sql
   -- Cole o conteúdo do arquivo supabase/migrations/add_check_table_exists_function.sql
   ```

   c. Verifique e corrija referências à tabela auth.users:
   ```sql
   -- Cole o conteúdo do arquivo supabase/migrations/fix_auth_references.sql
   ```

   d. Crie a tabela profiles (se não existir):
   ```sql
   -- Cole o conteúdo do arquivo supabase/migrations/20250227_create_profiles_table.sql
   ```

   e. Corrija as permissões da tabela profiles:
   ```sql
   -- Cole o conteúdo do arquivo supabase/migrations/fix_profiles_permissions.sql
   ```

   f. Por fim, adicione as permissões necessárias:
   ```sql
   -- Cole o conteúdo do arquivo supabase/migrations/add_profiles_permissions.sql
   ```

5. Verifique se a tabela foi criada corretamente executando novamente o script de diagnóstico.

#### Solução Combinada para Todos os Erros

Para resolver todos os problemas de uma vez, você pode executar um único script que corrige tanto o erro de coluna "full_name" quanto o erro de valores NULL na coluna "name":

1. Acesse o painel do Supabase (https://app.supabase.io)
2. Selecione seu projeto
3. Vá para a seção "SQL Editor"
4. Cole e execute o seguinte script:
   ```sql
   -- Cole o conteúdo do arquivo supabase/migrations/fix_profile_errors.sql
   ```

Este script completo irá:
- Diagnosticar os problemas atuais
- Adicionar a coluna `full_name` à tabela `profiles` (se não existir)
- Corrigir registros com valores NULL na coluna `name`
- Adicionar valores padrão para evitar problemas futuros
- Configurar todas as permissões necessárias
- Verificar se as correções foram bem-sucedidas

Após executar o script, tente fazer login novamente e os erros devem estar resolvidos.

#### Executando a Aplicação em Modo Debug

Para executar a aplicação localmente em modo debug e ver os logs detalhados:

```bash
# No diretório do projeto
npm run dev
```

Abra o console do navegador (F12) para ver os logs detalhados durante o processo de login.

## Comandos Úteis

```bash
# Build para produção
npm run build

# Iniciar em produção
npm start

# Lint
npm run lint

```
