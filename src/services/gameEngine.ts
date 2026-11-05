import { challenges } from '../data/challenges';
import { groupChallenges } from '../data/groupChallenges';
import type { Challenge, Difficulty, Game, GameMode, Player, PlayerDraft, RankingEntry } from '../types/game';

const POINTS: Record<Difficulty, number> = { facil: 10, media: 20, ousada: 30, epica: 50 };
const now = () => new Date().toISOString();
const uid = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function historyIds(player: Player): Set<string> {
  return new Set(player.history.map((item) => item.challenge?.id).filter(Boolean) as string[]);
}

function eligibleForSlot(challenge: Challenge, game: Game, player: Player): boolean {
  if (!challenge.active || !challenge.modes.includes(game.mode)) return false;
  if (historyIds(player).has(challenge.id)) return false;
  if (player.activeChallenge?.id === challenge.id) return false;
  if (player.usedSlots < 4 && challenge.difficulty === 'epica') return false;
  return true;
}

function weightedCandidates(game: Game, player: Player): Challenge[] {
  const base = challenges.filter((challenge) => eligibleForSlot(challenge, game, player));
  if (!base.length) return challenges.filter((challenge) => challenge.active && challenge.modes.includes(game.mode));

  const recent = player.history.slice(-3).map((item) => item.challenge?.category).filter(Boolean);
  const recentDifficulties = player.history.slice(-3).map((item) => item.challenge?.difficulty).filter(Boolean);
  let candidates = base.filter((challenge) => !recent.includes(challenge.category));
  if (!candidates.length) candidates = base;

  const withoutDifficultyStreak = candidates.filter((challenge) => {
    const lastTwo = recentDifficulties.slice(-2);
    return !(lastTwo.length === 2 && lastTwo[0] === lastTwo[1] && lastTwo[0] === challenge.difficulty);
  });
  if (withoutDifficultyStreak.length) candidates = withoutDifficultyStreak;

  if (player.usedSlots < 2) {
    const easy = candidates.filter((challenge) => challenge.difficulty === 'facil');
    if (easy.length) return easy;
  }
  if (player.usedSlots >= 8) {
    const advanced = candidates.filter((challenge) => challenge.difficulty === 'ousada' || challenge.difficulty === 'epica');
    if (advanced.length) return advanced;
  }
  return candidates;
}

export function drawChallenge(game: Game, player: Player, random = Math.random): Challenge {
  const candidates = weightedCandidates(game, player);
  return clone(candidates[Math.floor(random() * candidates.length) % candidates.length]);
}

function drawExtra(game: Game, player: Player, random = Math.random): Challenge {
  const used = historyIds(player);
  const candidates = challenges.filter((challenge) =>
    challenge.active && challenge.modes.includes(game.mode) && challenge.extraCardEligible &&
    (challenge.difficulty === 'ousada' || challenge.difficulty === 'epica') && !used.has(challenge.id)
  );
  const fallback = challenges.filter((challenge) => challenge.active && challenge.extraCardEligible && (challenge.difficulty === 'ousada' || challenge.difficulty === 'epica'));
  const pool = candidates.length ? candidates : fallback;
  return clone(pool[Math.floor(random() * pool.length) % pool.length]);
}

export function createGame(name: string, mode: GameMode, drafts: PlayerDraft[], random = Math.random): Game {
  const base: Game = {
    id: uid('game'), name: name.trim() || 'Nossa noite', mode, players: [], status: 'playing', createdAt: now(),
    activeGroupChallenge: null, groupChallengeHistory: [], usedGroupChallengeIds: []
  };
  base.players = drafts.map((draft, index) => {
    const player: Player = {
      id: uid('player'), name: draft.name.trim(), color: draft.color, score: 0, completedChallenges: 0,
      usedSlots: 0, passesRemaining: 3, activeChallenge: null, history: [], consecutiveCompletions: 0,
      extraCardUnlocked: false, extraCardUsed: false, extraCardChallenge: null, status: 'playing', order: index
    };
    player.activeChallenge = drawChallenge(base, player, random);
    return player;
  });
  return base;
}

