import React, { ReactNode } from "react";
import { InboxIcon } from "../icons/InboxIcon";
import { SearchIcon } from "../icons/SearchIcon";
import { PlusIcon } from "../icons/PlusIcon";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  variant?: "default" | "search" | "error" | "minimal";
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ComponentType<{ className?: string }>;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  children?: ReactNode;
}

const variantConfig = {
  default: {
    containerClass: "py-12",
    iconContainerClass: "bg-gray-100",
    iconClass: "text-gray-400",
    DefaultIcon: InboxIcon,
  },
  search: {
    containerClass: "py-8",
    iconContainerClass: "bg-blue-50",
    iconClass: "text-blue-400",
    DefaultIcon: SearchIcon,
  },
  error: {
    containerClass: "py-10",
    iconContainerClass: "bg-red-50",
    iconClass: "text-red-400",
    DefaultIcon: InboxIcon,
  },
  minimal: {
    containerClass: "py-6",
    iconContainerClass: "bg-gray-50",
    iconClass: "text-gray-300",
    DefaultIcon: InboxIcon,
  },
};

/**
 * EmptyState - Komponen untuk menampilkan state kosong yang konsisten.
 * Mendukung berbagai variant dan customizable actions.
 *
 * @example
 * <EmptyState
 *   title="Tidak ada data"
 *   description="Belum ada data yang tersedia."
 *   action={{ label: "Tambah Baru", onClick: handleAdd }}
 * />
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "Tidak ada data",
  description = "Belum ada data yang tersedia.",
  icon,
  variant = "default",
  action,
  secondaryAction,
  className = "",
  children,
}) => {
  const config = variantConfig[variant];
  const Icon = icon || config.DefaultIcon;
  const ActionIcon = action?.icon || PlusIcon;

  return (
    <div
      className={`flex flex-col items-center justify-center text-center ${config.containerClass} ${className}`}
    >
      <div
        className={`flex items-center justify-center w-16 h-16 mb-4 rounded-full ${config.iconContainerClass}`}
      >
        <Icon className={`w-8 h-8 ${config.iconClass}`} />
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>

      <p className="text-sm text-gray-500 max-w-sm mb-6">{description}</p>

      {children}

      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {action && (
            <button
              onClick={action.onClick}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-tm-primary rounded-lg hover:bg-tm-primary-hover transition-colors shadow-sm"
            >
              <ActionIcon className="w-4 h-4" />
              {action.label}
            </button>
          )}
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Komponen empty state khusus untuk hasil pencarian kosong.
 */
export const SearchEmptyState: React.FC<{
  query: string;
  onClear?: () => void;
}> = ({ query, onClear }) => (
  <EmptyState
    variant="search"
    title="Tidak ditemukan"
    description={`Tidak ada hasil untuk "${query}". Coba kata kunci lain atau periksa ejaan.`}
    secondaryAction={
      onClear ? { label: "Hapus Pencarian", onClick: onClear } : undefined
    }
  />
);

/**
 * Komponen empty state khusus untuk tabel kosong.
 */
export const TableEmptyState: React.FC<{
  itemName?: string;
  onAdd?: () => void;
  addLabel?: string;
}> = ({ itemName = "data", onAdd, addLabel }) => (
  <EmptyState
    variant="minimal"
    title={`Belum ada ${itemName}`}
    description={`${itemName.charAt(0).toUpperCase() + itemName.slice(1)} yang tersedia akan ditampilkan di sini.`}
    action={
      onAdd
        ? {
            label:
              addLabel ||
              `Tambah ${itemName.charAt(0).toUpperCase() + itemName.slice(1)}`,
            onClick: onAdd,
          }
        : undefined
    }
  />
);

export default EmptyState;
