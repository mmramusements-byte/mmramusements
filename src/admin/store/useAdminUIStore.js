import { create } from 'zustand';

export const useAdminUIStore = create((set, get) => ({
  // ── Sidebar state ──────────────────────────────────────────────────────────
  sidebarCollapsed: false,
  mobileOpen: false,

  setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setMobileOpen: (v) => set({ mobileOpen: v }),
  toggleMobileOpen: () => set((state) => ({ mobileOpen: !state.mobileOpen })),

  // ── Toast notifications ────────────────────────────────────────────────────
  toasts: [],

  addToast: (toast) => {
    const id = Date.now();
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, toast.duration || 4000);
    return id;
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  // ── Shorthand toast helpers ────────────────────────────────────────────────
  // Reactive usage in components: const toast = useAdminUIStore(s => s.toast);
  // Imperative usage anywhere:    useAdminUIStore.getState().toast.success(...)
  toast: {
    success: (msg, title) =>
      useAdminUIStore
        .getState()
        .addToast({ type: 'success', message: msg, title: title || 'Success' }),
    error: (msg, title) =>
      useAdminUIStore
        .getState()
        .addToast({ type: 'error', message: msg, title: title || 'Error' }),
    warning: (msg, title) =>
      useAdminUIStore
        .getState()
        .addToast({ type: 'warning', message: msg, title: title || 'Warning' }),
    info: (msg, title) =>
      useAdminUIStore
        .getState()
        .addToast({ type: 'info', message: msg, title: title || 'Info' }),
  },

  // ── Confirm Dialog (built-in, no hook needed) ──────────────────────────────
  confirmDialog: {
    open: false,
    title: '',
    message: '',
    dangerous: true,
    onConfirm: null,
    onCancel: null,
  },

  openConfirm: ({ title, message, dangerous = true, onConfirm, onCancel }) =>
    set({
      confirmDialog: {
        open: true,
        title,
        message,
        dangerous,
        onConfirm: onConfirm ?? null,
        onCancel: onCancel ?? null,
      },
    }),

  closeConfirm: () =>
    set((s) => ({
      confirmDialog: { ...s.confirmDialog, open: false },
    })),

  handleConfirmAction: () => {
    const { confirmDialog } = get();
    if (typeof confirmDialog.onConfirm === 'function') confirmDialog.onConfirm();
    get().closeConfirm();
  },

  handleCancelAction: () => {
    const { confirmDialog } = get();
    if (typeof confirmDialog.onCancel === 'function') confirmDialog.onCancel();
    get().closeConfirm();
  },
}));
