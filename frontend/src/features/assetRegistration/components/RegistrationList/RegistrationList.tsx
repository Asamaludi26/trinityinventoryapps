import { Asset, AssetStatus, AssetCondition, PreviewData, Page, AssetCategory, Request, RequestItem } from '../../../../types';

export const RegistrationList: React.FC<RegistrationListProps> = ({ assets, categories, onDetailClick, onDeleteClick, onAddClick, onShowPreview }) => {
    // ...
    const statusFilterOptions = Object.values(AssetStatus).map(s => ({ value: s, label: s }));
    const conditionFilterOptions = Object.values(AssetCondition).map(c => ({ value: c, label: c }));
    // ...
};