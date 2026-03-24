# Dashboard API - Full Stack

API RESTful para gráficos de dashboard construída com **Node.js**, **TypeScript**, **Express**, **Prisma ORM** e **MySQL**, com frontend em **React**, **shadcn/ui** e **Recharts**.

## 🚀 Features

### Backend
- ✅ Endpoints dinâmicos para gráficos (pie, line, bar, summary)
- ✅ Filtro por período (startDate, endDate)
- ✅ Agrupamento por categoria, produto, data, semana ou mês
- ✅ Type-safe com TypeScript e Prisma ORM
- ✅ Validação de dados com Zod
- ✅ Documentação Swagger/OpenAPI
- ✅ Tests unitários e de integração
- ✅ Docker e Docker Compose para containerização

### Frontend
- ✅ Dashboard interativo com React 18
- ✅ UI components com shadcn/ui
- ✅ Gráficos com Recharts
- ✅ Filtros de data com date picker
- ✅ Seletor de tipo de gráfico
- ✅ Design responsivo com Tailwind CSS
- ✅ Tema claro/escuro

## 📦 Instalação

### Opção 1: Docker Compose (Recomendado para Backend)

```bash
# Clone o repositório
git clone <repository-url>
cd test-backend

# Inicie o backend e banco de dados
docker-compose up -d

# Instale e inicie o frontend
cd frontend
npm install
npm run dev
```

O backend estará em `http://localhost:3000` e o frontend em `http://localhost:5173`.

### Opção 2: Local (Backend + Frontend)

#### Backend
```bash
cd test-backend

# Instale dependências
npm install

# Crie o .env
cp .env.example .env
# Edite .env com suas credenciais do MySQL

# Crie o banco de dados
mysql -u root -p -e "CREATE DATABASE dashboard_db;"

# Rode migrations e seed
npm run prisma:migrate
npm run prisma:generate
npm run prisma:seed  # opcional - popula dados de teste
```

#### Frontend
```bash
cd frontend

# Instale dependências
npm install
```

## ⚙️ Configuração

### Backend (.env)
```env
DATABASE_URL="mysql://root:rootpassword@localhost:3306/dashboard_db"
PORT=3000
NODE_ENV=development
```

### Frontend
O frontend usa proxy para conectar ao backend. Configure em `frontend/vite.config.ts`:
```ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    },
  },
}
```

## ▶️ Rodando a Aplicação

### Backend
```bash
# Docker
docker-compose up              # sobe os containers
docker-compose up --build      # rebuild
docker-compose down            # para containers
docker-compose logs -f         # ver logs

# Local
npm run dev                    # desenvolvimento (http://localhost:3000)
npm run build && npm start     # produção
```

### Frontend
```bash
cd frontend
npm run dev                    # desenvolvimento (http://localhost:5173)
npm run build                  # produção
npm run preview                # preview da build
```

## 📡 Endpoints da API

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `GET /` | Health | Status da API |
| `GET /api/charts/pie` | Chart | Gráfico de pizza |
| `GET /api/charts/line` | Chart | Gráfico de linha |
| `GET /api/charts/bar` | Chart | Gráfico de barras |
| `GET /api/charts/summary` | Chart | Resumo do dashboard |
| `GET /api/charts/:chartType` | Chart | Endpoint dinâmico |
| `GET /api-docs` | Docs | Documentação Swagger UI |
| `GET /api/docs` | Docs | Documentação JSON |

### Query Parameters Obrigatórios

Todos os endpoints de chart requerem:
- `startDate` - Data inicial (YYYY-MM-DD)
- `endDate` - Data final (YYYY-MM-DD)

### Query Parameters Opcionais

- `groupBy` - Campo para agrupar:
  - Para pie/bar: `category`, `product`
  - Para line: `date`, `week`, `month`

### Exemplos de Requisição

```bash
# Gráfico de pizza por categoria
curl "http://localhost:3000/api/charts/pie?startDate=2024-01-01&endDate=2024-12-31&groupBy=category"

# Gráfico de linha por mês
curl "http://localhost:3000/api/charts/line?startDate=2024-01-01&endDate=2024-12-31&groupBy=month"

# Gráfico de barras por produto
curl "http://localhost:3000/api/charts/bar?startDate=2024-01-01&endDate=2024-12-31&groupBy=product"

# Resumo do dashboard
curl "http://localhost:3000/api/charts/summary?startDate=2024-01-01&endDate=2024-12-31"
```

