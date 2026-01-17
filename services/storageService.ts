// services/storageService.ts - Updated to work with backend
import { UserProfile, FinanceData, JournalEntry, Habit, Subscription } from '../types';
import { ApiService } from './apiService';

const KEYS = {
  THEME: 'nemesis_theme',
  HYDRATION: 'nemesis_hydration_today',
  HYDRATION_DATE: 'nemesis_hydration_date',
  SLEEP: 'nemesis_sleep_last',
  WELLNESS: 'nemesis_wellness',
  WELLNESS_CONFIG: 'nemesis_wellness_config',
};

// Cache for offline mode
let financeCache: FinanceData[] = [];
let journalCache: JournalEntry[] = [];
let habitCache: Habit[] = [];
let subscriptionCache: Subscription[] = [];
let gratitudeCache: string[] = [];
let wellnessConfigCache: string[] = [];

export const StorageService = {
  // Theme (local only for instant switching)
  getTheme: (): string => {
    return localStorage.getItem(KEYS.THEME) || 'dracula';
  },
  
  setTheme: async (theme: string) => {
    localStorage.setItem(KEYS.THEME, theme);
    try {
      await ApiService.updateTheme(theme);
    } catch (error) {
      console.error('Failed to sync theme:', error);
    }
  },

  // Settings
  getSettings: () => {
    // This should be fetched from user profile
    return { notifications: true, sound: false };
  },
  
  saveSettings: async (settings: any) => {
    try {
      await ApiService.updateSettings(settings);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  },

  // User
  getUser: (): UserProfile | null => {
    // User is fetched from backend after login
    return null;
  },
  
  saveUser: (user: UserProfile) => {
    // Not needed - handled by backend
  },
  
  logout: () => {
    ApiService.logout();
    // Clear caches
    financeCache = [];
    journalCache = [];
    habitCache = [];
    subscriptionCache = [];
    gratitudeCache = [];
    localStorage.clear();
  },

  // Password management removed - handled by backend

  // Finance
  getFinances: (): FinanceData[] => {
    return financeCache;
  },
  
  loadFinances: async () => {
    try {
      const response = await ApiService.getFinances();
      financeCache = response.data.map((f: any) => ({
        id: f._id,
        userId: f.userId,
        type: f.type,
        amount: f.amount,
        category: f.category,
        date: f.date,
        notes: f.notes || ''
      }));
      return financeCache;
    } catch (error) {
      console.error('Failed to load finances:', error);
      return financeCache;
    }
  },
  
  addFinance: async (item: Omit<FinanceData, 'id' | 'userId'>) => {
    try {
      const response = await ApiService.createFinance(item);
      const newItem: FinanceData = {
        id: response.data._id,
        userId: response.data.userId,
        type: response.data.type,
        amount: response.data.amount,
        category: response.data.category,
        date: response.data.date,
        notes: response.data.notes || ''
      };
      financeCache = [newItem, ...financeCache];
      return financeCache;
    } catch (error) {
      console.error('Failed to add finance:', error);
      throw error;
    }
  },

  // Journal
  getJournal: (): JournalEntry[] => {
    return journalCache;
  },
  
  loadJournal: async () => {
    try {
      const response = await ApiService.getJournals();
      journalCache = response.data.map((j: any) => ({
        id: j._id,
        userId: j.userId,
        mood: j.mood,
        text: j.text,
        date: j.date
      }));
      return journalCache;
    } catch (error) {
      console.error('Failed to load journal:', error);
      return journalCache;
    }
  },
  
  addJournal: async (entry: Omit<JournalEntry, 'id' | 'userId'>) => {
    try {
      const response = await ApiService.createJournal(entry);
      const newEntry: JournalEntry = {
        id: response.data._id,
        userId: response.data.userId,
        mood: response.data.mood,
        text: response.data.text,
        date: response.data.date
      };
      journalCache = [newEntry, ...journalCache];
      return journalCache;
    } catch (error) {
      console.error('Failed to add journal:', error);
      throw error;
    }
  },

  // Habits
  getHabits: (): Habit[] => {
    return habitCache;
  },
  
  loadHabits: async () => {
    try {
      const response = await ApiService.getHabits();
      habitCache = response.data.map((h: any) => ({
        id: h._id,
        userId: h.userId,
        name: h.name,
        frequency: h.frequency,
        streak: h.streak,
        longestStreak: h.longestStreak,
        lastCompletedDate: h.lastCompletedDate,
        history: h.history
      }));
      return habitCache;
    } catch (error) {
      console.error('Failed to load habits:', error);
      return habitCache;
    }
  },
  
  saveHabits: async (habits: Habit[]) => {
    habitCache = habits;
    // Individual updates are handled by widget actions
  },
  
  addHabit: async (habit: Omit<Habit, 'id' | 'userId'>) => {
    try {
      const response = await ApiService.createHabit(habit);
      const newHabit: Habit = {
        id: response.data._id,
        userId: response.data.userId,
        name: response.data.name,
        frequency: response.data.frequency,
        streak: response.data.streak,
        longestStreak: response.data.longestStreak,
        lastCompletedDate: response.data.lastCompletedDate,
        history: response.data.history
      };
      habitCache = [...habitCache, newHabit];
      return habitCache;
    } catch (error) {
      console.error('Failed to add habit:', error);
      throw error;
    }
  },
  
  toggleHabit: async (id: string) => {
    try {
      const response = await ApiService.toggleHabit(id);
      habitCache = habitCache.map(h => 
        h.id === id ? {
          ...h,
          streak: response.data.streak,
          longestStreak: response.data.longestStreak,
          lastCompletedDate: response.data.lastCompletedDate,
          history: response.data.history
        } : h
      );
      return habitCache;
    } catch (error) {
      console.error('Failed to toggle habit:', error);
      throw error;
    }
  },
  
  deleteHabit: async (id: string) => {
    try {
      await ApiService.deleteHabit(id);
      habitCache = habitCache.filter(h => h.id !== id);
      return habitCache;
    } catch (error) {
      console.error('Failed to delete habit:', error);
      throw error;
    }
  },

  // Subscriptions
  getSubscriptions: (): Subscription[] => {
    return subscriptionCache;
  },
  
  loadSubscriptions: async () => {
    try {
      const response = await ApiService.getSubscriptions();
      subscriptionCache = response.data.map((s: any) => ({
        id: s._id,
        name: s.name,
        cost: s.cost
      }));
      return subscriptionCache;
    } catch (error) {
      console.error('Failed to load subscriptions:', error);
      return subscriptionCache;
    }
  },
  
  saveSubscriptions: async (subs: Subscription[]) => {
    subscriptionCache = subs;
  },
  
  const addSub = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!newSub.name || !newSub.cost) return;
  
  try {
    await StorageService.addSubscription({
      name: newSub.name,
      cost: parseFloat(newSub.cost)
    });
    await load();
    setNewSub({ name: '', cost: '' });
  } catch (error) {
    console.error('Failed to add subscription:', error);
  }
};
  
  const deleteSub = async (id: string) => {
  try {
    await StorageService.deleteSubscription(id);
    await load();
  } catch (error) {
    console.error('Failed to delete subscription:', error);
  }
};

  // Gratitude
  getGratitude: (): string[] => {
    return gratitudeCache;
  },
  
  loadGratitude: async () => {
    try {
      const response = await ApiService.getGratitude();
      gratitudeCache = response.data;
      return gratitudeCache;
    } catch (error) {
      console.error('Failed to load gratitude:', error);
      return gratitudeCache;
    }
  },
  
  saveGratitude: async (items: string[]) => {
    try {
      await ApiService.updateGratitude(items);
      gratitudeCache = items;
    } catch (error) {
      console.error('Failed to save gratitude:', error);
    }
  },

  // Wellness
  getWellnessConfig: (): string[] => {
    return wellnessConfigCache;
  },
  
  loadWellnessConfig: async () => {
    try {
      const response = await ApiService.getWellnessConfig();
      wellnessConfigCache = response.data;
      return wellnessConfigCache;
    } catch (error) {
      console.error('Failed to load wellness config:', error);
      return wellnessConfigCache;
    }
  },
  
  saveWellnessConfig: async (items: string[]) => {
    try {
      await ApiService.updateWellnessConfig(items);
      wellnessConfigCache = items;
    } catch (error) {
      console.error('Failed to save wellness config:', error);
    }
  },
  
  getWellnessState: (date: string): Record<string, boolean> => {
    const key = `${KEYS.WELLNESS}_${date}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : {};
  },
  
  saveWellnessState: async (date: string, state: Record<string, boolean>) => {
    const key = `${KEYS.WELLNESS}_${date}`;
    localStorage.setItem(key, JSON.stringify(state));
    try {
      await ApiService.updateWellnessState(date, state);
    } catch (error) {
      console.error('Failed to sync wellness state:', error);
    }
  },

  // Hydration (local + backend sync)
  getHydrationToday: (): number => {
    const saved = localStorage.getItem(KEYS.HYDRATION);
    const date = localStorage.getItem(KEYS.HYDRATION_DATE);
    if (date === new Date().toDateString() && saved) {
      return parseInt(saved);
    }
    return 0;
  },
  
  saveHydrationToday: async (cups: number) => {
    localStorage.setItem(KEYS.HYDRATION, cups.toString());
    localStorage.setItem(KEYS.HYDRATION_DATE, new Date().toDateString());
    try {
      await ApiService.updateHydrationToday(cups);
    } catch (error) {
      console.error('Failed to sync hydration:', error);
    }
  },

  // Sleep (backend only)
  getLatestSleep: async () => {
    try {
      const response = await ApiService.getLatestSleep();
      return response.data?.hours || null;
    } catch (error) {
      console.error('Failed to load sleep:', error);
      return null;
    }
  },
  
  saveSleep: async (hours: number) => {
    try {
      await ApiService.createSleep(hours);
    } catch (error) {
      console.error('Failed to save sleep:', error);
      throw error;
    }
  },

  // Initialize - load all data from backend
  initializeFromBackend: async () => {
    await Promise.all([
      StorageService.loadFinances(),
      StorageService.loadJournal(),
      StorageService.loadHabits(),
      StorageService.loadSubscriptions(),
      StorageService.loadGratitude(),
      StorageService.loadWellnessConfig()
    ]);
  },

  // Seed data method removed - backend handles seeding
  seedData: () => {
    // No-op - backend provides initial data
  }
};