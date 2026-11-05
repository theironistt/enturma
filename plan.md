# Plano de implementação — Enturma

## Escopo
MVP web mobile-first, sem login, backend, banco remoto ou API externa. Um único celular conduz a noite; o estado da partida fica no `localStorage` e o catálogo é compilado localmente.

## Direção visual

### Alternativas consideradas
- **Noite editorial neon** (0,07): tipografia grande, roxo elétrico e cartões com ritmo de revista.
- **Arcade social sofisticado** (0,06): interface escura, badges compactos, brilho discreto e ações de uma mão.
- **Clube minimalista** (0,05): superfícies pretas, tipografia silenciosa e foco quase total no cartão ativo.

### Escolha: Arcade social sofisticado
- **Movimento:** arcade contemporâneo para adultos, com energia de festa sem estética infantil.
- **Princípios:** uma ação principal por tela; leitura rápida em ambiente escuro; feedback de pontuação curto; informação progressiva.
- **Cores:** preto azulado e grafite criam concentração; roxo é a assinatura do jogo; amarelo marca recompensa; verde confirma; rosa aparece apenas em romance e flerte.
- **Layout:** coluna única com cabeçalho compacto, cartões independentes e uma barra inferior de ação; ranking e histórico entram como camadas simples, não como painel administrativo.
- **Elementos de assinatura:** wordmark “Enturma” com ponto de brilho, pílulas de dificuldade e uma faixa vertical colorida por jogador.
- **Interação:** cada toque produz uma mudança clara; passes deslizam conceitualmente pela troca da carta; conclusão mantém o jogador no fluxo e sorteia imediatamente o próximo espaço.
- **Animação:** entrada suave das cartas, contador de pontos com transição curta, brilho roxo reduzido para Carta Extra e respeito a `prefers-reduced-motion`.
- **Tipografia:** sistema `Inter`, `ui-sans-serif`, com títulos fortes, números tabulares e corpo confortável em telas de 320 px.
- **Essência:** “uma missão social para movimentar a noite, sem tirar o celular da roda”; direto, cúmplice e vibrante.
- **Voz:** CTAs curtos e encorajadores. Exemplos: “Puxa a próxima missão.” e “A noite ainda está começando.”
- **Wordmark:** “Enturma” em peso 800 com um ponto roxo entre a ideia de grupo e movimento.
- **Cor proprietária:** `#8B5CF6`, usada como trilha de progresso, foco e assinatura.

## Arquitetura
- `src/types/game.ts`: interfaces e uniões do domínio.
- `src/data/challenges.ts`: catálogo local de 110 desafios em 10 categorias.
- `src/services/gameEngine.ts`: sorteio, pontuação, passes, espaços, Carta Extra, ranking e transições.
- `src/services/storage.ts`: serialização defensiva e restauração via `localStorage`.
- `src/App.tsx`: telas do fluxo e modais; componentes pequenos ficam no próprio arquivo para manter o MVP simples.
- `src/styles.css`: sistema visual responsivo, acessível e sem Tailwind.
- `tests/gameEngine.test.ts`: regras críticas do motor.

## Fluxo
Home → Como jogar / Criar partida → confirmação do Capetinha Roxo → painel da noite → detalhe do jogador → concluir, passar ou pular → Carta Extra → ranking/histórico → encerramento.

## Build e publicação
Vite gera `dist`; `vercel.json` faz fallback de SPA. `npm run build` é o comando de verificação. O projeto também inclui manifesto e service worker simples para cache do shell depois do primeiro carregamento.
