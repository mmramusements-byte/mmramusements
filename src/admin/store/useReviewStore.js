import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialReviews = [
  {
    id: 'r1',
    rating: 5,
    comment:
      'Added two vertical skill terminals and a 6-player fish table to our tavern bar counter. Our monthly net yield has spiked significantly!',
    name: 'James C.',
    handle: 'Tavern Route Operator',
    avatarColor: '#ef4444',
    avatar: 'JC',
    featured: true,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'r2',
    rating: 5,
    comment:
      'Genuine Pot-O-Gold 510 board arrived pre-flashed and ready to play. Dip switches were preset perfectly. MMR support guided us through in minutes.',
    name: 'Richard M.',
    handle: 'Commercial Vending Co.',
    avatarColor: '#3b82f6',
    avatar: 'RM',
    featured: true,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'r3',
    rating: 5,
    comment:
      'Bought a set of custom laminate Cherry Master countertop cabinets. The wood-grain finish is beautiful and coin acceptors work flawlessly.',
    name: 'Sarah H.',
    handle: 'Arcade & Bowling Manager',
    avatarColor: '#22c55e',
    avatar: 'SH',
    featured: false,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'r4',
    rating: 5,
    comment:
      'Ordered 5 ICT A6 bill validators for our laundromat coin-up setups. Pre-programmed to accept USD and dispatched the same afternoon.',
    name: 'Vincent J.',
    handle: 'Multi-Store Proprietor',
    avatarColor: '#e040fb',
    avatar: 'VJ',
    featured: false,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'r5',
    rating: 4,
    comment:
      'The 36-pin wiring harnesses and heavy-duty coin doors are authentic OEM quality. Highly recommend MMR Amusements to any route operator.',
    name: 'Naman K.',
    handle: 'Amusement Route Lead',
    avatarColor: '#eab308',
    avatar: 'NK',
    featured: false,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'r6',
    rating: 5,
    comment:
      'Professional technical support. They provided clear wiring schematics for dual-screen cabinets and resolved note validator stacking alerts quickly.',
    name: 'Priya K.',
    handle: 'Coin-Op Technician',
    avatarColor: '#ef4444',
    avatar: 'PK',
    featured: true,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const useReviewStore = create(
  persist(
    (set, get) => ({
      reviews: initialReviews,

      // ── Create ─────────────────────────────────────────────────────────────
      addReview: (review) =>
        set((state) => ({
          reviews: [
            {
              ...review,
              id: `r${Date.now()}`,
              featured: review.featured ?? false,
              active: review.active ?? true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            ...state.reviews,
          ],
        })),

      // ── Read ────────────────────────────────────────────────────────────────
      getReview: (id) => get().reviews.find((r) => r.id === id),
      getFeatured: () => get().reviews.filter((r) => r.featured && r.active),
      getActive: () => get().reviews.filter((r) => r.active),

      // ── Update ──────────────────────────────────────────────────────────────
      updateReview: (id, updates) =>
        set((state) => ({
          reviews: state.reviews.map((r) =>
            r.id === id
              ? { ...r, ...updates, updatedAt: new Date().toISOString() }
              : r
          ),
        })),

      // ── Delete ──────────────────────────────────────────────────────────────
      deleteReview: (id) =>
        set((state) => ({
          reviews: state.reviews.filter((r) => r.id !== id),
        })),

      // ── Toggles ─────────────────────────────────────────────────────────────
      toggleFeatured: (id) =>
        set((state) => ({
          reviews: state.reviews.map((r) =>
            r.id === id
              ? { ...r, featured: !r.featured, updatedAt: new Date().toISOString() }
              : r
          ),
        })),

      toggleActive: (id) =>
        set((state) => ({
          reviews: state.reviews.map((r) =>
            r.id === id
              ? { ...r, active: !r.active, updatedAt: new Date().toISOString() }
              : r
          ),
        })),
    }),
    { name: 'mmr-admin-reviews' }
  )
);
