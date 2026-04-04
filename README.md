# TrackBalance

Aplicação completa de finanças pessoais com autenticação, persistência de dados e foco avançado em acessibilidade (WCAG).

🔗 **Demo:** https://trackbalance123.netlify.app

---

## 🚀 Principais Destaques

* Autenticação via OTP com Supabase
* Persistência de dados e exclusão completa de conta
* Dashboard financeiro com receitas, despesas e saldo
* Exportação de dados (CSV e PDF)
* Navegação inteligente entre meses

---

## 🛠️ Tecnologias

* React + Vite
* Supabase (database + autenticação)
* React Router
* Recharts
* jsPDF + AutoTables
* CSS

---

## ♿ Acessibilidade (Diferencial do Projeto)

Este projeto foi desenvolvido com foco prático em acessibilidade, seguindo diretrizes WCAG e padrões WAI-ARIA.

### ✔️ Implementado

* Navegação completa por teclado
* Gerenciamento de foco (incluindo focus trap em modais)
* Uso de ARIA (aria-live, estados, roles)
* Testes com leitor de tela (Orca + Firefox)
* HTML semântico e landmarks

### 🧩 Componentes customizados

* Modal acessível (substituindo alert/confirm)
* Select com typeahead
* Input numérico com controles customizados
* Sistema de feedback com aria-live

---

## 🧪 Testes de Acessibilidade

### 🔍 Manuais

* Navegação completa por teclado
* Testes com leitor de tela (Orca + Firefox)
* Verificação de foco e landmarks

### ⚙️ Ferramentas

* Lighthouse
* WAVE
* IBM Equal Access
* Firefox Accessibility Tools

---

## ⚠️ Observação Técnica

Durante o desenvolvimento, identifiquei um comportamento inconsente ao abrir modais com foco inicial em inputs utilizando leitor de tela (Orca + Firefox).

Ao fechar o modal, o foco retornava corretamente ao botão de menu, porém o leitor de tela não anunciava a mudança de estado ("expandido") ao reabrir a interface.

Após investigação, optei por ajustar o fluxo da interface para evitar fechamento automático da barra de ações ao abrir modais, garantindo consistência na navegação e feedback ao usuário.

---

## 📸 Preview

| Desktop Home | Desktop Login |
|-----------------------|--------------------------|
| [![Screenshot Desktop Home](./screenshots/desktop1.png)](./screenshots/desktop1.png) | [![Screenshot Desktop Login](./screenshots/desktop2.png)](./screenshots/desktop2.png)

| Desktop Dashboard Cima| Desktop Dashboard Baixo |
|-----------------------|--------------------------|
| [![Screenshot Desktop Dashboard Cima](./screenshots/desktop4.png)](./screenshots/desktop4.png) | [![Screenshot Desktop Dashboard Baixo](./screenshots/desktop5.png)](./screenshots/desktop5.png) |

---

## 🚀 Como Executar

### Pré-requisitos
- Node.js instalado
- Conta no [Supabase](https://supabase.com)

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/pedrobfernandes/trackbalance.git
cd trackbalance
```
2. Instale as dependências:
```bash
npm install
```
3. Configure as variáveis de ambiente:
- Crie um arquivo .env na raíz do projeto
- Adicione as suas credencias do Supabase:
```bash
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anon_publica
VITE_SUPABASE_DELETE_ACCOUNT_URL=url_da_edge_function_para_excluir_conta
```
4. Configure o banco de dados
- Crie um projeto no Supabase
- Execute o script que está na pasta `database/setup.sql` no editor SQL do projeto
- Crie uma Edge Function com o nome: `delete-user-account`
- Configure a Edge Function `delete-user-account` usando o arquivo da pasta `database/delete-user-account/index.ts`
- No dashboard do Supabase, procure pelos templates de Email, e use o template da pasta `email-template` para "Confirm sign up" e "Magic link"
5. Execute a aplicação
```bash
npm run dev
```

---

## 🧠 Decisão de Implementação

Este projeto prioriza aprendizado prático, incluindo a implementação manual de componentes acessíveis ao invés do uso de bibliotecas prontas, com base no WAI-ARIA Authoring Practices.
