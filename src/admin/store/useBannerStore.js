import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialBanners = [
  {
    id: 'b1',
    title: 'Premium Amusement Equipment',
    subtitle: 'Professional grade machines for route operators',
    ctaText: 'Browse Catalog',
    ctaLink: '/gaming-carts',
    image: '/image_1.jpeg',
    visible: true,
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'b2',
    title: 'Flash Deals & Bundle Offers',
    subtitle: 'Limited time savings on hardware packs',
    ctaText: 'View Deals',
    ctaLink: '/deals',
    image: '/image_2.jpeg',
    visible: true,
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'b3',
    title: 'OEM Parts & PCB Boards',
    subtitle: 'Genuine Pot-O-Gold, Cherry Master, and more',
    ctaText: 'Shop Now',
    ctaLink: '/gaming-carts',
    image: '/image_3.jpeg',
    visible: false,
    order: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const useBannerStore = create(
  persist(
    (set, get) => ({
      banners: initialBanners,

      // ── Create ─────────────────────────────────────────────────────────────
      addBanner: (banner) =>
        set((state) => {
          const maxOrder = state.banners.reduce((m, b) => Math.max(m, b.order ?? 0), 0);
          return {
            banners: [
              ...state.banners,
              {
                ...banner,
                id: `b${Date.now()}`,
                visible: banner.visible ?? true,
                order: banner.order ?? maxOrder + 1,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            ],
          };
        }),

      // ── Read ────────────────────────────────────────────────────────────────
      getBanner: (id) => get().banners.find((b) => b.id === id),
      getVisible: () =>
        get()
          .banners.filter((b) => b.visible)
          .sort((a, b) => a.order - b.order),
      getSorted: () => [...get().banners].sort((a, b) => a.order - b.order),

      // ── Update ──────────────────────────────────────────────────────────────
      updateBanner: (id, updates) =>
        set((state) => ({
          banners: state.banners.map((b) =>
            b.id === id
              ? { ...b, ...updates, updatedAt: new Date().toISOString() }
              : b
          ),
        })),

      // ── Delete ──────────────────────────────────────────────────────────────
      deleteBanner: (id) =>
        set((state) => ({
          banners: state.banners.filter((b) => b.id !== id),
        })),

      // ── Toggle visibility ───────────────────────────────────────────────────
      toggleVisible: (id) =>
        set((state) => ({
          banners: state.banners.map((b) =>
            b.id === id
              ? { ...b, visible: !b.visible, updatedAt: new Date().toISOString() }
              : b
          ),
        })),

      // ── Reorder — swap two banners by id ───────────────────────────────────
      reorderBanners: (idA, idB) =>
        set((state) => {
          const bannerA = state.banners.find((b) => b.id === idA);
          const bannerB = state.banners.find((b) => b.id === idB);
          if (!bannerA || !bannerB) return state;
          const orderA = bannerA.order;
          const orderB = bannerB.order;
          return {
            banners: state.banners.map((b) => {
              if (b.id === idA)
                return { ...b, order: orderB, updatedAt: new Date().toISOString() };
              if (b.id === idB)
                return { ...b, order: orderA, updatedAt: new Date().toISOString() };
              return b;
            }),
          };
        }),
    }),
    { name: 'mmr-admin-banners' }
  )
);
