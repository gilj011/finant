# 💰 Expense Tracker - Controle de Gastos

Uma aplicação web simples, rápida e otimizada para celular, criada para registrar gastos financeiros em no máximo 2-3 interações.

## 🎯 Características

- **Interface minimalista**: Foco em rapidez e simplicidade
- **Mobile-first**: Otimizado para uso em smartphones
- **Sem login**: Acesso direto e imediato
- **Registro rápido**: Adicione um gasto em segundos
- **Exportação CSV**: Exporte todos os seus gastos para planilha
- **Persistência de dados**: Todos os gastos são salvos em banco de dados SQLite

## 🛠️ Stack Tecnológica

- **Backend**: Node.js + Express.js
- **Banco de dados**: SQLite
- **Frontend**: HTML + CSS + JavaScript puro
- **Sem frameworks pesados**: Máxima simplicidade e performance

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- npm (geralmente vem com Node.js)

## 🚀 Como Rodar Localmente

### 1. Instalar dependências

```bash
npm install
```

### 2. Iniciar o servidor

```bash
npm start
```

### 3. Acessar a aplicação

Abra seu navegador e acesse:
```
http://localhost:3000
```

## 📱 Como Usar

1. **Adicionar gasto**: Clique no botão verde "Adicionar Gasto"
2. **Preencher dados**:
   - Valor do gasto
   - Categoria (Alimentação, Transporte, Lazer, etc.)
   - Data (padrão: hoje)
3. **Salvar**: Clique em "Salvar"
4. **Pronto!**: O formulário limpa automaticamente e o gasto aparece na lista

## 🔌 API Endpoints

### POST /api/expenses
Cria um novo gasto.

**Body:**
```json
{
  "amount": 50.00,
  "category": "Alimentação",
  "date": "2025-12-27"
}
```

**Response:**
```json
{
  "id": 1,
  "amount": 50.00,
  "category": "Alimentação",
  "date": "2025-12-27",
  "message": "Expense saved successfully"
}
```

### GET /api/expenses
Retorna os últimos 20 gastos.

**Response:**
```json
[
  {
    "id": 1,
    "amount": 50.00,
    "category": "Alimentação",
    "date": "2025-12-27",
    "created_at": "2025-12-27 10:00:00"
  }
]
```

### GET /api/expenses/today
Retorna o total gasto no dia atual.

**Response:**
```json
{
  "date": "2025-12-27",
  "total": 150.00
}
```

### GET /api/expenses/export
Exporta todos os gastos em formato CSV.

**Response:**
```csv
ID,Valor,Categoria,Data,Criado em
1,50.00,Alimentação,2025-12-27,2025-12-27 10:00:00
2,35.00,Transporte,2025-12-27,2025-12-27 11:30:00
```

## 📂 Estrutura do Projeto

```
FINAN/
├── public/
│   ├── index.html      # Interface principal
│   ├── style.css       # Estilos (mobile-first)
│   └── app.js          # Lógica do frontend
├── server.js           # Servidor Express + API
├── package.json        # Dependências do projeto
├── expenses.db         # Banco de dados SQLite (criado automaticamente)
└── README.md           # Este arquivo
```

## 🎨 Categorias Disponíveis

- 🍔 Alimentação
- 🚗 Transporte
- 🎮 Lazer
- 💊 Saúde
- 📚 Educação
- 🏠 Moradia
- 📦 Outros

## 🚀 Deployment

Para acessar o app do seu smartphone de qualquer lugar, veja o guia completo de deployment:

📖 **[DEPLOYMENT.md](DEPLOYMENT.md)** - Guia passo a passo para deploy na web

Opções disponíveis:
- **Render** (recomendado) - Mais fácil
- **Railway** - $5 crédito grátis
- **Fly.io** - Armazenamento persistente

## 💡 Melhorias Futuras (Sugestões)

### Curto Prazo
- [x] Exportar dados para CSV/Excel
- [ ] Adicionar PWA (Progressive Web App) para instalação no celular
- [ ] Modo offline com sincronização posterior
- [ ] Filtros por categoria e período

### Médio Prazo
- [ ] Gráficos simples de gastos por categoria
- [ ] Metas mensais de gastos
- [ ] Notificações de gastos excessivos
- [ ] Múltiplos usuários com autenticação simples

### Longo Prazo
- [ ] Sincronização em nuvem
- [ ] App mobile nativo (React Native)
- [ ] Categorias personalizáveis
- [ ] Anexar fotos de recibos
- [ ] Reconhecimento de texto (OCR) para extrair valores de notas fiscais

## 🔒 Segurança

⚠️ **Importante**: Esta aplicação não possui sistema de autenticação. Todos os dados são armazenados localmente no arquivo `expenses.db`. É recomendado para uso pessoal/local apenas.

Para uso em produção, considere:
- Adicionar autenticação de usuários
- Usar HTTPS
- Implementar validação e sanitização de dados mais robusta
- Migrar para um banco de dados mais robusto (PostgreSQL, MySQL)

## 📄 Licença

ISC

## 🤝 Contribuições

Sinta-se livre para sugerir melhorias ou reportar problemas!

---

**Desenvolvido com foco em simplicidade e rapidez** ⚡
