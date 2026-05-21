import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { deals as initialDeals } from '../../data/products';

// Enrich initial deals with admin-only fields
const enrichDeals = (deals) =>
  deals.map((d) => ({
    ...d,
    active: true,
    featured: false,
    startDate: '',
    endDate: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

export const useDealStore = create(
  persist(
    (set, get) => ({
      deals: enrichDeals(initialDeals),

      // ── Create ─────────────────────────────────────────────────────────────
      addDeal: (deal) =>
        set((state) => ({
          deals: [
            {
              ...deal,
              id: `d${Date.now()}`,
              active: deal.active ?? true,
              featured: deal.featured ?? false,
              startDate: deal.startDate ?? '',
              endDate: deal.endDate ?? '',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            ...state.deals,
          ],
        })),

      // ── Read ────────────────────────────────────────────────────────────────
      getDeal: (id) => get().deals.find((d) => d.id === id),
      getActive: () => get().deals.filter((d) => d.active),
      getFeatured: () => get().deals.filter((d) => d.featured && d.active),

      // ── Update ──────────────────────────────────────────────────────────────
      updateDeal: (id, updates) =>
        set((state) => ({
          deals: state.deals.map((d) =>
            d.id === id
              ? { ...d, ...updates, updatedAt: new Date().toISOString() }
              : d
          ),
        })),

      // ── Delete ──────────────────────────────────────────────────────────────
      deleteDeal: (id) =>
        set((state) => ({
          deals: state.deals.filter((d) => d.id !== id),
        })),

      // ── Toggles ─────────────────────────────────────────────────────────────
      toggleActive: (id) =>
        set((state) => ({
          deals: state.deals.map((d) =>
            d.id === id
              ? { ...d, active: !d.active, updatedAt: new Date().toISOString() }
              : d
          ),
        })),

      toggleFeatured: (id) =>
        set((state) => ({
          deals: state.deals.map((d) =>
            d.id === id
              ? { ...d, featured: !d.featured, updatedAt: new Date().toISOString() }
              : d
          ),
        })),
    }),
    { name: 'mmr-admin-deals' }
  )
);
