import React, { useState, useEffect, useMemo } from 'react';
import { Division, User, Page, PreviewData } from '../../../types';
import Modal from '../../../components/ui/Modal';
import { PencilIcon } from '../../../components/icons/PencilIcon';
import { useNotification } from '../../../providers/NotificationProvider';
import { TrashIcon } from '../../../components/icons/TrashIcon';
import { useSortableData, SortConfig } from '../../../hooks/useSortableData';
import { SortAscIcon } from '../../../components/icons/SortAscIcon';
import { SortDescIcon } from '../../../components/icons/SortDescIcon';
import { SortIcon } from '../../../components/icons/SortIcon';
import { exportToCSV } from '../../../utils/csvExporter';
import { Checkbox } from '../../../components/ui/Checkbox';
import { ExportIcon } from '../../../components/icons/ExportIcon';
import { useLongPress } from '../../../hooks/useLongPress';
import { SpinnerIcon } from '../../../components/icons/SpinnerIcon';
import { SearchIcon } from '../../../components/icons/SearchIcon';
import { PaginationControls } from '../../../components/ui/PaginationControls';
import { useMasterDataStore } from '../../../stores/useMasterDataStore';
import { useAssetStore } from '../../../stores/useAssetStore';

interface DivisionListPageProps {
    currentUser: User;
    setActivePage: (page: Page, initialState?: any) => void;
    onShowPreview: (data: PreviewData) => void;
}

interface DivisionWithStats extends Division {
    memberCount: number;
    totalAssets: number;
}

