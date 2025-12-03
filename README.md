# TrackBalance

**🚀 Demo Online:** [https://trackbalance123.netlify.app](https://trackbalance123.netlify.app)

Uma aplicação web para controle de finanças pessoais desenvolvida como projeto de aprendizado e portfólio.

## 📸 Capturas de Tela

| Desktop Home | Desktop Login | Desktop Otp |
|-----------------------|--------------------------|--------------------|
| [![Screenshot Desktop Home](./screenshots/desktop1.png)](./screenshots/desktop1.png) | [![Screenshot Desktop Login](./screenshots/desktop2.png)](./screenshots/desktop2.png) | [![Screenshot Desktop Otp](./screenshots/desktop3.png)](./screenshots/desktop3.png)

| Desktop Dashboard Cima| Desktop Dashboard Baixo |
|-----------------------|--------------------------|
| [![Screenshot Desktop Dashboard Cima](./screenshots/desktop4.png)](./screenshots/desktop4.png) | [![Screenshot Desktop Dashboard Baixo](./screenshots/desktop5.png)](./screenshots/desktop5.png) |

| Desktop Sidebar| Desktop Modal |
|-----------------------|--------------------------|
| [![Screenshot Desktop Sidebar](./screenshots/desktop6.png)](./screenshots/desktop6.png) | [![Screenshot Desktop Modal](./screenshots/desktop7.png)](./screenshots/desktop7.png) |


| Mobile Dashboard Cima  | Mobile Dashboard Baixo | Mobile Home |
|-----------------------|--------------------------|-----------------
| [![Screenshot Mobile Dashboard Cima](./screenshots/mobile2.png)](./screenshots/mobile2.png) | [![Screenshot Mobile Dashboard Baixo](./screenshots/mobile3.png)](./screenshots/mobile3.png) | [![Screenshot Mobile Home](./screenshots/mobile1.png)](./screenshots/mobile1.png) |

| Mobile Sidebar  | Mobile Modal |
|-----------------------|--------------------------|
| [![Screenshot Mobile Sidebar](./screenshots/mobile4.png)](./screenshots/mobile4.png) | [![Screenshot Mobile Modal](./screenshots/mobile5.png)](./screenshots/mobile5.png) |


## ✨ Funcionalidades

- **Gestão de Receitas**: Inserir, atualizar e deletar receita mensal (uma única receita por mês)
- **Gestão de Despesas**: Inserir, atualizar e deletar múltiplas despesas (categorias únicas por mês)
- **Navegação entre Meses**: Acessar e manipular dados de meses anteriores e futuros (dentro dos limites estabelecidos)
- **Exportação de Dados**: Exportar dados do mês atual para CSV e PDF
- **Dashboard Resumido**: Visualização rápida do saldo e despesas recentes
- **Exclusão de Conta**: Remoção completa dos dados do usuário
- **Gestão dos Meses**:
  - Não cria meses desnecessários (apenas cria quando há dados reais)
  - Detecta "meses vazios" no histórico e oferece preenchimento automático
  - Sempre garante que o mês atual existe, copiando dados do último mês válido
  - Cria meses intermediários automaticamente durante a navegação nos meses (caso queira navegar para um mês que não existe)

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React + Vite
- **Backend**: Supabase (Banco de dados e autenticação OTP)
- **Roteamento**: React Router
- **Gráficos**: Recharts
- **Exportação PDF**: jsPDF + AutoTables
- **Estilização**: CSS

## ♿ Acessibilidade

Desenvolvi este projeto com grande foco em acessibilidade:

### 🎯 Porque "Reinventar a Roda"?
Embora este projeto seja para portfólio, ele é também (até mais) de aprendizado. Como tal, queria aprender a criar componentes "substitutos" aos elementos nativos e acima de tudo aprender a deixar-los acessíveis.

### 📚 Base Técnica e Referências
Em todos os componentes customizados, segui como referência principal o [WAI-ARIA Authoring Practices Guide (APG)](https://www.w3.org/WAI/ARIA/apg/) - o guia oficial para implementação de componentes acessíveis. Em alguns componentes adaptei para a minha situação (alguns ajustes em timeout, para gerenciar melhor o foco e o comportamento do leitor de tela), mas o "grosso", leia-se atributos aria, focus trap e tudo o resto segui os padrões recomendados.

### 🎯 Componentes Customizados
- **Modal Context** - substitui alertas/confirms nativos
- **CustomSelect** - acessível com focus trap, type-ahead e anuncios
- **NumberInput** - mantive o input type number nativo, adicionei botões + e -, escondi e desativei o spinner
- **FormModal** - modal genérico para formulários

### 🔧 Hooks  
- **useAriaActionStatusAnnouncer** - gerencia live regions para feedback em tempo real
- **useFormFieldValidation** - validações customizadas com feedback acessível

### 🧪 Testes de Acessibilidade

#### 🔍 Manuais
- Navegação completa via teclado (todas as funcionalidades)
- Teste com leitor de tela Orca + navegador Firefox (Linux)
- Navegação por landmarks e headings
- Teste de focus trap em modais
- Validação de contrastes de cor

#### ⚙️ Ferramentas de Teste
- Lighthouse
- WAVE Evaluation Tool
- IBM Equal Access Accessibility Checker
- Ferramenta nativa de Acessibilidade do Firefox

#### 🐛 O que não está funcionando *(possível erro nas minhas implementações...)*

**Contexto:**  
A barra de ações do usuário (inserir receita, despesas etc.) antes fechava automaticamente ao abrir algum modal.

**O problema:**  
Quando o **primeiro elemento focado no modal era um `input`**:
1. ✅ Ao abrir: Leitor anunciava "Recolhido" → título do modal → label do input
2. ✅ Ao fechar: Foco voltava ao botão de Menu, leitor lia "Recolhido"
3. ❌ **Bug:** Ao pressionar o botão para abrir a barra, o leitor **não anunciava "Expandido"**

**Observações:**  
1. Isso **não acontecia** quando o primeiro elemento era um `select` (como meu componente customizado)
2. ***Acontecia apenas no deploy - em desenvolvimento local tudo funcionava perfeitamente***.

**Minha solução:**  
Após várias tentativas sem sucesso, optei por:
- A barra agora só fecha quando o usuário clica explicitamente no botão de Menu
- Não fecha mais automaticamente ao abrir modais

**Honestamente:**  
Não sei se é um comportamento específico do leitor de tela (Orca + Firefox) ou se fiz algo errado no código (mais provável né...!!! 😅). Mas com essa mudança, tudo funciona corretamente! ✅

## 🗄️ Estrutura do Banco de Dados

- **months**: Controle de meses por usuário
- **incomes**: Receitas mensais (uma por mês)
- **expenses**: Despesas mensais (categorias únicas)
- **user_flags**: Controle de navegação entre meses - enquanto flags forem null, quer dizer que o usuario não colocou dados uteis (receita e ou despesas). Não cria registro de mês.

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

### 📝 Notas Importantes
- A autenticação é por OTP (código enviado para o email)
- Usei o mesmo template de email para  "Confirm Signup" e "Magic Link", caso contrário, no segundo login, o Supabase envia Magic Link ao invés de código
- Como iniciante, configurei a Edge Function (e basicamente tudo) pelo dashboard do Supabase, sem usar supabase-cli ou outro método
- Todos os testes de acessibilidade foram feitos no Firefox (Linux) + Orca apenas. Não garanto nada em outra combinação de sistema/navegador/leitor.
