

# Controle de Estoque Frontend

## 📋 Sobre o Projeto

Sistema de controle de estoque desenvolvido em **React** com **Vite** e **Bootstrap**, integrado a um backend **Java Spring Boot**.

---

## 🚀 Tecnologias Utilizadas

- [React](https://react.dev/) — biblioteca principal
- [Vite](https://vitejs.dev/) — ferramenta de build
- [Bootstrap](https://getbootstrap.com/) — estilização e responsividade
- [React Router DOM](https://reactrouter.com/) — navegação entre páginas

---

## ✅ Pré-requisitos

Antes de rodar o projeto, você precisa ter instalado:

- [Node.js](https://nodejs.org/) — versão 18 ou superior
- [Git](https://git-scm.com/)
- Backend Java Spring Boot rodando em `http://localhost:8080`

---

## 📦 Como Rodar o Projeto

### 1️⃣ Clone o repositório
```bash
git clone https://github.com/mari-moreira/Controle-de-Estoque-Frontend.git
```

### 2️⃣ Entre na pasta do projeto
```bash
cd Controle-de-Estoque-Frontend
```

### 3️⃣ Instale as dependências
```bash
npm install
```

### 4️⃣ Rode o projeto
```bash
npm run dev
```

### 5️⃣ Acesse no navegador
```
http://localhost:5173
```

---

## 📁 Estrutura de Pastas

```
src/
├── components/       — componentes reutilizáveis (modais, header, footer)
├── pages/            — telas da aplicação
├── services/         — comunicação com a API backend
└── utils/            — funções utilitárias (validações)
```

---

## 🔗 Integração com o Backend

O projeto consome a API REST desenvolvida em Java Spring Boot.

Certifique-se que o backend está rodando antes de iniciar o frontend.

A URL base da API pode ser configurada nos arquivos dentro de `src/services/`.

