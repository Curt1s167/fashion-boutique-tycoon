import type { GameState, SaveSlotMetadata } from '../types/game';

const SAVE_PREFIX = 'FASHION_BOUTIQUE_TYCOON_SLOT_';
const ACTIVE_SLOT_KEY = 'FASHION_BOUTIQUE_ACTIVE_SLOT';

export const getActiveSlotId = (): string => {
  try {
    return localStorage.getItem(ACTIVE_SLOT_KEY) || 'slot_1';
  } catch {
    return 'slot_1';
  }
};

export const setActiveSlotId = (slotId: string): void => {
  try {
    localStorage.setItem(ACTIVE_SLOT_KEY, slotId);
  } catch (err) {
    console.warn('Could not set active slot:', err);
  }
};

export const getSaveSlotsMetadata = (): SaveSlotMetadata[] => {
  const slotIds = ['slot_1', 'slot_2', 'slot_3'];
  const defaultNames: Record<string, string> = {
    slot_1: 'Chiến Dịch 1 (Chính)',
    slot_2: 'Chiến Dịch 2 (Thử Nghiệm)',
    slot_3: 'Chiến Dịch 3 (Mở Rộng)'
  };

  return slotIds.map(slotId => {
    try {
      const raw = localStorage.getItem(SAVE_PREFIX + slotId);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.state) {
          return {
            slotId,
            slotName: parsed.slotName || defaultNames[slotId],
            day: parsed.state.day || 1,
            cash: parsed.state.cash || 0,
            reputationStars: parsed.state.reputationStars || 1,
            branchCount: (parsed.state.branches || []).filter((b: { isUnlocked: boolean }) => b.isUnlocked).length || 1,
            savedAt: parsed.savedAt || Date.now()
          };
        }
      }
    } catch {
      // ignore
    }

    return {
      slotId,
      slotName: defaultNames[slotId] + ' [Chưa có dữ liệu]',
      day: 1,
      cash: 750000,
      reputationStars: 1,
      branchCount: 1,
      savedAt: 0
    };
  });
};

export const saveGameState = (state: GameState, slotId = getActiveSlotId()): void => {
  try {
    const payload = {
      version: 3,
      slotId,
      slotName: slotId === 'slot_1' ? 'Chiến Dịch 1 (Chính)' : slotId === 'slot_2' ? 'Chiến Dịch 2' : 'Chiến Dịch 3',
      savedAt: Date.now(),
      state: {
        ...state,
        floatingNumbers: [],
        customers: state.customers.slice(0, 8),
      }
    };
    localStorage.setItem(SAVE_PREFIX + slotId, JSON.stringify(payload));
  } catch (err) {
    console.warn('Could not save game state:', err);
  }
};

export const loadGameState = (slotId = getActiveSlotId()): Partial<GameState> | null => {
  try {
    const raw = localStorage.getItem(SAVE_PREFIX + slotId);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.state) {
      return parsed.state;
    }
  } catch (err) {
    console.warn('Could not load game state:', err);
  }
  return null;
};

export const clearGameState = (slotId = getActiveSlotId()): void => {
  try {
    localStorage.removeItem(SAVE_PREFIX + slotId);
  } catch (err) {
    console.warn('Could not clear save:', err);
  }
};