export const DivisionListPage: React.FC<DivisionListPageProps> = ({ currentUser, setActivePage }) => {
    const users = useMasterDataStore((state) => state.users);
    const divisions = useMasterDataStore((state) => state.divisions);
    const assets = useAssetStore((state) => state.assets);
    const deleteDivisionStore = useMasterDataStore((state) => state.deleteDivision);

    const [divisionToDelete, setDivisionToDelete] = useState<Division | null>(null);
    const [isBulkSelectMode, setIsBulkSelectMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDivisionIds, setSelectedDivisionIds] = useState<number[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [divisionSearchQuery, setDivisionSearchQuery] = useState('');

    const addNotification = useNotification();

    const divisionsWithData = useMemo<DivisionWithStats[]>(() => divisions.map(division => {
        const members = users.filter(u => u.divisionId === division.id);
        const memberNames = members.map(m => m.name);
        const totalAssets = assets.filter(a => a.currentUser && memberNames.includes(a.currentUser)).length;
        return {
            ...division,
            memberCount: members.length,
            totalAssets: totalAssets,
        };
    }), [divisions, users, assets]);

    const filteredDivisions = useMemo<DivisionWithStats[]>(() => {
        return divisionsWithData.filter(d => d.name.toLowerCase().includes(divisionSearchQuery.toLowerCase()));
    }, [divisionsWithData, divisionSearchQuery]);

    const { items: sortedDivisions, requestSort: requestDivisionSort, sortConfig: divisionSortConfig } = useSortableData<DivisionWithStats>(filteredDivisions, { key: 'name', direction: 'ascending' });
    
    const totalDivisionItems = sortedDivisions.length;
    const totalDivisionPages = Math.ceil(totalDivisionItems / itemsPerPage);
    const divisionStartIndex = (currentPage - 1) * itemsPerPage;
    const divisionEndIndex = divisionStartIndex + itemsPerPage;
    const paginatedDivisions = sortedDivisions.slice(divisionStartIndex, divisionEndIndex);

    useEffect(() => {
        setCurrentPage(1);
    }, [itemsPerPage, divisionSearchQuery]);
    
    const handleDeleteDivision = async () => {
        if (!divisionToDelete) return;
        setIsLoading(true);
        try {
            await deleteDivisionStore(divisionToDelete.id);
            addNotification(`Divisi ${divisionToDelete.name} berhasil dihapus.`, 'success');
        } catch (error) {
             addNotification('Gagal menghapus divisi.', 'error');
        } finally {
            setDivisionToDelete(null);
            setIsLoading(false);
        }
    };
    
    const handleItemsPerPageChange = (newSize: number) => {
        setItemsPerPage(newSize);
        setCurrentPage(1);
    };

    const handleCancelBulkMode = () => {
        setIsBulkSelectMode(false);
        setSelectedDivisionIds([]);
    };
    
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                handleCancelBulkMode();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);
    
    const handleExport = () => {
        const dataToExport = sortedDivisions.map(d => ({...d, memberCount: users.filter(u => u.divisionId === d.id).length }));
        exportToCSV(dataToExport, 'daftar_divisi');
    };
    
    const longPressHandlers = useLongPress(() => setIsBulkSelectMode(true), 500);

    const SortableDivisionHeader: React.FC<any> = ({ children, columnKey, sortConfig, requestSort, className }) => {
        const isSorted = sortConfig?.key === columnKey;
        const direction = isSorted ? sortConfig.direction : undefined;
        const getSortIcon = () => {
            if (!isSorted) return <SortIcon className="w-4 h-4 text-gray-400" />;
            if (direction === 'ascending') return <SortAscIcon className="w-4 h-4 text-tm-accent" />;
            return <SortDescIcon className="w-4 h-4 text-tm-accent" />;
        };
        return (
            <th scope="col" className={`px-6 py-3 text-sm font-semibold tracking-wider text-left text-gray-500 ${className}`}>
                <button onClick={() => requestSort(columnKey)} className="flex items-center space-x-1 group">
                    <span>{children}</span>
                    <span className="opacity-50 group-hover:opacity-100">{getSortIcon()}</span>
                </button>
            </th>
        );
    };

    return (
        <div className="p-4 sm:p-6 md:p-8">
            <div className="flex flex-col items-start justify-between gap-4 mb-6 md:flex-row md:items-center">
                <h1 className="text-3xl font-bold text-tm-dark">Manajemen Divisi</h1>
                <div className="flex items-center space-x-2">
                    <button onClick={handleExport} className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-white border rounded-lg shadow-sm hover:bg-gray-50">
                        <ExportIcon className="w-4 h-4"/> Export CSV
                    </button>
                    <button
                        onClick={() => setActivePage('division-form')}
                        className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 rounded-lg shadow-sm bg-tm-primary hover:bg-tm-primary-hover"
                    >
                        Tambah Divisi
                    </button>
                </div>
            </div>

            <div className="p-4 mb-4 bg-white border border-gray-200/80 rounded-xl shadow-md">
                <div className="relative">
                    <SearchIcon className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 top-1/2 left-3" />
                    <input type="text" placeholder="Cari nama divisi..." value={divisionSearchQuery} onChange={e => setDivisionSearchQuery(e.target.value)} className="w-full h-10 py-2 pl-10 pr-4 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-tm-accent focus:border-tm-accent" />
                </div>
            </div>

            {isBulkSelectMode && (
                <div className="p-4 mb-4 bg-blue-50 border-l-4 border-tm-accent rounded-r-lg">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="text-sm font-medium text-tm-primary">{selectedDivisionIds.length} item terpilih</span>
                            <div className="h-5 border-l border-gray-300"></div>
                            <button onClick={() => setIsBulkSelectMode(false)} className="px-3 py-1.5 text-sm font-semibold text-red-600 bg-red-100 rounded-md hover:bg-red-200">Hapus</button>
                        </div>
                        <button onClick={handleCancelBulkMode} className="px-3 py-1.5 text-sm font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">Batal</button>
                    </div>
                </div>
            )}

            <div className="overflow-hidden bg-white border border-gray-200/80 rounded-xl shadow-md">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {isBulkSelectMode && <th className="px-6 py-3"><Checkbox checked={selectedDivisionIds.length > 0 && selectedDivisionIds.length === paginatedDivisions.length} onChange={e => setSelectedDivisionIds(e.target.checked ? paginatedDivisions.map(d => d.id) : [])} /></th>}
                                <SortableDivisionHeader columnKey="name" sortConfig={divisionSortConfig} requestSort={requestDivisionSort}>Nama Divisi</SortableDivisionHeader>
                                <SortableDivisionHeader columnKey="memberCount" sortConfig={divisionSortConfig} requestSort={requestDivisionSort}>Jumlah Anggota</SortableDivisionHeader>
                                <SortableDivisionHeader columnKey="totalAssets" sortConfig={divisionSortConfig} requestSort={requestDivisionSort}>Total Aset</SortableDivisionHeader>
                                <th className="relative px-6 py-3"><span className="sr-only">Aksi</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {paginatedDivisions.map(division => (
                                <tr key={division.id} {...longPressHandlers} onClick={() => isBulkSelectMode ? setSelectedDivisionIds(prev => prev.includes(division.id) ? prev.filter(id => id !== division.id) : [...prev, division.id]) : setActivePage('division-detail', { divisionId: division.id })} className={`cursor-pointer transition-colors ${selectedDivisionIds.includes(division.id) ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                                    {isBulkSelectMode && <td className="px-6 py-4" onClick={e => e.stopPropagation()}><Checkbox checked={selectedDivisionIds.includes(division.id)} onChange={() => setSelectedDivisionIds(prev => prev.includes(division.id) ? prev.filter(id => id !== division.id) : [...prev, division.id])} /></td>}
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">{division.name}</td>
                                    <td className="px-6 py-4 text-sm text-center text-gray-700 whitespace-nowrap">{division.memberCount}</td>
                                    <td className="px-6 py-4 text-sm text-center text-gray-700 whitespace-nowrap">{division.totalAssets}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button onClick={(e) => { e.stopPropagation(); setActivePage('division-form', { editingDivision: division }); }} className="p-2 text-gray-500 rounded-full hover:bg-yellow-100 hover:text-yellow-600"><PencilIcon className="w-4 h-4"/></button>
                                            <button onClick={(e) => { e.stopPropagation(); setDivisionToDelete(division); }} className="p-2 text-gray-500 rounded-full hover:bg-red-100 hover:text-red-600"><TrashIcon className="w-4 h-4"/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <PaginationControls currentPage={currentPage} totalPages={totalDivisionPages} totalItems={totalDivisionItems} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage} onItemsPerPageChange={handleItemsPerPageChange} startIndex={divisionStartIndex} endIndex={divisionEndIndex} />
            </div>
            
            {divisionToDelete && <Modal isOpen={!!divisionToDelete} onClose={() => setDivisionToDelete(null)} title="Konfirmasi Hapus Divisi" size="md">
                <p className="text-sm text-gray-600">Anda yakin ingin menghapus divisi <strong>{divisionToDelete.name}</strong>? Aksi ini tidak dapat diurungkan.</p>
                <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                    <button onClick={() => setDivisionToDelete(null)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50">Batal</button>
                    <button onClick={handleDeleteDivision} disabled={isLoading} className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-danger rounded-lg shadow-sm hover:bg-red-700">
                        {isLoading && <SpinnerIcon className="w-4 h-4 mr-2"/>} Hapus
                    </button>
                </div>
            </Modal>}
        </div>
    );
};

