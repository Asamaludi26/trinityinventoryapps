import React from 'react';
import { Asset, PreviewData } from '../../../../types';
import { useLongPress } from '../../../../hooks/useLongPress';
import { Checkbox } from '../../../../components/ui/Checkbox';
import { SortableHeader } from './SortableHeader';
import { SortConfig } from '../../../../hooks/useSortableData';
import { PencilIcon } from '../../../../components/icons/PencilIcon';
import { CustomerIcon } from '../../../../components/icons/CustomerIcon';
import { ClickableLink } from '../../../../components/ui/ClickableLink';
import { getStatusClass } from '../../utils';
import { EyeIcon } from '../../../../components/icons/EyeIcon';
import { TrashIcon } from '../../../../components/icons/TrashIcon';
import { InboxIcon } from '../../../../components/icons/InboxIcon';

interface RegistrationTableProps {
    assets: Asset[];
    onDetailClick: (asset: Asset) => void;
    onDeleteClick: (id: string) => void;
    sortConfig: SortConfig<Asset> | null;
    requestSort: (key: keyof Asset) => void;
    selectedAssetIds: string[];
    onSelectOne: (id: string) => void;
    onSelectAll: (event: React.ChangeEvent<HTMLInputElement>) => void;
    isBulkSelectMode: boolean;
    onEnterBulkMode: () => void;
    onShowPreview: (data: PreviewData) => void;
}

export const RegistrationTable: React.FC<RegistrationTableProps> = ({ assets, onDetailClick, onDeleteClick, sortConfig, requestSort, selectedAssetIds, onSelectOne, onSelectAll, isBulkSelectMode, onEnterBulkMode, onShowPreview }) => {
    const longPressHandlers = useLongPress(onEnterBulkMode, 500);
    const handleRowClick = (asset: Asset) => {
        if (isBulkSelectMode) {
            onSelectOne(asset.id);
        } else {
            onDetailClick(asset);
        }
    };

    return (
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="sticky top-0 z-10 bg-gray-50">
                <tr>
                    {isBulkSelectMode && (
                        <th scope="col" className="px-6 py-3"><Checkbox checked={selectedAssetIds.length === assets.length && assets.length > 0} onChange={onSelectAll} aria-label="Pilih semua aset" /></th>
                    )}
                    <SortableHeader columnKey="name" sortConfig={sortConfig} requestSort={requestSort}>Aset</SortableHeader>
                    <SortableHeader columnKey="location" sortConfig={sortConfig} requestSort={requestSort}>Lokasi / Pengguna</SortableHeader>
                    <SortableHeader columnKey="status" sortConfig={sortConfig} requestSort={requestSort}>Status</SortableHeader>
                    <th className="relative px-6 py-3"><span className="sr-only">Aksi</span></th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {assets.length > 0 ? (
                    assets.map((asset) => (
                        <tr key={asset.id} {...longPressHandlers} onClick={() => handleRowClick(asset)} className={`transition-colors cursor-pointer ${selectedAssetIds.includes(asset.id) ? 'bg-blue-50' : asset.isDismantled ? 'bg-amber-50 hover:bg-amber-100' : 'hover:bg-gray-50'}`}>
                            {isBulkSelectMode && (
                                <td className="px-6 py-4 align-top" onClick={(e) => e.stopPropagation()}><Checkbox checked={selectedAssetIds.includes(asset.id)} onChange={() => onSelectOne(asset.id)} /></td>
                            )}
                            <td className="px-6 py-4 lg:whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-gray-900">{asset.name}</span>
                                    {asset.lastModifiedDate && <span title={`Diubah: ${new Date(asset.lastModifiedDate).toLocaleString('id-ID')} oleh ${asset.lastModifiedBy}`}><PencilIcon className="w-3.5 h-3.5 text-gray-400" /></span>}
                                    {asset.isDismantled && <span className="px-2 py-0.5 text-xs font-semibold text-amber-800 bg-amber-100 rounded-full">Dismantled</span>}
                                </div>
                                <div className="text-xs text-gray-500">{asset.id} &bull; {asset.category}</div>
                            </td>
                            <td className="px-6 py-4 lg:whitespace-nowrap">
                                {asset.currentUser && asset.currentUser.startsWith('TMI-') ? (
                                    <div className="flex items-center gap-2">
                                        <CustomerIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                        <div><div className="text-sm font-medium text-tm-dark"><ClickableLink onClick={() => onShowPreview({ type: 'customer', id: asset.currentUser! })}>Pelanggan: {asset.currentUser}</ClickableLink></div></div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="text-sm font-medium text-gray-800">{asset.location || '-'}</div>
                                        <div className="text-xs text-gray-500">{asset.currentUser || 'Tidak ada pengguna'}</div>
                                    </>
                                )}
                            </td>
                            <td className="px-6 py-4 lg:whitespace-nowrap">
                                <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(asset.status)}`}>{asset.status}</span>
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-right lg:whitespace-nowrap">
                                <div className="flex items-center justify-end space-x-2">
                                   <button onClick={(e) => { e.stopPropagation(); onDetailClick(asset); }} className="flex items-center justify-center w-8 h-8 text-gray-500 transition-colors bg-gray-100 rounded-full hover:bg-info-light hover:text-info-text" title="Lihat Detail"><EyeIcon className="w-5 h-5"/></button>
                                    <button onClick={(e) => { e.stopPropagation(); onDeleteClick(asset.id); }} className="flex items-center justify-center w-8 h-8 text-gray-500 transition-colors bg-gray-100 rounded-full hover:bg-danger-light hover:text-danger-text" title="Hapus"><TrashIcon className="w-5 h-5"/></button>
                                </div>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr><td colSpan={isBulkSelectMode ? 5 : 4} className="px-6 py-12 text-center text-gray-500"><div className="flex flex-col items-center"><InboxIcon className="w-12 h-12 text-gray-400" /><h3 className="mt-2 text-sm font-medium text-gray-900">Tidak Ada Data Aset</h3><p className="mt-1 text-sm text-gray-500">Ubah filter atau buat aset baru.</p></div></td></tr>
                )}
            </tbody>
        </table>
    );
};
