import type { GameState } from '../types/game';

const SAVE_KEY = 'FASHION_BOUTIQUE_TYCOON_SAVE_V2';

export const saveGameState = (state: GameState): void => {
  try {
    const payload = {
      version: 2,
      savedAt: Date.now(),
      state: {
        ...state,
        floatingNumbers: [], // Don't persist transient animations
        customers: state.customers.slice(0, 8), // Keep reasonable floor visitors
      }
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.warn('Could not save game state:', err);
  }
};

export const loadGameState = (): Partial<GameState> | null => {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.version === 2 && parsed.state) {
      return parsed.state;
    }
  } catch (err) {
    console.warn('Could not load game state:', err);
  }
  return null;
};

export const clearGameState = (): void => {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch (err) {
    console.warn('Could not clear save:', err);
  }
};
