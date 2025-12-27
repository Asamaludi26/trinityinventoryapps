import {
  Asset,
  AssetStatus,
  AssetCondition,
  PreviewData,
  Page,
  AssetCategory,
  Request,
  RequestItem,
} from "../../../../types";

interface RegistrationListProps {
  assets: Asset[];
  categories: AssetCategory[];
  onDetailClick: (asset: Asset) => void;
  onDeleteClick: (asset: Asset) => void;
  onAddClick: () => void;
  onShowPreview: (data: PreviewData) => void;
}

export const RegistrationList: React.FC<RegistrationListProps> = ({
  assets,
  categories,
  onDetailClick,
  onDeleteClick,
  onAddClick,
  onShowPreview,
}) => {
  // ...
  const statusFilterOptions = Object.values(AssetStatus).map((s) => ({
    value: s,
    label: s,
  }));
  const conditionFilterOptions = Object.values(AssetCondition).map((c) => ({
    value: c,
    label: c,
  }));
  // ...
  return (
    <div>
      {/* Add your JSX markup here */}
    </div>
  );
};
