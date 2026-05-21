import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { products as initialProducts } from '../../data/products';

// Enrich initial products with admin-only fields
const enrichProducts = (products) =>
  products.map((p) => ({
    ...p,
    featured: ['p1', 'p3'].includes(p.id),
    trending: ['p2', 'p4', 'p5'].includes(p.id),
    bestSeller: ['p1', 'p6'].includes(p.id),
    active: true,
    tags: [],
    stock: 'In Stock',
    discountPrice: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

export const useProductStore = create(
  persist(
    (set, get) => ({
      products: enrichProducts(initialProducts),

      // ── Create ─────────────────────────────────────────────────────────────
      addProduct: (product) =>
        set((state) => ({
          products: [
            {
              ...product,
              id: `p${Date.now()}`,
              featured: false,
              trending: false,
              bestSeller: false,
              active: true,
              tags: product.tags ?? [],
              stock: product.stock ?? 'In Stock',
              discountPrice: product.discountPrice ?? '',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            ...state.products,
          ],
        })),

      // ── Read ────────────────────────────────────────────────────────────────
      getProduct: (id) => get().products.find((p) => p.id === id),
      getFeatured: () => get().products.filter((p) => p.featured && p.active),
      getTrending: () => get().products.filter((p) => p.trending && p.active),
      getBestSellers: () => get().products.filter((p) => p.bestSeller && p.active),
      getActive: () => get().products.filter((p) => p.active),

      // ── Update ──────────────────────────────────────────────────────────────
      updateProduct: (id, updates) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id
              ? { ...p, ...updates, updatedAt: new Date().toISOString() }
              : p
          ),
        })),

      // ── Delete ──────────────────────────────────────────────────────────────
      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),

      // ── Duplicate ───────────────────────────────────────────────────────────
      duplicateProduct: (id) => {
        const product = get().products.find((p) => p.id === id);
        if (!product) return;
        set((state) => ({
          products: [
            {
              ...product,
              id: `p${Date.now()}`,
              title: `${product.title} (Copy)`,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            ...state.products,
          ],
        }));
      },

      // ── Toggles ─────────────────────────────────────────────────────────────
      toggleFeatured: (id) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id
              ? { ...p, featured: !p.featured, updatedAt: new Date().toISOString() }
              : p
          ),
        })),

      toggleTrending: (id) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id
              ? { ...p, trending: !p.trending, updatedAt: new Date().toISOString() }
              : p
          ),
        })),

      toggleBestSeller: (id) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id
              ? { ...p, bestSeller: !p.bestSeller, updatedAt: new Date().toISOString() }
              : p
          ),
        })),

      toggleActive: (id) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id
              ? { ...p, active: !p.active, updatedAt: new Date().toISOString() }
              : p
          ),
        })),
    }),
    { name: 'mmr-admin-products' }
  )
);
