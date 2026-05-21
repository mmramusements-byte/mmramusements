import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialSocials = [
  { id: 'instagram', name: 'Instagram', url: 'https://instagram.com/mmramusements', visible: true },
  { id: 'facebook', name: 'Facebook', url: 'https://facebook.com/mmramusements', visible: true },
  { id: 'twitter', name: 'X / Twitter', url: 'https://x.com/mmramusements', visible: true },
  { id: 'youtube', name: 'YouTube', url: 'https://youtube.com/c/mmramusements', visible: true },
  { id: 'discord', name: 'Discord', url: '', visible: false },
  { id: 'whatsapp', name: 'WhatsApp', url: 'https://wa.me/12103888416', visible: true },
  { id: 'telegram', name: 'Telegram', url: '', visible: false },
];

export const useSocialStore = create(
  persist(
    (set) => ({
      socials: initialSocials,

      updateSocial: (id, url, visible) =>
        set((state) => ({
          socials: state.socials.map((s) =>
            s.id === id ? { ...s, url, visible, updatedAt: new Date().toISOString() } : s
          ),
        })),

      resetSocials: () => set({ socials: initialSocials }),
    }),
    {
      name: 'mmr-admin-socials',
    }
  )
);
