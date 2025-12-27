import { AssetStatus } from "../../types";

export const getStatusClass = (status: AssetStatus) => {
  switch (status) {
    case AssetStatus.IN_USE:
      return "bg-info-light text-info-text";
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
    default:
      return "bg-gray-100 text-gray-800";
  }
};