### Exemplo de Resposta

```json
{
  "success": true,
  "chartType": "pie",
  "filter": {
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": "2024-12-31T23:59:59.999Z"
  },
  "data": [
    { "label": "Electronics", "value": 15000 },
    { "label": "Clothing", "value": 8000 },
    { "label": "Books", "value": 5000 }
  ]
}
```

## 🧪 Tests

```bash
# Backend
npm test              # roda todos os testes
npm run test:watch    # modo watch
npm run test:coverage # com coverage

# Frontend (em desenvolvimento)
cd frontend
npm run dev
```

## 📁 Estrutura do Projeto

```
test-backend/
├── src/
│   ├── config/           # Configurações (database, swagger)
│   ├── controllers/      # Handlers HTTP
│   ├── middlewares/      # Middlewares (validação de data)
│   ├── repositories/     # Acesso ao banco (Prisma)
│   ├── services/         # Regras de negócio
│   ├── validators/       # Validação com Zod
│   ├── routes/           # Rotas da API
│   └── index.ts          # Entry point
├── prisma/
│   ├── schema.prisma     # Schema do banco
│   ├── migrations/       # Migrations
│   └── seed.ts           # Seed de dados
├── tests/
│   ├── unit/             # Testes unitários
│   └── integration/      # Testes de integração
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/       # Componentes shadcn
│   │   │   ├── charts/   # Componentes de gráficos
│   │   │   └── ...
│   │   ├── services/     # Serviços de API
│   │   ├── types/        # Tipos TypeScript
│   │   └── lib/          # Utilitários
│   └── package.json
├── docker-compose.yml
├── Dockerfile
└── README.md
```

## 📊 Database

### Model Sale
```prisma
model Sale {
  id          String   @id @default(uuid())
  productId   String
  product     String
  category    String
  amount      Float
  quantity    Int
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([category])
  @@index([createdAt])
  @@index([product])
}
```

## 🛠️ Tecnologias

### Backend
- **Node.js** + **TypeScript**
- **Express** - Framework web
- **Prisma ORM** - ORM type-safe
- **MySQL** - Banco de dados
- **Zod** - Validação de schema
- **Swagger** - Documentação API
- **Jest** - Framework de testes

### Frontend
- **React 18** + **TypeScript**
- **Vite** - Build tool
- **shadcn/ui** - Componentes UI
- **Recharts** - Biblioteca de gráficos
- **Tailwind CSS** - CSS framework
- **date-fns** - Manipulação de datas
- **Radix UI** - Primitivos de UI

## 📄 Scripts

### Backend
| Script | Descrição |
|--------|-----------|
| `npm run dev` | Dev server (ts-node) |
| `npm run build` | Build para produção |
| `npm start` | Start servidor produção |
| `npm test` | Rodar testes |
| `npm run prisma:studio` | Prisma Studio GUI |
| `npm run prisma:migrate` | Rodar migrations |
| `npm run prisma:seed` | Popular banco |

### Frontend
| Script | Descrição |
|--------|-----------|
| `npm run dev` | Dev server (Vite) |
| `npm run build` | Build produção |
| `npm run preview` | Preview build |
| `npm run lint` | ESLint |

## 🔗 Links Úteis

- **API Documentation**: http://localhost:3000/api-docs
- **Frontend**: http://localhost:5173
- **Prisma Studio**: `npm run prisma:studio`

## 📝 License

ISC

## 👨‍💻 Desenvolvimento

### Adicionando Novos Gráficos

1. Crie o método no repository (`src/repositories/chart.repository.ts`)
2. Adicione o serviço (`src/services/chart.service.ts`)
3. Crie o controller (`src/controllers/chart.controller.ts`)
4. Adicione a rota (`src/routes/chart.routes.ts`)
5. Documente com OpenAPI/Swagger
6. Crie testes

### Adicionando Novos Componentes no Frontend

1. Crie o componente em `frontend/src/components/charts/`
2. Adicione tipos em `frontend/src/types/`
3. Integre com a API em `frontend/src/services/`
4. Use no Dashboard
