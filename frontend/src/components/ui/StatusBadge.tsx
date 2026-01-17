import React from "react";
import {
  BsCheckCircleFill,
  BsXCircleFill,
  BsClockFill,
  BsExclamationCircleFill,
  BsDashCircleFill,
  BsPlayCircleFill,
  BsArchiveFill,
  BsBoxArrowInDown,
} from "react-icons/bs";

type StatusIntent =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral"
  | "purple"
  | "indigo"
  | "orange"
  | "slate";

interface StatusBadgeProps {
  status: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  icon?: boolean;
}

/**
 * Mapping status text ke intent warna dan label.
 * Menggunakan fuzzy matching untuk fleksibilitas.
 */
const getStatusConfig = (
  status: string,
): { intent: StatusIntent; label: string } => {
  const s = status.toLowerCase();

  // Success states - completed, approved, returned, active
  if (
    [
      "active",
      "completed",
      "approved",
      "disetujui",
      "selesai",
      "arrived",
      "returned",
      "diterima",
      "dikembalikan",
    ].some((k) => s.includes(k)) &&
    !s.includes("awaiting") &&
    !s.includes("menunggu")
  )
    return { intent: "success", label: status };

  // Warning states - pending, awaiting, on_loan
  if (
    [
      "pending",
      "menunggu",
      "awaiting",
      "on_loan",
      "dipinjam",
      "under_repair",
      "dalam perbaikan",
    ].some((k) => s.includes(k))
  )
    return { intent: "warning", label: status };

  // Danger states - rejected, cancelled, damaged, overdue
  if (
    [
      "rejected",
      "cancelled",
      "damaged",
      "rusak",
      "ditolak",
      "dibatalkan",
      "overdue",
      "terlambat",
      "diberhentikan",
      "decommissioned",
    ].some((k) => s.includes(k))
  )
    return { intent: "danger", label: status };

  // Info states - in_progress, purchasing, delivery
  if (
    [
      "in_progress",
      "purchasing",
      "delivery",
      "dikirim",
      "maintenance",
      "proses",
    ].some((k) => s.includes(k))
  )
    return { intent: "info", label: status };

  // Indigo states - in_use, used
  if (["in_use", "digunakan", "terpasang"].some((k) => s.includes(k)))
    return { intent: "indigo", label: status };

  // Purple states - custody, out_for_repair
  if (
    ["custody", "dipegang", "out_for_repair", "keluar", "service"].some((k) =>
      s.includes(k),
    )
  )
    return { intent: "purple", label: status };

  // Slate states - consumed, habis
  if (["consumed", "habis", "terpakai"].some((k) => s.includes(k)))
    return { intent: "slate", label: status };

  // Neutral states - in_storage, default
  if (
    ["in_storage", "di gudang", "disimpan", "inactive", "non-aktif"].some((k) =>
      s.includes(k),
    )
  )
    return { intent: "neutral", label: status };

  return { intent: "neutral", label: status };
};

const styleMap: Record<StatusIntent, string> = {
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  danger: "bg-rose-50 text-rose-700 border-rose-200",
  info: "bg-sky-50 text-sky-700 border-sky-200",
  neutral: "bg-slate-100 text-slate-600 border-slate-200",
  purple: "bg-purple-50 text-purple-700 border-purple-200",
  indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
  orange: "bg-orange-50 text-orange-700 border-orange-200",
  slate: "bg-slate-200 text-slate-700 border-slate-300",
};

const iconMap: Record<StatusIntent, React.FC<any>> = {
  success: BsCheckCircleFill,
  warning: BsClockFill,
  danger: BsXCircleFill,
  info: BsPlayCircleFill,
  neutral: BsArchiveFill,
  purple: BsExclamationCircleFill,
  indigo: BsCheckCircleFill,
  orange: BsExclamationCircleFill,
  slate: BsBoxArrowInDown,
};

const sizeClasses: Record<"sm" | "md" | "lg", string> = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-2.5 py-1 text-xs",
  lg: "px-3 py-1.5 text-sm",
};

/**
 * Komponen badge status dengan styling semantik otomatis.
 * Mendukung icon opsional dan multiple size variants.
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className = "",
  size = "sm",
  icon = false,
}) => {
  const { intent, label } = getStatusConfig(status);
  const styleClass = styleMap[intent];
  const Icon = iconMap[intent];
  const sizeClass = sizeClasses[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-wide rounded-full border whitespace-nowrap ${styleClass} ${sizeClass} ${className}`}
      title={label}
    >
      {icon && <Icon className="w-3 h-3 opacity-80 flex-shrink-0" />}
      <span className="truncate">{label}</span>
    </span>
  );
};
