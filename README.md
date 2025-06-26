# 🚀 Railway Full Stack Template

Template completo para projetos full-stack com deploy automático via GitHub Actions.

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template/OdgEf7)

## ✨ Funcionalidades

- 🔄 **Deploy Automático** via GitHub Actions
- 🌍 **Multi-ambiente** (Production, Staging, PR environments)
- 🗄️ **PostgreSQL** + **Redis** pré-configurados
- ⚡ **Backend** (FastAPI/Python) 
- 🎨 **Frontend** (Angular/TypeScript)
- 📊 **Monitoramento** e logs integrados

## 🏗️ Arquitetura

```
railway-template-fullstack/
├── .github/workflows/       # GitHub Actions
│   └── railway-deploy.yml   # Deploy automático
├── backend/                 # API/Servidor
│   ├── Dockerfile          # Container backend
│   ├── main.py             # Aplicação FastAPI
│   └── requirements.txt    # Dependências Python
├── frontend/               # Interface
│   ├── angular.json        # Configuração Angular
│   ├── package.json        # Dependências Node
│   └── src/               # Código fonte
├── docs/                   # Documentação
├── railway.toml           # Configuração Railway
├── .env.example          # Variáveis de ambiente
└── README.md             # Este arquivo
```

## 🚀 Início Rápido

### 1. Deploy One-Click

1. Clique no botão "Deploy on Railway" acima
2. Conecte seu repositório GitHub
3. Configure os secrets (veja abaixo)
4. Push para `main` → Deploy automático!

### 2. Configuração Local

```bash
# Clone o template
git clone <seu-repositorio>
cd <seu-projeto>

# Configure variáveis
cp .env.example .env
# Edite o .env com suas configurações

# Backend
cd backend
pip install -r requirements.txt
python main.py

# Frontend
cd frontend
npm install
npm start
```

## ⚙️ Configuração GitHub Actions

### Secrets Necessários

Configure em `Settings > Secrets and variables > Actions`:

```bash
RAILWAY_TOKEN=seu-token-de-projeto-railway
RAILWAY_PROJECT_ID=id-do-seu-projeto-railway
```

### Ambientes Automáticos

- **Production**: Deploy no push para `main`
- **Staging**: Deploy no push para `develop`
- **PR Environment**: Deploy temporário para cada PR

## 🔧 Serviços Inclusos

### Backend (FastAPI)
- **Porta**: 8000
- **Variáveis**: `DATABASE_URL`, `REDIS_URL`, `PORT`
- **Features**: API REST, autenticação, cache Redis

### Frontend (Angular)
- **Porta**: 3000
- **Variáveis**: `VITE_API_URL`, `PORT`
- **Features**: SPA, roteamento, integração com API

### Banco de Dados
- **PostgreSQL**: Banco principal
- **Redis**: Cache e sessões
- **Backups**: Automáticos via Railway

## 🔄 Workflow de Desenvolvimento

```bash
# 1. Desenvolvimento
git checkout -b feature/nova-funcionalidade
# ... desenvolva ...
git push origin feature/nova-funcionalidade

# 2. Staging
git checkout develop
git merge feature/nova-funcionalidade
git push origin develop  # → Deploy automático staging

# 3. Production
git checkout main
git merge develop
git push origin main     # → Deploy automático production
```

## 📊 Monitoramento

- **Logs**: Railway Dashboard
- **Métricas**: CPU, memória, rede
- **Alertas**: Falhas de deploy
- **Status**: GitHub Actions badges

## 🛡️ Segurança

- Variáveis de ambiente seguras
- Secrets do GitHub protegidos
- HTTPS/TLS automático
- Isolamento por ambiente

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja [LICENSE](LICENSE) para mais detalhes.

---

**Feito com ❤️ para a comunidade Railway**