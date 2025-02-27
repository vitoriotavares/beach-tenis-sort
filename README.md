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

## Comandos Úteis

```bash
# Build para produção
npm run build

# Iniciar em produção
npm start

# Lint
npm run lint
```
