# 🔧 Guia de Configuração

## Pré-requisitos

- Conta no Railway
- Conta no GitHub
- Git instalado
- Node.js 18+ (para desenvolvimento local)
- Python 3.11+ (para desenvolvimento local)

## 1. Deploy no Railway

### Opção A: One-Click Deploy
1. Clique no botão "Deploy on Railway" no README
2. Conecte sua conta GitHub
3. Escolha um repositório ou crie um novo
4. Railway fará o deploy automaticamente

### Opção B: Manual
1. Acesse [Railway](https://railway.app)
2. Crie um novo projeto
3. Adicione serviços:
   - PostgreSQL Database
   - Redis Database
   - Backend Service (código Python)
   - Frontend Service (código Angular)

## 2. Configuração GitHub Actions

### Secrets Necessários

No seu repositório GitHub, vá em `Settings > Secrets and variables > Actions` e adicione:

```
RAILWAY_TOKEN=seu-token-do-projeto
RAILWAY_PROJECT_ID=id-do-seu-projeto
```

### Como obter os tokens:

1. **RAILWAY_TOKEN**: 
   - Acesse seu projeto no Railway
   - Vá em Settings > Tokens
   - Gere um novo Project Token

2. **RAILWAY_PROJECT_ID**:
   - Na URL do seu projeto: `railway.app/project/SEU-ID-AQUI`
   - Ou use `railway status` no CLI

## 3. Estrutura de Branches

```
main        ← Production (deploy automático)
develop     ← Staging (deploy automático)
feature/*   ← Development (crie PRs para develop)
```

## 4. Variáveis de Ambiente

### Backend
```bash
DATABASE_URL=postgresql://user:pass@host:port/db
REDIS_URL=redis://host:port
PORT=8000
ENVIRONMENT=production
```

### Frontend
```bash
VITE_API_URL=https://seu-backend.railway.app
PORT=3000
```

## 5. Desenvolvimento Local

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## 6. Ambientes Railway

O template cria automaticamente:

- **Production**: Ambiente principal
- **Staging**: Para testes
- **PR-{número}**: Ambientes temporários para Pull Requests

## 7. Monitoramento

- **Logs**: Railway Dashboard
- **Métricas**: CPU, memória, requests
- **Alertas**: Configure no Railway
- **Health Check**: `/health` endpoint

## 8. Troubleshooting

### Deploy falha
- Verifique os logs no Railway Dashboard
- Confirme se as variáveis estão configuradas
- Teste localmente primeiro

### GitHub Actions falha
- Verifique se os secrets estão corretos
- Confirme o RAILWAY_TOKEN e PROJECT_ID
- Veja os logs na aba Actions

### Banco não conecta
- Verifique se PostgreSQL está rodando
- Confirme a DATABASE_URL
- Teste a conexão no health endpoint

### Frontend não acessa API
- Verifique VITE_API_URL
- Confirme CORS no backend
- Teste as rotas diretamente

## 9. Personalização

### Mudando stack
- Backend: Edite `backend/main.py`
- Frontend: Edite `frontend/src/main.ts`
- Banco: Modifique `railway.toml`

### Adicionando serviços
```toml
[services.novo-servico]
source = "path/to/service"
variables = ["VAR=value"]
```

## 10. Próximos Passos

1. Configure domínio customizado
2. Adicione testes automatizados
3. Configure CI/CD mais robusto
4. Implemente autenticação
5. Adicione monitoramento avançado