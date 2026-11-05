# Enturma — estrutura e publicação na Vercel

## 1. O que enviar

Envie a pasta raiz inteira do projeto `enturma`. Não separe `src`, `public` ou os arquivos de configuração em projetos diferentes.

```text
enturma/
├── package.json
├── package-lock.json
├── index.html
├── vite.config.ts
├── vitest.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vercel.json
├── README.md
├── VERCEL.md
├── public/
│   ├── manifest.webmanifest
│   ├── manus-routes.json
│   └── sw.js
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── styles.css
│   ├── vite-env.d.ts
│   ├── data/
│   │   ├── challenges.ts
│   │   └── groupChallenges.ts
│   ├── services/
│   │   ├── gameEngine.ts
│   │   └── storage.ts
│   └── types/
│       └── game.ts
└── tests/
    └── gameEngine.test.ts
```

Não envie `node_modules`, `dist`, `.git` ou arquivos `.env`. O projeto não precisa de variáveis de ambiente, banco, backend ou chave externa.

## 2. Testar localmente

Abra um terminal na pasta raiz, aquela que contém `package.json`:

```bash
npm install
npm run test
npm run build
npm run dev
```

O endereço local será exibido pelo Vite. Para testar o build de produção localmente:

```bash
npm run preview
```

## 3. Publicar pelo painel da Vercel

1. Crie um repositório no GitHub, GitLab ou Bitbucket.
2. Envie a pasta raiz `enturma` para esse repositório.
3. Na Vercel, selecione **Add New Project**.
4. Importe o repositório.
5. Use estas configurações:

| Campo | Valor |
|---|---|
| Framework Preset | Vite |
| Root Directory | `.` ou vazio |
| Install Command | `npm install` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Environment Variables | nenhuma |

6. Clique em **Deploy**.

O arquivo `vercel.json` já configura o rewrite de SPA para que a aplicação continue funcionando mesmo quando a Vercel receber uma rota direta.

## 4. Publicar pelo terminal

Na raiz do projeto:

```bash
npm install -g vercel
vercel login
vercel
```

Para produção:

```bash
vercel --prod
```

Quando o CLI perguntar pelo diretório do projeto, escolha a pasta atual. Quando perguntar pelo framework, escolha Vite. O comando de build deve ser `npm run build` e o diretório de saída deve ser `dist`.

## 5. Atualizar uma publicação existente

Depois de alterar os arquivos:

```bash
npm run test
npm run build
git add .
git commit -m "atualiza Enturma"
git push
```

A Vercel fará um novo deploy automaticamente se o repositório estiver conectado ao projeto.

## 6. Onde cada funcionalidade fica

- `src/App.tsx`: telas, botões, modais e fluxo visual.
- `src/services/gameEngine.ts`: pontuação, Carta Extra, passes, sorteios e desafios coletivos.
- `src/data/challenges.ts`: 110 desafios individuais.
- `src/data/groupChallenges.ts`: 15 desafios coletivos.
- `src/types/game.ts`: interfaces TypeScript.
- `src/services/storage.ts`: persistência no `localStorage`.
- `src/styles.css`: estética preta e clean inspirada no Vercel.
- `public/sw.js`: cache offline do shell da aplicação.

## 7. Atualização de partidas antigas

Partidas antigas continuam compatíveis porque os campos coletivos são opcionais. Ao abrir uma partida antiga, o jogo inicializa o histórico coletivo vazio quando necessário. Para testar completamente os novos campos, crie uma nova noite depois do deploy.
