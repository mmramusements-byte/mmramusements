import { create } from 'zustand';
import api from '../../lib/api';

export const useProductStore = create((set, get) => ({
  products: [],
  isLoading: false,
  isInitialized: false, // Prevents re-fetching if already loaded in same session
  error: null,

  // ── Fetch ───────────────────────────────────────────────────────────────
  fetchProducts: async (force = false) => {
    // If already initialized and not forced, don't refetch on every mount
    if (get().isInitialized && !force) return;

    set({ isLoading: true, error: null });
    try {
      // api.get automatically unpacks response.data because of the interceptor
      const data = await api.get('/products');
      
      const realProducts = data.map(p => ({
        ...p,
        id: String(p.id),
        discountPrice: p.discount_price,
        bestSeller: p.best_seller,
        newArrival: p.new_arrival,
        popular: p.popular,
        recommended: p.recommended,
        image: p.image_url,
        createdAt: p.created_at,
        updatedAt: p.updated_at
      }));

      set({ products: realProducts, isLoading: false, isInitialized: true });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // ── Create ─────────────────────────────────────────────────────────────
  addProduct: async (productData) => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.post('/products', productData);

      const newProduct = {
        ...data,
        id: String(data.id),
        discountPrice: data.discount_price,
        bestSeller: data.best_seller,
        newArrival: data.new_arrival,
        popular: data.popular,
        recommended: data.recommended,
        image: data.image_url,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };

      set((state) => ({
        products: [newProduct, ...state.products],
        isLoading: false
      }));
      return newProduct;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  duplicateProduct: async (id) => {
    const product = get().getProduct(id);
    if (!product) return;
    const { id: _, createdAt, updatedAt, ...data } = product;
    data.title = `${data.title} (Copy)`;
    await get().addProduct(data);
  },

  // ── Read ────────────────────────────────────────────────────────────────
  getProduct: (id) => get().products.find((p) => String(p.id) === String(id)),
  getFeatured: () => get().products.filter((p) => p.featured && p.active),
  getTrending: () => get().products.filter((p) => p.trending && p.active),
  getBestSellers: () => get().products.filter((p) => p.bestSeller && p.active),
  getNewArrivals: () => get().products.filter((p) => p.newArrival && p.active),
  getPopular: () => get().products.filter((p) => p.popular && p.active),
  getRecommended: () => get().products.filter((p) => p.recommended && p.active),
  getActive: () => get().products.filter((p) => p.active),

  // ── Update ──────────────────────────────────────────────────────────────
  updateProduct: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.put(`/products/${id}`, updates);

      const updatedProduct = {
        ...data,
        id: String(data.id),
        discountPrice: data.discount_price,
        bestSeller: data.best_seller,
        newArrival: data.new_arrival,
        popular: data.popular,
        recommended: data.recommended,
        image: data.image_url,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };

      set((state) => ({
        products: state.products.map((p) => (String(p.id) === String(id) ? { ...p, ...updatedProduct } : p)),
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // ── Delete ──────────────────────────────────────────────────────────────
  deleteProduct: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/products/${id}`);
      set((state) => ({
        products: state.products.filter((p) => String(p.id) !== String(id)),
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // ── Toggles ─────────────────────────────────────────────────────────────
  toggleFeatured: async (id) => {
    const p = get().getProduct(id);
    if (!p) return;
    await get().updateProduct(id, { featured: !p.featured });
  },

  toggleTrending: async (id) => {
    const p = get().getProduct(id);
    if (!p) return;
    await get().updateProduct(id, { trending: !p.trending });
  },

  toggleBestSeller: async (id) => {
    const p = get().getProduct(id);
    if (!p) return;
    await get().updateProduct(id, { bestSeller: !p.bestSeller });
  },
  
  toggleNewArrival: async (id) => {
    const p = get().getProduct(id);
    if (!p) return;
    await get().updateProduct(id, { newArrival: !p.newArrival });
  },

  togglePopular: async (id) => {
    const p = get().getProduct(id);
    if (!p) return;
    await get().updateProduct(id, { popular: !p.popular });
  },

  toggleRecommended: async (id) => {
    const p = get().getProduct(id);
    if (!p) return;
    await get().updateProduct(id, { recommended: !p.recommended });
  },

  toggleActive: async (id) => {
    const p = get().getProduct(id);
    if (!p) return;
    await get().updateProduct(id, { active: !p.active });
  },
}));