function replacePlayer(game: Game, playerId: string, change: (player: Player) => Player): Game {
  const next = clone(game);
  const index = next.players.findIndex((player) => player.id === playerId);
  if (index < 0) return game;
  next.players[index] = change(next.players[index]);
  if (next.players.every((player) => player.status === 'finished')) {
    next.status = 'finished';
    next.finishedAt = next.finishedAt ?? now();
  }
  return next;
}

function pushHistory(player: Player, challenge: Challenge | null, status: Player['history'][number]['status'], pointsEarned: number, label?: string): void {
  player.history.push({ id: uid('event'), challenge: challenge ? clone(challenge) : null, status, pointsEarned, label, completedAt: now() });
}

function bonus(player: Player, label: string, points: number): void {
  const already = player.history.some((item) => item.status === 'bonus' && item.label === label);
  if (!already) {
    player.score += points;
    pushHistory(player, null, 'bonus', points, label);
  }
}

export function completeActiveChallenge(game: Game, playerId: string): Game {
  return replacePlayer(game, playerId, (player) => {
    const challenge = player.activeChallenge;
    if (!challenge || player.usedSlots >= 10) return player;
    const next = clone(player);
    next.score += challenge.points;
    next.completedChallenges += 1;
    next.usedSlots += 1;
    next.consecutiveCompletions += 1;
    pushHistory(next, challenge, 'completed', challenge.points);
    if (next.completedChallenges === 1) bonus(next, 'Primeiro desafio concluído', 5);
    if (next.consecutiveCompletions > 0 && next.consecutiveCompletions % 3 === 0) bonus(next, 'Sequência de 3 sem passe', 10);
    if (next.completedChallenges === 5) bonus(next, 'Cinco desafios concluídos', 15);
    if (next.completedChallenges === 10) bonus(next, 'Dez desafios concluídos', 25);
    next.activeChallenge = null;
    if (next.usedSlots >= 10) {
      if (next.completedChallenges === 10) {
        next.extraCardUnlocked = true;
      } else {
        next.status = 'finished';
      }
    } else {
      next.activeChallenge = drawChallenge(game, next);
    }
    return next;
  });
}

export function usePass(game: Game, playerId: string): Game {
  return replacePlayer(game, playerId, (player) => {
    if (!player.activeChallenge || player.passesRemaining <= 0 || player.usedSlots >= 10) return player;
    const next = clone(player);
    const old = next.activeChallenge;
    pushHistory(next, old, 'passed', 0, 'Trocado com passe');
    next.passesRemaining -= 1;
    next.consecutiveCompletions = 0;
    next.activeChallenge = drawChallenge(game, next);
    return next;
  });
}

export function skipActiveChallenge(game: Game, playerId: string): Game {
  return replacePlayer(game, playerId, (player) => {
    if (!player.activeChallenge || player.passesRemaining > 0 || player.usedSlots >= 10) return player;
    const next = clone(player);
    const old = next.activeChallenge;
    pushHistory(next, old, 'skipped', 0, 'Pulou sem substituir');
    next.usedSlots += 1;
    next.consecutiveCompletions = 0;
    next.activeChallenge = next.usedSlots < 10 ? drawChallenge(game, next) : null;
    if (next.usedSlots >= 10) next.status = 'finished';
    return next;
  });
}

export function drawExtraCard(game: Game, playerId: string, random = Math.random): Game {
  return replacePlayer(game, playerId, (player) => {
    if (!player.extraCardUnlocked || player.extraCardUsed) return player;
    const next = clone(player);
    next.extraCardUsed = true;
    next.extraCardChallenge = drawExtra(game, next, random);
    return next;
  });
}

export function declineExtraCard(game: Game, playerId: string): Game {
  return replacePlayer(game, playerId, (player) => {
    if (!player.extraCardUnlocked || (!player.extraCardChallenge && player.extraCardUsed)) return player;
    const next = clone(player);
    next.extraCardUsed = true;
    next.extraCardChallenge = null;
    if (!next.history.some((item) => item.status === 'extra-declined')) {
      pushHistory(next, null, 'extra-declined', 0, 'Carta Extra recusada');
    }
    next.status = 'finished';
    return next;
  });
}

