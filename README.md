# 🏆 Desafio de Treino

App de placar para desafio de treino entre 4 amigos — **27/07/2026 a 03/12/2026**.

Cada um cria sua conta (apelido + avatar próprio), registra os treinos do dia, e o placar
atualiza automaticamente. As regras de pontuação e o teto diário são aplicadas **no banco de
dados**, então não tem como burlar mexendo no navegador.

## Regras implementadas

1. Máximo de **2 pontos por dia**, por usuário.
2. Musculação ≥ 30min = **1 ponto**. Cardio 30–59min = **1 ponto**. Cardio ≥ 60min = **2 pontos**.
3. Não é possível registrar treino aos **domingos**.
4. Só é possível registrar treinos entre **27/07/2026** e **03/12/2026**.

---

# 📖 Guia completo — do zero até o site no ar

Este guia não pressupõe nenhum conhecimento técnico. Vai levar uns 20-30 minutos na primeira
vez. São 3 partes: **GitHub** (guarda o código), **Supabase** (banco de dados + login) e
**Vercel** (coloca o site no ar). Siga na ordem.

## Parte 1 — Contas que você vai precisar criar

Antes de começar, crie 3 contas (todas grátis):

1. **GitHub** → [github.com/signup](https://github.com/signup)
2. **Supabase** → [supabase.com](https://supabase.com) → clique em "Start your project" e
   entre com a conta do GitHub (mais rápido)
3. **Vercel** → [vercel.com](https://vercel.com) → clique em "Sign Up" e entre com a conta do
   GitHub também

Usando a conta do GitHub para logar no Supabase e no Vercel, você já deixa tudo conectado e
evita ficar preenchendo cadastro em 3 lugares diferentes.

---

## Parte 2 — Colocar o código no GitHub

Você recebeu um arquivo `.zip` deste projeto. Vamos colocá-lo em um repositório no GitHub.

### 2.1) Extrair o arquivo

Extraia o `.zip` em uma pasta no seu computador (ex: `Documentos/gym-challenge`).

### 2.2) Instalar o Git (se ainda não tiver)

O Git é o programa que envia o código pro GitHub.

- **Windows:** baixe em [git-scm.com/download/win](https://git-scm.com/download/win) e instale
  clicando em "Next" em tudo (as opções padrão servem).
- **Mac:** abra o Terminal e digite `git --version` — se não estiver instalado, o próprio
  macOS vai oferecer para instalar.

Para saber se já está instalado, abra o **Terminal** (Mac/Linux) ou **Prompt de
Comando/PowerShell** (Windows) e digite:

```bash
git --version
```

Se aparecer um número de versão, está tudo certo.

### 2.3) Criar o repositório vazio no GitHub

1. Acesse [github.com/new](https://github.com/new).
2. Em "Repository name", coloque `gym-challenge` (ou o nome que preferir).
3. Deixe marcado como **Private** (só quem você convidar acessa o código) ou **Public**, como
   preferir — não faz diferença pro funcionamento.
4. **Não marque** nenhuma das caixinhas "Add a README", "Add .gitignore" ou "Choose a license"
   — o projeto já vem com esses arquivos.
5. Clique em **Create repository**.
6. O GitHub vai te mostrar uma página com alguns comandos. Copie a URL que aparece, algo como
   `https://github.com/SEU-USUARIO/gym-challenge.git`.

### 2.4) Enviar o código pro GitHub

Abra o Terminal/Prompt de Comando, navegue até a pasta que você extraiu e rode, um comando de
cada vez:

```bash
cd Documentos/gym-challenge
git remote add origin https://github.com/SEU-USUARIO/gym-challenge.git
git branch -M main
git push -u origin main
```

> Troque `SEU-USUARIO` pelo seu usuário real do GitHub, e ajuste o `cd` pro caminho onde você
> extraiu a pasta. Na primeira vez, o Git pode abrir uma janela pedindo para você logar no
> GitHub pelo navegador — é só autorizar.

Depois do `git push`, atualize a página do repositório no GitHub — os arquivos devem aparecer
lá.

---

## Parte 3 — Configurar o Supabase (banco de dados + login)

### 3.1) Criar o projeto

1. Em [supabase.com/dashboard](https://supabase.com/dashboard), clique em **New project**.
2. Escolha uma organização (se for a primeira vez, o Supabase cria uma pra você automaticamente).
3. Preencha:
   - **Name**: `desafio-treino` (ou o nome que quiser)
   - **Database Password**: crie uma senha forte e **guarde ela em um lugar seguro** (não vai
     precisar dela no dia a dia, mas é bom ter salva)
   - **Region**: escolha a mais próxima do Brasil, ex: `South America (São Paulo)`
4. Clique em **Create new project** e aguarde ~2 minutos enquanto o Supabase prepara tudo.

### 3.2) Rodar o script que cria as tabelas e as regras

1. No menu à esquerda, clique no ícone de banco de dados **SQL Editor**.
2. Clique em **New query**.
3. No repositório do GitHub (ou na pasta que você extraiu), abra o arquivo
   `supabase/schema.sql`, selecione todo o conteúdo e copie.
4. Cole no editor SQL do Supabase.
5. Clique no botão **Run** (ou aperte Ctrl+Enter / Cmd+Enter).
6. Deve aparecer "Success. No rows returned" — isso significa que as tabelas, as regras de
   pontuação e o placar foram criados com sucesso.

### 3.3) Desativar a confirmação por e-mail

Isso é recomendado para que, ao se cadastrar, o amigo já consiga entrar direto — sem precisar
clicar em um link de confirmação no e-mail.

1. No menu à esquerda, clique em **Authentication**.
2. Clique em **Providers** (ou "Sign In / Providers", dependendo da versão da tela).
3. Clique em **Email**.
4. Desative a opção **"Confirm email"**.
5. Clique em **Save**.

> Se preferir deixar essa confirmação ativada (mais seguro), pode deixar — só avise os 4
> amigos que, depois de se cadastrar, eles vão receber um e-mail e precisam clicar no link
> antes de conseguir entrar.

### 3.4) Copiar as chaves de acesso (vai usar no Vercel daqui a pouco)

1. No menu à esquerda, clique na engrenagem **Project Settings**.
2. Clique em **API**.
3. Você vai ver dois campos importantes — deixe essa aba aberta ou copie os dois valores para
   um bloco de notas:
   - **Project URL** — algo como `https://abcdefgh.supabase.co`
   - **anon public** (dentro de "Project API keys") — uma chave longa de letras e números

---

## Parte 4 — Colocar o site no ar com o Vercel

### 4.1) Importar o projeto

1. Acesse [vercel.com/new](https://vercel.com/new).
2. Na lista de repositórios do GitHub, encontre `gym-challenge` e clique em **Import**.
   - Se não aparecer na lista, clique em "Adjust GitHub App Permissions" e autorize o Vercel a
     ver esse repositório.

### 4.2) Configurar as variáveis de ambiente

Antes de clicar em "Deploy", abra a seção **Environment Variables** na mesma tela e adicione
duas linhas, usando os valores que você copiou do Supabase no passo 3.4:

| Name (Nome)                     | Value (Valor)                                  |
|----------------------------------|-------------------------------------------------|
| `NEXT_PUBLIC_SUPABASE_URL`       | a Project URL (ex: `https://abcdefgh.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`  | a chave "anon public"                            |

Para cada uma: digite o nome no campo "Name", cole o valor no campo "Value", e clique em
**Add** antes de passar pra próxima.

### 4.3) Publicar

1. Clique no botão azul **Deploy**.
2. Aguarde cerca de 1 minuto — o Vercel vai instalar as dependências e publicar o site.
3. Quando terminar, aparecerá uma tela com confetes e um botão **Continue to Dashboard** (ou
   uma prévia do site). Clique em **Visit** para abrir o site publicado.
4. A URL será algo como `https://gym-challenge-seu-usuario.vercel.app` — essa é a URL que você
   vai compartilhar com os 4 amigos.

### 4.4) Testar

1. Acesse a URL do site.
2. Clique em **Cadastre-se**.
3. Preencha apelido, e-mail, senha e escolha um avatar na galeria.
4. Clique em **Criar conta** — você deve cair direto no painel principal.
5. Registre um treino de teste e veja se ele aparece no placar.

Se tudo funcionou, é só compartilhar a URL com os outros 3 amigos — cada um cria a própria
conta pelo mesmo link.

---

## Atualizando o site no futuro

Qualquer alteração no código que for enviada ao GitHub (`git push` na branch `main`) publica
uma nova versão automaticamente no Vercel, sem precisar repetir nenhum passo de configuração.

---

## 🆘 Problemas comuns

**"E-mail ou senha inválidos" mesmo com os dados certos**
Confira se as variáveis de ambiente no Vercel (`NEXT_PUBLIC_SUPABASE_URL` e
`NEXT_PUBLIC_SUPABASE_ANON_KEY`) foram coladas corretamente, sem espaços extras no início ou
fim. Depois de corrigir, vá em Vercel → seu projeto → **Deployments** → nos três pontinhos do
último deploy → **Redeploy**.

**"Esse apelido já está em uso"**
Cada apelido só pode ser usado por uma pessoa. Peça pra escolher outro.

**Erro ao tentar registrar treino de domingo, ou fora do período do desafio**
Isso é esperado — é a regra 3 e 4 funcionando corretamente, direto no banco de dados.

**Quero mudar as datas do desafio ou as regras de pontuação**
Edite o arquivo `supabase/schema.sql` (as constraints `sem_domingo` e `dentro_do_desafio`, e a
função `calcular_pontos_treino`), rode o trecho alterado novamente no SQL Editor do Supabase, e
atualize também as constantes em `types/database.ts` no código.

---

## Rodando localmente (opcional, só se quiser mexer no código no seu computador)

Isso exige ter o [Node.js](https://nodejs.org) instalado (versão 18 ou mais recente).

```bash
npm install
cp .env.local.example .env.local
# edite o arquivo .env.local com as chaves do Supabase (passo 3.4)
npm run dev
```

Acesse `http://localhost:3000` no navegador.

---

## Estrutura do projeto

```
app/
  login/            → tela de login
  signup/            → tela de cadastro (apelido + avatar)
  dashboard/          → tela principal: registrar treino + placar
  auth/actions.ts     → server actions de login/cadastro/logout
lib/supabase/         → clientes Supabase (browser, server, middleware)
components/
  AvatarPicker.tsx    → galeria de avatares (gerados via DiceBear, escolha livre)
  WorkoutForm.tsx     → formulário de registro de treino
  Leaderboard.tsx     → placar de líderes
supabase/schema.sql   → schema completo: tabelas, regras, RLS, placar
types/database.ts     → tipos TS + datas oficiais do desafio
```

## Como o avatar funciona

Não precisa fazer upload de imagem: cada usuário digita uma palavra (o próprio nome, por
exemplo) e escolhe entre 8 estilos de avatar gerados na hora (via [DiceBear](https://dicebear.com)).
É só clicar no que mais gostar — fica salvo como uma URL de imagem no perfil.

## Segurança

- As regras de pontos (limite diário, cálculo de pontos, domingo, período do desafio) estão
  no banco, não só na tela — mesmo que alguém edite o HTML no navegador, o Postgres recusa o
  registro inválido.
- Row Level Security (RLS) garante que cada usuário só cria/edita/apaga os próprios treinos,
  mas todos podem ver o placar geral.
