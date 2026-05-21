import { useState, useCallback } from 'react';

/**
 * useConfirm — lightweight imperative confirmation hook.
 *
 * Usage:
 *   const { confirm, confirmState, handleConfirm, handleCancel } = useConfirm();
 *
 *   // Trigger a confirm dialog and await the user's decision:
 *   const handleDelete = async () => {
 *     const ok = await confirm('Are you sure you want to delete this item?');
 *     if (!ok) return;
 *     // proceed with delete...
 *   };
 *
 *   // Render the dialog conditionally using confirmState:
 *   {confirmState.open && (
 *     <ConfirmDialog
 *       message={confirmState.message}
 *       onConfirm={handleConfirm}
 *       onCancel={handleCancel}
 *     />
 *   )}
 */
export function useConfirm() {
  const [state, setState] = useState({
    open: false,
    message: '',
    onConfirm: null,
  });

  /**
   * Open the confirm dialog and return a Promise that resolves to:
   *   true  — user confirmed
   *   false — user cancelled
   */
  const confirm = useCallback((message) => {
    return new Promise((resolve) => {
      setState({ open: true, message, onConfirm: resolve });
    });
  }, []);

  /** Call when the user clicks "Confirm" / "Yes" */
  const handleConfirm = useCallback(() => {
    state.onConfirm?.(true);
    setState({ open: false, message: '', onConfirm: null });
  }, [state]);

  /** Call when the user clicks "Cancel" / "No" / closes the dialog */
  const handleCancel = useCallback(() => {
    state.onConfirm?.(false);
    setState({ open: false, message: '', onConfirm: null });
  }, [state]);

  return {
    /** Open a confirm dialog. Returns a Promise<boolean>. */
    confirm,
    /** Current dialog state — use to drive your dialog component. */
    confirmState: state,
    /** Pass as onConfirm handler to your dialog component. */
    handleConfirm,
    /** Pass as onCancel / onClose handler to your dialog component. */
    handleCancel,
  };
}
