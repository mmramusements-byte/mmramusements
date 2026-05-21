import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        
        // Simulate premium network delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        if (email.toLowerCase() === 'admin@mmr.com' && password === 'mmradmin123') {
          set({
            user: { email: 'admin@mmr.com', role: 'admin', name: 'MMR Admin' },
            isAuthenticated: true,
            isLoading: false,
          });
          return { success: true };
        } else {
          set({ isLoading: false });
          return { success: false, error: 'Invalid email or password.' };
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'mmr-admin-auth',
    }
  )
);
