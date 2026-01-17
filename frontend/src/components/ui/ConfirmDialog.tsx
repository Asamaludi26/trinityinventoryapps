import React, { useEffect, useRef, useState, useCallback } from "react";
import { ExclamationTriangleIcon } from "../icons/ExclamationTriangleIcon";
import { TrashIcon } from "../icons/TrashIcon";
import { CloseIcon } from "../icons/CloseIcon";
import { InfoIcon } from "../icons/InfoIcon";

type DialogVariant = "danger" | "warning" | "info";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string | React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: DialogVariant;
  isLoading?: boolean;
  /** Jika true, user harus ketik teks konfirmasi */
  requireConfirmation?: boolean;
  confirmationText?: string;
}

const variantStyles: Record<
  DialogVariant,
  {
    iconBg: string;
    iconColor: string;
    buttonBg: string;
    buttonHover: string;
    Icon: React.ComponentType<{ className?: string }>;
  }
> = {
  danger: {
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    buttonBg: "bg-red-600",
    buttonHover: "hover:bg-red-700",
    Icon: TrashIcon,
  },
  warning: {
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    buttonBg: "bg-amber-600",
    buttonHover: "hover:bg-amber-700",
    Icon: ExclamationTriangleIcon,
  },
  info: {
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    buttonBg: "bg-blue-600",
    buttonHover: "hover:bg-blue-700",
    Icon: InfoIcon,
  },
};

/**
 * ConfirmDialog - Modal konfirmasi untuk aksi berbahaya atau penting.
 * Mendukung berbagai variant dan opsional confirmation text input.
 *
 * @example
 * <ConfirmDialog
 *   isOpen={isDeleteOpen}
 *   onClose={() => setIsDeleteOpen(false)}
 *   onConfirm={handleDelete}
 *   title="Hapus Item?"
 *   message="Aksi ini tidak dapat dibatalkan."
 *   variant="danger"
 * />
 */
export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Konfirmasi",
  cancelLabel = "Batal",
  variant = "warning",
  isLoading = false,
  requireConfirmation = false,
  confirmationText = "HAPUS",
}) => {
  const [confirmInput, setConfirmInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const styles = variantStyles[variant];
  const Icon = styles.Icon;

  const isConfirmDisabled = requireConfirmation
    ? confirmInput !== confirmationText || isSubmitting || isLoading
    : isSubmitting || isLoading;

  // Animation handling
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      requestAnimationFrame(() => setIsAnimating(true));
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setIsVisible(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      setConfirmInput("");
      setTimeout(() => {
        if (requireConfirmation && inputRef.current) {
          inputRef.current.focus();
        } else if (confirmButtonRef.current) {
          confirmButtonRef.current.focus();
        }
      }, 100);
    }
  }, [isOpen, requireConfirmation]);

  // Escape key handler
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleConfirm = useCallback(async () => {
    if (isConfirmDisabled) return;

    setIsSubmitting(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error("[ConfirmDialog] Confirm action failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [isConfirmDisabled, onConfirm, onClose]);

  if (!isVisible && !isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] overflow-y-auto"
      aria-labelledby="confirm-dialog-title"
      role="alertdialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity duration-200 ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`relative w-full max-w-md transform rounded-2xl bg-white text-left shadow-xl transition-all duration-200 ${
            isAnimating
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 translate-y-4"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Tutup"
          >
            <CloseIcon className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div
                className={`flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full ${styles.iconBg}`}
              >
                <Icon className={`w-6 h-6 ${styles.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  id="confirm-dialog-title"
                  className="text-lg font-bold text-gray-900 leading-6"
                >
                  {title}
                </h3>
                <div className="mt-2 text-sm text-gray-600">{message}</div>
              </div>
            </div>

            {/* Confirmation input */}
            {requireConfirmation && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Ketik{" "}
                  <span className="font-bold text-red-600">
                    {confirmationText}
                  </span>{" "}
                  untuk konfirmasi:
                </label>
                <input
                  ref={inputRef}
                  type="text"
                  value={confirmInput}
                  onChange={(e) => setConfirmInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder={confirmationText}
                  autoComplete="off"
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-2xl">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {cancelLabel}
            </button>
            <button
              ref={confirmButtonRef}
              type="button"
              onClick={handleConfirm}
              disabled={isConfirmDisabled}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${styles.buttonBg} ${styles.buttonHover}`}
            >
              {(isSubmitting || isLoading) && (
                <svg
                  className="animate-spin w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              )}
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
