import { beforeEach, describe, expect, it } from 'vitest';
import { completeActiveChallenge, completeExtraCard, completeGroupChallenge, createGame, declineExtraCard, drawExtraCard, drawGroupChallenge, finishNight, getRanking, skipActiveChallenge, toggleGroupChallengePlayer, usePass } from '../src/services/gameEngine';
import { clearSavedGame, loadGame, saveGame } from '../src/services/storage';
import type { Game, PlayerDraft } from '../src/types/game';

const drafts: PlayerDraft[] = [{ name: 'Ana', color: '#8B5CF6' }, { name: 'Bia', color: '#F43F7B' }];
const fixedRandom = () => 0;

function fresh(mode: Game['mode'] = 'capetinha-roxo'): Game {
  return createGame('Teste', mode, drafts, fixedRandom);
}

function completeTen(game: Game, playerId: string): Game {
  let current = game;
  for (let index = 0; index < 10; index += 1) current = completeActiveChallenge(current, playerId);
  return current;
}

describe('motor do Enturma', () => {
  beforeEach(() => clearSavedGame());

  it('concluir um desafio concede pontos e consome um espaço', () => {
    const game = fresh('social');
    const player = game.players[0];
    const points = player.activeChallenge!.points;
    const next = completeActiveChallenge(game, player.id).players[0];
    expect(next.score).toBe(points + 5);
    expect(next.completedChallenges).toBe(1);
    expect(next.usedSlots).toBe(1);
    expect(next.history[0].status).toBe('completed');
  });

  it('usar um dos três passes não consome espaço nem concede pontos', () => {
    const game = fresh();
    const player = game.players[0];
    const oldId = player.activeChallenge!.id;
    const next = usePass(game, player.id).players[0];
    expect(next.passesRemaining).toBe(2);
    expect(next.usedSlots).toBe(0);
    expect(next.score).toBe(0);
    expect(next.activeChallenge?.id).not.toBe(oldId);
    expect(next.history[0].status).toBe('passed');
  });

  it('depois de acabar os passes, pular consome espaço e não dá substituto', () => {
    let game = fresh();
    const id = game.players[0].id;
    game = usePass(game, id);
    game = usePass(game, id);
    game = usePass(game, id);
    const before = game.players[0].activeChallenge;
    game = skipActiveChallenge(game, id);
    const player = game.players[0];
    expect(before).not.toBeNull();
    expect(player.usedSlots).toBe(1);
    expect(player.completedChallenges).toBe(0);
    expect(player.history.at(-1)?.status).toBe('skipped');
    expect(player.activeChallenge?.id).not.toBe(before?.id);
  });

  it('um jogador avança de forma independente e finaliza ao usar os 10 espaços', () => {
    const game = fresh();
    const first = game.players[0];
    const second = game.players[1];
    const afterOne = completeActiveChallenge(game, first.id);
    expect(afterOne.players[0].usedSlots).toBe(1);
    expect(afterOne.players[1].usedSlots).toBe(0);
    let current = afterOne;
    for (let index = 0; index < 9; index += 1) current = completeActiveChallenge(current, first.id);
    expect(current.players[0].usedSlots).toBe(10);
    expect(current.players[0].status).toBe('playing');
    expect(current.players[1].status).toBe('playing');
    expect(current.players[0].extraCardUnlocked).toBe(true);
    current = declineExtraCard(current, first.id);
    expect(current.players[0].status).toBe('finished');
    expect(current.players[1].status).toBe('playing');
    expect(second.id).not.toBe(first.id);
  });

  it('jogador com espaço pulado não desbloqueia Carta Extra', () => {
    let game = fresh();
    const id = game.players[0].id;
    game = usePass(game, id); game = usePass(game, id); game = usePass(game, id);
    game = skipActiveChallenge(game, id);
    for (let index = 0; index < 9; index += 1) {
      if (game.players[0].activeChallenge) game = completeActiveChallenge(game, id);
    }
    expect(game.players[0].usedSlots).toBe(10);
    expect(game.players[0].completedChallenges).toBe(9);
    expect(game.players[0].extraCardUnlocked).toBe(false);
    expect(game.players[0].status).toBe('finished');
  });

  it('Carta Extra não permite passe e concede pontos mais bônus ao concluir', () => {
    let game = fresh();
    const actualId = game.players[0].id;
    game = completeTen(game, actualId);
    game = drawExtraCard(game, actualId, fixedRandom);
    const before = game.players[0].score;
    const extraPoints = game.players[0].extraCardChallenge!.points + 10;
    game = completeExtraCard(game, actualId);
    expect(game.players[0].score).toBe(before + extraPoints);
    expect(game.players[0].history.at(-1)?.status).toBe('extra-completed');
    expect(game.players[0].status).toBe('finished');
    const scoreAfterFirstCompletion = game.players[0].score;
    game = completeExtraCard(game, actualId);
    expect(game.players[0].score).toBe(scoreAfterFirstCompletion);
  });

  it('recusar uma Carta Extra já sorteada finaliza o jogador e limpa a carta', () => {
    let game = fresh();
    const id = game.players[0].id;
    game = completeTen(game, id);
    game = drawExtraCard(game, id, fixedRandom);
    game = declineExtraCard(game, id);
    expect(game.players[0].status).toBe('finished');
    expect(game.players[0].extraCardChallenge).toBeNull();
    expect(game.players[0].history.at(-1)?.status).toBe('extra-declined');
    game = declineExtraCard(game, id);
    expect(game.players[0].history.filter((item) => item.status === 'extra-declined')).toHaveLength(1);
  });

  it('desafio coletivo sorteia uma missão e pontua todos uma única vez', () => {
    let game = fresh('social');
    const before = game.players.map((player) => player.score);
    game = drawGroupChallenge(game, fixedRandom);
    expect(game.activeGroupChallenge).toBeTruthy();
    const points = game.activeGroupChallenge!.points;
    game = toggleGroupChallengePlayer(game, game.players[0].id);
    game = completeGroupChallenge(game);
    expect(game.activeGroupChallenge).toBeNull();
    expect(game.players[0].score).toBe(before[0] + points);
    expect(game.players[1].score).toBe(before[1]);
    expect(game.players[0].history.at(-1)?.status).toBe('group-completed');
    expect(game.players[1].history.at(-1)?.status).not.toBe('group-completed');
    expect(game.groupChallengeHistory).toHaveLength(1);
    game = completeGroupChallenge(game);
    expect(game.groupChallengeHistory).toHaveLength(1);
  });

  it('ranking ordena por pontos, concluídos, espaços pulados e cadastro', () => {
    let game = fresh('social');
    const [a, b] = game.players;
    game = completeActiveChallenge(game, a.id);
    game = completeActiveChallenge(game, a.id);
    game = completeActiveChallenge(game, b.id);
    const ranking = getRanking(game);
    expect(ranking[0].id).toBe(a.id);
    expect(ranking[1].id).toBe(b.id);
  });

  it('não aplica o mesmo bônus duas vezes e restaura via localStorage', () => {
    let game = fresh('social');
    game = completeActiveChallenge(game, game.players[0].id);
    const once = game.players[0].history.filter((item) => item.status === 'bonus' && item.label === 'Primeiro desafio concluído').length;
    game = completeActiveChallenge(game, game.players[0].id);
    const twice = game.players[0].history.filter((item) => item.status === 'bonus' && item.label === 'Primeiro desafio concluído').length;
    expect(once).toBe(1);
    expect(twice).toBe(1);
    saveGame(game);
    expect(loadGame()?.id).toBe(game.id);
    expect(loadGame()?.players[0].score).toBe(game.players[0].score);
  });

  it('encerrar a noite finaliza todos os jogadores', () => {
    const game = finishNight(fresh());
    expect(game.status).toBe('finished');
    expect(game.finishedAt).toBeTruthy();
    expect(game.players.every((player) => player.status === 'finished')).toBe(true);
  });
});
