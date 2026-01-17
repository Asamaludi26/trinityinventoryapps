import {
  AssetStatus,
  AssetReturnStatus,
  CustomerStatus,
  ItemStatus,
  LoanRequestStatus,
} from "../types";

/**
 * Mendapatkan class CSS untuk status aset.
 * Menggunakan Tailwind utilities dengan semantic color mapping.
 */
export const getAssetStatusClass = (status: AssetStatus | string): string => {
  switch (status) {
    case AssetStatus.IN_USE:
      return "bg-info-light text-info-text";
    case AssetStatus.IN_CUSTODY:
      return "bg-purple-100 text-purple-800 border border-purple-200";
    case AssetStatus.IN_STORAGE:
      return "bg-gray-100 text-gray-800";
    case AssetStatus.UNDER_REPAIR:
      return "bg-blue-100 text-blue-700";
    case AssetStatus.OUT_FOR_REPAIR:
      return "bg-purple-100 text-purple-700";
    case AssetStatus.DAMAGED:
      return "bg-warning-light text-warning-text";
    case AssetStatus.DECOMMISSIONED:
      return "bg-red-200 text-red-800";
    case AssetStatus.AWAITING_RETURN:
      return "bg-amber-100 text-amber-700 border border-amber-200";
    case AssetStatus.CONSUMED:
      return "bg-slate-200 text-slate-600 border border-slate-300";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

/**
 * Mendapatkan class CSS untuk status pelanggan.
 */
export const getCustomerStatusClass = (
  status: CustomerStatus | string,
): string => {
  switch (status) {
    case CustomerStatus.ACTIVE:
      return "bg-success-light text-success-text";
    case CustomerStatus.INACTIVE:
      return "bg-gray-200 text-gray-800";
    case CustomerStatus.SUSPENDED:
      return "bg-warning-light text-warning-text";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

/**
 * Mendapatkan class CSS untuk status request/item.
 */
export const getRequestStatusClass = (status: ItemStatus | string): string => {
  switch (status) {
    case ItemStatus.PENDING:
      return "bg-warning-light text-warning-text";
    case ItemStatus.LOGISTIC_APPROVED:
      return "bg-info-light text-info-text";
    case ItemStatus.AWAITING_CEO_APPROVAL:
      return "bg-purple-100 text-purple-700";
    case ItemStatus.APPROVED:
      return "bg-sky-100 text-sky-700";
    case ItemStatus.PURCHASING:
      return "bg-blue-100 text-blue-700";
    case ItemStatus.IN_DELIVERY:
      return "bg-purple-100 text-purple-700";
    case ItemStatus.ARRIVED:
      return "bg-teal-100 text-teal-700";
    case ItemStatus.COMPLETED:
      return "bg-success-light text-success-text";
    case ItemStatus.REJECTED:
      return "bg-danger-light text-danger-text";
    case ItemStatus.CANCELLED:
      return "bg-gray-200 text-gray-700";
    case ItemStatus.AWAITING_HANDOVER:
      return "bg-emerald-100 text-emerald-700";
    case ItemStatus.IN_PROGRESS:
      return "bg-gray-200 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

/**
 * Mendapatkan class CSS untuk status loan request.
 */
export const getLoanRequestStatusClass = (
  status: LoanRequestStatus | string,
): string => {
  switch (status) {
    case LoanRequestStatus.PENDING:
      return "bg-warning-light text-warning-text";
    case LoanRequestStatus.APPROVED:
      return "bg-sky-100 text-sky-700";
    case LoanRequestStatus.ON_LOAN:
      return "bg-info-light text-info-text";
    case LoanRequestStatus.RETURNED:
      return "bg-success-light text-success-text";
    case LoanRequestStatus.REJECTED:
      return "bg-danger-light text-danger-text";
    case LoanRequestStatus.OVERDUE:
      return "bg-red-100 text-red-700 border border-red-200";
    case LoanRequestStatus.AWAITING_RETURN:
      return "bg-amber-100 text-amber-700";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

/**
 * Mendapatkan class CSS untuk status pengembalian aset.
 */
export const getReturnStatusClass = (
  status: AssetReturnStatus | string,
): string => {
  switch (status) {
    case AssetReturnStatus.PENDING_APPROVAL:
      return "bg-warning-light text-warning-text";
    case AssetReturnStatus.APPROVED:
      return "bg-sky-100 text-sky-700";
    case AssetReturnStatus.COMPLETED:
      return "bg-success-light text-success-text";
    case AssetReturnStatus.REJECTED:
      return "bg-danger-light text-danger-text";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

/**
 * Mendapatkan label yang lebih user-friendly untuk status.
 */
export const getStatusLabel = (status: string): string => {
  const statusLabels: Record<string, string> = {
    [AssetStatus.IN_STORAGE]: "Di Gudang",
    [AssetStatus.IN_USE]: "Digunakan",
    [AssetStatus.IN_CUSTODY]: "Dipegang",
    [AssetStatus.UNDER_REPAIR]: "Dalam Perbaikan",
    [AssetStatus.OUT_FOR_REPAIR]: "Di Service",
    [AssetStatus.DAMAGED]: "Rusak",
    [AssetStatus.DECOMMISSIONED]: "Diberhentikan",
    [AssetStatus.AWAITING_RETURN]: "Menunggu Kembali",
    [AssetStatus.CONSUMED]: "Habis",
  };
  return statusLabels[status] || status;
};
