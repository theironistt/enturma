import type { Game } from '../types/game';

export const STORAGE_KEY = 'enturma-current-game-v1';

export function saveGame(game: Game): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(game));
  } catch {
    // O jogo continua funcionando em memória quando o armazenamento está indisponível.
  }
}

export function loadGame(): Game | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Game;
    if (!parsed?.id || !Array.isArray(parsed.players)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearSavedGame(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // noop
  }
}
