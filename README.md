# Enturma

Enturma é um jogo social mobile-first para festas, bares, shows e eventos. Um único celular passa pela roda; cada participante recebe missões envolvendo pessoas externas ao grupo e avança no seu próprio ritmo.

## O que está incluído

O MVP tem três modos — Social, Ousado e Capetinha Roxo —, de 2 a 12 participantes, dez espaços individuais, três passes com substituição, pulo sem substituição depois dos passes, quatro dificuldades, bônus automáticos, Carta Extra opcional, ranking, histórico individual, encerramento independente, desafios coletivos e resultado final.

O catálogo local contém **110 desafios** em dez categorias: quebra-gelo, investigação social, bar e bebidas, foto e vídeo, redes sociais, flerte, romance, dança e performance, bilhetes e mensagens e missões épicas. Há também **15 desafios coletivos** que podem ser sorteados no painel; o anfitrião marca exatamente quem concluiu e somente essas pessoas recebem os pontos, sem consumir um espaço individual. Os textos evitam pressão, invasão de privacidade e registros sem autorização.

## Stack

React 18, TypeScript, Vite, CSS puro e Lucide React. Não há backend, login, banco remoto, API externa ou variável de ambiente. O estado da partida é serializado no `localStorage` sob a chave `enturma-current-game-v1`.

## Executar localmente

Requisitos: Node.js 18 ou superior e npm.

```bash
npm install
npm run dev
```

Abra o endereço indicado pelo Vite. Para validar produção:

```bash
npm run test
npm run build
npm run preview
```

O build final fica em `dist/` e contém `index.html`. O manifesto e o service worker fazem cache do shell depois do primeiro carregamento; o catálogo e toda a lógica permanecem no bundle local.

## Publicar na Vercel

1. Crie um repositório Git e envie a pasta do projeto.
2. Na Vercel, selecione **Add New Project** e importe o repositório.
3. Use `npm install` como instalação, `npm run build` como build e `dist` como output directory. A Vercel detecta Vite automaticamente, mas o `vercel.json` já contém o rewrite para SPA.
4. Publique. Nenhuma variável de ambiente é necessária.

Também é possível publicar pelo CLI:

```bash
npm i -g vercel
vercel
vercel --prod
```

## Estrutura

```text
src/
  App.tsx
  main.tsx
  styles.css
  data/challenges.ts
  data/groupChallenges.ts
  services/gameEngine.ts
  services/storage.ts
  types/game.ts
tests/gameEngine.test.ts
public/manifest.webmanifest
public/manus-routes.json
public/sw.js
```

## Regras implementadas

Concluir soma os pontos da missão, consome um espaço e sorteia imediatamente a próxima. O primeiro desafio recebe +5; cada sequência de três conclusões sem passe recebe +10; a quinta conclusão recebe +15; a décima recebe +25. Um passe registra a missão no histórico, zera a sequência, não dá pontos e sorteia substituta no mesmo espaço. Depois de três passes, pular registra a missão, consome o espaço e não substitui. A Carta Extra só é desbloqueada com 10 conclusões em 10 espaços, não aceita passe e dá os pontos da carta mais +10; depois de concluída ou recusada, ela é encerrada e não pode pontuar novamente. Um desafio coletivo é sorteado no painel, o anfitrião marca quem concluiu, somente os marcados recebem os pontos e a missão não altera os 10 espaços regulares.

## Checklist manual

- [ ] Abrir Home, entrar em Como jogar e voltar.
- [ ] Criar uma noite com nome, dois participantes e modo Social.
- [ ] Confirmar que cada cartão tem desafio, dificuldade, pontos, progresso e três passes.
- [ ] Concluir um jogador e verificar que o outro não muda.
- [ ] Usar três passes; confirmar que o espaço continua e o histórico registra as trocas.
- [ ] Usar “Pular sem substituir”; confirmar consumo do espaço e ausência de ponto.
- [ ] Atualizar a página; confirmar restauração da noite.
- [ ] Abrir histórico e ranking enquanto a partida segue.
- [ ] Criar modo Ousado e confirmar a presença de desafios diretos.
- [ ] Criar modo Capetinha Roxo e confirmar o modal antes do início.
- [ ] Completar dez missões; sortear ou recusar a Carta Extra.
- [ ] Completar a Carta Extra e tocar novamente para confirmar que ela não pontua duas vezes.
- [ ] No painel, girar um desafio coletivo, marcar apenas parte da roda e verificar que somente as pessoas marcadas recebem pontos.
- [ ] Girar outro desafio coletivo e confirmar que a opção anterior não reaparece até o catálogo coletivo ser percorrido.
- [ ] Encerrar um jogador e depois encerrar a noite inteira.
- [ ] Conferir vencedor, destaques e botões de revanche/nova noite.
- [ ] Testar largura de 320 px e `prefers-reduced-motion`.
- [ ] Confirmar o visual preto, clean, com bordas finas e baixo uso de gradientes.
