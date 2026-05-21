/**
 * adminApi.js — Mock API service layer
 *
 * Backend-ready architecture: all business logic lives in Zustand stores.
 * When a real backend is ready, only the implementations here need to change —
 * call signatures remain identical across the codebase.
 */

import { useProductStore } from '../store/useProductStore';
import { useDealStore } from '../store/useDealStore';
import { useReviewStore } from '../store/useReviewStore';
import { useBannerStore } from '../store/useBannerStore';

/** Simulated network latency */
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

// ────────────────────────────────────────────────────────────────────────────
// Products
// ────────────────────────────────────────────────────────────────────────────
export const productApi = {
  /** Fetch all products */
  getAll: async () => {
    return useProductStore.getState().products;
  },

  /** Fetch single product by id */
  getById: async (id) => {
    return useProductStore.getState().getProduct(id);
  },

  /** Create a new product */
  create: async (data) => {
    await useProductStore.getState().addProduct(data);
    return { success: true };
  },

  /** Update an existing product */
  update: async (id, data) => {
    await useProductStore.getState().updateProduct(id, data);
    return { success: true };
  },

  /** Delete a product */
  delete: async (id) => {
    await useProductStore.getState().deleteProduct(id);
    return { success: true };
  },

  /** Duplicate a product */
  duplicate: async (id) => {
    const product = useProductStore.getState().getProduct(id);
    if (!product) return { success: false };
    const { id: _, ...data } = product;
    data.title = `${data.title} (Copy)`;
    await useProductStore.getState().addProduct(data);
    return { success: true };
  },

  /** Toggle featured flag */
  toggleFeatured: async (id) => {
    await useProductStore.getState().toggleFeatured(id);
    return { success: true };
  },

  /** Toggle trending flag */
  toggleTrending: async (id) => {
    await useProductStore.getState().toggleTrending(id);
    return { success: true };
  },

  /** Toggle best-seller flag */
  toggleBestSeller: async (id) => {
    await useProductStore.getState().toggleBestSeller(id);
    return { success: true };
  },

  /** Toggle active/inactive */
  toggleActive: async (id) => {
    await useProductStore.getState().toggleActive(id);
    return { success: true };
  },
};

// ────────────────────────────────────────────────────────────────────────────
// Deals
// ────────────────────────────────────────────────────────────────────────────
export const dealApi = {
  getAll: async () => {
    await delay();
    return useDealStore.getState().deals;
  },

  getById: async (id) => {
    await delay(100);
    return useDealStore.getState().getDeal(id);
  },

  create: async (data) => {
    await delay();
    useDealStore.getState().addDeal(data);
    return { success: true };
  },

  update: async (id, data) => {
    await delay();
    useDealStore.getState().updateDeal(id, data);
    return { success: true };
  },

  delete: async (id) => {
    await delay();
    useDealStore.getState().deleteDeal(id);
    return { success: true };
  },

  toggleActive: async (id) => {
    await delay(100);
    useDealStore.getState().toggleActive(id);
    return { success: true };
  },

  toggleFeatured: async (id) => {
    await delay(100);
    useDealStore.getState().toggleFeatured(id);
    return { success: true };
  },
};

// ────────────────────────────────────────────────────────────────────────────
// Reviews
// ────────────────────────────────────────────────────────────────────────────
export const reviewApi = {
  getAll: async () => {
    await delay();
    return useReviewStore.getState().reviews;
  },

  getById: async (id) => {
    await delay(100);
    return useReviewStore.getState().getReview(id);
  },

  create: async (data) => {
    await delay();
    useReviewStore.getState().addReview(data);
    return { success: true };
  },

  update: async (id, data) => {
    await delay();
    useReviewStore.getState().updateReview(id, data);
    return { success: true };
  },

  delete: async (id) => {
    await delay();
    useReviewStore.getState().deleteReview(id);
    return { success: true };
  },

  toggleFeatured: async (id) => {
    await delay(100);
    useReviewStore.getState().toggleFeatured(id);
    return { success: true };
  },

  toggleActive: async (id) => {
    await delay(100);
    useReviewStore.getState().toggleActive(id);
    return { success: true };
  },
};

// ────────────────────────────────────────────────────────────────────────────
// Banners
// ────────────────────────────────────────────────────────────────────────────
export const bannerApi = {
  getAll: async () => {
    await delay();
    return useBannerStore.getState().banners;
  },

  getById: async (id) => {
    await delay(100);
    return useBannerStore.getState().getBanner(id);
  },

  create: async (data) => {
    await delay();
    useBannerStore.getState().addBanner(data);
    return { success: true };
  },

  update: async (id, data) => {
    await delay();
    useBannerStore.getState().updateBanner(id, data);
    return { success: true };
  },

  delete: async (id) => {
    await delay();
    useBannerStore.getState().deleteBanner(id);
    return { success: true };
  },

  toggleVisible: async (id) => {
    await delay(100);
    useBannerStore.getState().toggleVisible(id);
    return { success: true };
  },

  /** Swap display order of two banners */
  reorder: async (idA, idB) => {
    await delay(100);
    useBannerStore.getState().reorderBanners(idA, idB);
    return { success: true };
  },
};
