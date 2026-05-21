import { create } from 'zustand';
import api from '../lib/api';

export const useSettingsStore = create((set) => ({
  settings: {
    hero_visible: true,
    featured_visible: true,
    trending_visible: true,
    deals_visible: true,
    reviews_visible: true,
    best_sellers_visible: true,
    new_arrivals_visible: true,
    popular_visible: true,
    recommended_visible: true,
    logo_url: null,
  },
  isLoading: false,
  error: null,

  fetchSettings: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.get('/settings/homepage');
      set({ settings: data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  updateSettings: async (newSettings) => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.put('/settings/homepage', newSettings);
      set({ settings: data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  }
}));