export function completeExtraCard(game: Game, playerId: string): Game {
  return replacePlayer(game, playerId, (player) => {
    if (!player.extraCardChallenge || !player.extraCardUsed) return player;
    const next = clone(player);
    const challenge = next.extraCardChallenge;
    if (!challenge) return next;
    const points = challenge.points + 10;
    next.score += points;
    pushHistory(next, challenge, 'extra-completed', points, 'Carta Extra + bônus de 10');
    next.extraCardChallenge = null;
    next.status = 'finished';
    return next;
  });
}

export function drawGroupChallenge(game: Game, random = Math.random): Game {
  if (game.activeGroupChallenge) return game;
  const used = new Set(game.usedGroupChallengeIds ?? []);
  let pool = groupChallenges.filter((challenge) => challenge.active && !used.has(challenge.id));
  if (!pool.length) pool = groupChallenges.filter((challenge) => challenge.active);
  const next = clone(game);
  next.activeGroupChallenge = { ...clone(pool[Math.floor(random() * pool.length) % pool.length]), completedPlayerIds: [] };
  next.usedGroupChallengeIds = [...(next.usedGroupChallengeIds ?? []), next.activeGroupChallenge.id];
  return next;
}

export function toggleGroupChallengePlayer(game: Game, playerId: string): Game {
  if (!game.activeGroupChallenge || !game.players.some((player) => player.id === playerId)) return game;
  const next = clone(game);
  const selected = new Set(next.activeGroupChallenge?.completedPlayerIds ?? []);
  if (selected.has(playerId)) selected.delete(playerId);
  else selected.add(playerId);
  next.activeGroupChallenge = { ...next.activeGroupChallenge!, completedPlayerIds: [...selected] };
  return next;
}

export function completeGroupChallenge(game: Game): Game {
  if (!game.activeGroupChallenge) return game;
  const next = clone(game);
  const challenge = next.activeGroupChallenge;
  if (!challenge) return next;
  const completedPlayerIds = [...new Set(challenge.completedPlayerIds ?? [])].filter((id) => next.players.some((player) => player.id === id));
  if (!completedPlayerIds.length) return game;
  next.players = next.players.map((player) => {
    if (!completedPlayerIds.includes(player.id)) return player;
    const updated = clone(player);
    updated.score += challenge.points;
    pushHistory(updated, null, 'group-completed', challenge.points, `Coletivo: ${challenge.title}`);
    return updated;
  });
  next.groupChallengeHistory = [
    ...(next.groupChallengeHistory ?? []),
    { id: uid('group-event'), challenge: clone(challenge), pointsPerPlayer: challenge.points, completedPlayerIds, completedAt: now() }
  ];
  next.activeGroupChallenge = null;
  return next;
}

export function finishPlayer(game: Game, playerId: string): Game {
  return replacePlayer(game, playerId, (player) => ({ ...player, status: 'finished' }));
}

export function finishNight(game: Game): Game {
  const next = clone(game);
  next.status = 'finished';
  next.finishedAt = now();
  next.players = next.players.map((player) => ({ ...player, status: 'finished' }));
  return next;
}

export function getRanking(game: Game): RankingEntry[] {
  return [...game.players]
    .map((player) => ({ ...player, skippedSlots: player.usedSlots - player.completedChallenges }))
    .sort((a, b) => b.score - a.score || b.completedChallenges - a.completedChallenges || a.skippedSlots - b.skippedSlots || a.order - b.order);
}

export function getPlayer(game: Game, playerId: string): Player | undefined {
  return game.players.find((player) => player.id === playerId);
}

export const difficultyLabel: Record<Difficulty, string> = { facil: 'Fácil', media: 'Média', ousada: 'Ousada', epica: 'Épica' };
export const modeLabel: Record<GameMode, string> = { social: 'Social', ousado: 'Ousado', 'capetinha-roxo': 'Capetinha Roxo' };
export const difficultyPoints = POINTS;
