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
```

## Comandos Úteis

```bash
# Build para produção
npm run build

# Iniciar em produção
npm start

# Lint
npm run lint
```
