# 🛍️ MinhaLoja — Mini E-commerce Full-Stack

Projeto de portfólio: um e-commerce completo com listagem de produtos, carrinho,
checkout simulado, autenticação e painel administrativo — construído do zero
com Next.js 14 (App Router), Prisma e NextAuth.

## ✨ Funcionalidades

**Loja (cliente)**
- Listagem de produtos com busca e filtro por categoria
- Página de detalhe do produto
- Carrinho persistente (Zustand + localStorage)
- Checkout simulado (endereço + "pagamento" fake, sem gateway real)
- Histórico de pedidos do usuário logado

**Painel administrativo**
- Login com controle de acesso por papel (admin/cliente)
- CRUD de produtos
- Visualização e detalhamento de pedidos
- Dashboard com faturamento total, nº de pedidos e produtos mais vendidos

## 🧱 Stack

| Camada       | Tecnologia                          |
|--------------|--------------------------------------|
| Frontend     | Next.js 14 (App Router) + React 18   |
| Estilo       | Tailwind CSS                         |
| Estado       | Zustand (carrinho)                   |
| Backend      | API Routes do Next.js                |
| Banco        | SQLite (dev) / PostgreSQL (produção) |
| ORM          | Prisma                               |
| Autenticação | NextAuth.js (Credentials + JWT)      |
| Testes       | Vitest + Testing Library (unitário), Playwright (E2E) |
| CI           | GitHub Actions                       |

## 🚀 Rodando localmente

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env

# 3. Criar o banco e as tabelas
npm run db:push

# 4. Popular com dados de exemplo (produtos + usuários de teste)
npm run db:seed

# 5. Rodar em desenvolvimento
npm run dev
```

Acesse `http://localhost:3000`.

### Contas de teste (criadas pelo seed)

| Papel   | Email              | Senha       |
|---------|---------------------|-------------|
| Admin   | admin@loja.com       | admin123    |
| Cliente | cliente@teste.com    | cliente123  |

## 🧪 Testes

```bash
npm run test          # testes unitários (Vitest)
npm run test:watch    # unitários em modo watch
npm run test:e2e      # testes E2E (Playwright) — sobe o app automaticamente
```

## 🔄 CI/CD

O workflow em `.github/workflows/ci.yml` roda a cada push/PR na `main`:
1. Lint
2. Testes unitários
3. Build de produção
4. Testes E2E completos (login, carrinho, checkout, controle de acesso admin)

## 📦 Deploy

Sugestão de stack gratuita:
- **App:** [Vercel](https://vercel.com) (deploy automático a partir do GitHub)
- **Banco:** [Neon](https://neon.tech) ou [Supabase](https://supabase.com) (Postgres gratuito)

Para produção, troque o `provider` do `prisma/schema.prisma` de `sqlite` para
`postgresql` e aponte a `DATABASE_URL` para o banco gerenciado.

## 📁 Estrutura de pastas

```
src/
  app/            → páginas e rotas (App Router)
    admin/        → painel administrativo
    api/          → API routes (produtos, pedidos, auth)
  components/     → componentes React reutilizáveis
  lib/            → Prisma client, auth, store do carrinho
  types/          → tipos TypeScript compartilhados
prisma/
  schema.prisma   → modelos do banco
  seed.ts         → dados de exemplo
tests/
  unit/           → testes unitários (Vitest)
  e2e/            → testes end-to-end (Playwright)
```

## 🗺️ Possíveis próximos passos

- Integração real de pagamento (Stripe)
- Upload de imagens (S3/Cloudinary) em vez de URL manual
- Paginação/infinite scroll na listagem
- Avaliações de produtos
- Notificação por email ao mudar status do pedido

---

Feito como projeto de estudo/portfólio.
