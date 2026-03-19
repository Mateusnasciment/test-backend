# Dashboard API

API RESTful para gráficos de dashboard construída com Node.js, TypeScript, Express, Prisma e MySQL.

## 🚀 Features

- Endpoints dinâmicos para gráficos (pie, line, bar, summary)
- Filtro por período (startDate, endDate)
- Agrupamento por categoria, produto, data, semana ou mês
- Type-safe com TypeScript e Prisma ORM
- Tests unitários e de integração
- Docker e Docker Compose para containerização

## 📦 Instalação

### Opção 1: Docker Compose (Recomendado)

```bash
git clone <repository-url>
cd test-backend
docker-compose up -d
```

A API estará disponível em `http://localhost:3000`

### Opção 2: Local

```bash
git clone <repository-url>
cd test-backend
npm install
```

## ⚙️ Configuração

### Local

1. Crie o `.env`:
```env
DATABASE_URL="mysql://root:rootpassword@localhost:3306/dashboard_db"
PORT=3000
NODE_ENV=development
```

2. Crie o banco e rode migrations:
```bash
mysql -u root -p -e "CREATE DATABASE dashboard_db;"
npm run prisma:migrate
npm run prisma:generate
npm run prisma:seed  # opcional
```

## ▶️ Rodando

```bash
# Docker
docker-compose up              # sobe os containers
docker-compose up --build      # rebuild
docker-compose down            # para containers
docker-compose logs -f         # ver logs

# Local
npm run dev                    # desenvolvimento
npm run build && npm start     # produção
```

## 📡 Endpoints

| Endpoint | Descrição |
|----------|-----------|
| `GET /api/charts/pie` | Gráfico de pizza (groupBy: category, product) |
| `GET /api/charts/line` | Gráfico de linha (groupBy: date, week, month) |
| `GET /api/charts/bar` | Gráfico de barras (groupBy: category, product) |
| `GET /api/charts/summary` | Resumo do dashboard |
| `GET /api/docs` | Documentação da API |

**Query params obrigatórios:** `startDate` e `endDate` (YYYY-MM-DD)

**Exemplo:**
```bash
curl "http://localhost:3000/api/charts/pie?startDate=2024-01-01&endDate=2024-12-31"
```

**Resposta:**
```json
{
  "success": true,
  "chartType": "pie",
  "data": [
    { "label": "Electronics", "value": 15000 },
    { "label": "Clothing", "value": 8000 }
  ]
}
```

## 🧪 Tests

```bash
npm test              # todos os tests
npm run test:watch    # modo watch
npm run test:coverage # com coverage
```

## 📁 Estrutura

```
src/
├── config/           # Configurações
├── controllers/      # Handlers HTTP
├── middlewares/      # Middlewares (ex: dateFilter)
├── repositories/     # Acesso ao banco
├── services/         # Regras de negócio
├── validators/       # Validação com Zod
└── routes/           # Rotas
```

## 📊 Database

**Model Sale:**
- id, productId, product, category
- amount, quantity, createdAt, updatedAt

## 📜 Scripts

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Dev server |
| `npm run build` | Build produção |
| `npm test` | Rodar tests |
| `npm run prisma:studio` | Prisma Studio |

## 📄 License

ISC
