
import React, { useRef, useState } from 'react';
import Modal from '../../../components/ui/Modal';
import { Asset } from '../../../types';
import { AssetLabel } from '../../../components/ui/AssetLabel';
import { PrintIcon } from '../../../components/icons/PrintIcon';
import { SpinnerIcon } from '../../../components/icons/SpinnerIcon';

interface BulkLabelModalProps {
    isOpen: boolean;
    onClose: () => void;
    assets: Asset[];
}

export const BulkLabelModal: React.FC<BulkLabelModalProps> = ({ isOpen, onClose, assets }) => {
    const printRef = useRef<HTMLDivElement>(null);
    const [isPreparing, setIsPreparing] = useState(false);

    const handlePrint = () => {
        const printContent = printRef.current;
        if (!printContent) return;

        setIsPreparing(true);

        // 1. Create a hidden iframe
        const iframe = document.createElement('iframe');
        iframe.style.position = 'absolute';
        iframe.style.width = '0px';
        iframe.style.height = '0px';
        iframe.style.border = 'none';
        document.body.appendChild(iframe);

        const doc = iframe.contentWindow?.document;
        if (!doc) {
            setIsPreparing(false);
            return;
        }

        // 2. Gather Styles
        // Copy existing styles (Tailwind) + Add Custom Print CSS
        const styles = document.querySelectorAll('style, link[rel="stylesheet"]');
        let styleTags = '';
        styles.forEach(node => { styleTags += node.outerHTML; });
        
        // CSS Khusus Cetak (A4 Standard)
        const printCss = `
            <style>
                @media print {
                    @page { 
                        size: A4 portrait; 
                        margin: 10mm; 
                    }
                    body { 
                        background-color: white !important; 
                        -webkit-print-color-adjust: exact; 
                        print-color-adjust: exact;
                        font-family: 'Inter', sans-serif;
                        margin: 0;
                        padding: 0;
                    }
                    .print-container {
                        display: grid;
                        grid-template-columns: 1fr 1fr; /* 2 Kolom */
                        gap: 4mm; /* Jarak antar label */
                        width: 100%;
                    }
                    .asset-label-wrapper {
                        break-inside: avoid;
                        page-break-inside: avoid; /* Mencegah label terpotong antar halaman */
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        padding: 1mm;
                        border: 1px dashed #e5e7eb; /* Border tipis untuk panduan potong */
                        border-radius: 4px;
                    }
                    /* Hapus shadow/border UI saat print */
                    .print-clean {
                        box-shadow: none !important;
                        border: 2px solid #000 !important;
                    }
                }
            </style>
        `;

        // 3. Write Content to Iframe
        doc.open();
        doc.write(`
            <html>
                <head>
                    ${styleTags}
                    ${printCss}
                </head>
                <body>
                    <div class="print-container">
                        ${printContent.innerHTML}
                    </div>
                </body>
            </html>
        `);
        doc.close();

        // 4. Wait for resources to load (images/fonts) then Print
        iframe.onload = () => {
            // Small buffer to ensure rendering is complete
            setTimeout(() => {
                iframe.contentWindow?.focus();
                iframe.contentWindow?.print();
                setIsPreparing(false);
                
                // Cleanup after print dialog closes (approximate)
                setTimeout(() => {
                    document.body.removeChild(iframe);
                }, 1000);
            }, 500);
        };
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Cetak Label Masal (${assets.length} Item)`}
            size="full" // Fullscreen modal for better preview
            hideDefaultCloseButton
        >
            <div className="flex flex-col h-[85vh]">
                {/* Toolbar */}
                <div className="flex justify-between items-center px-1 pb-4 border-b border-gray-200 mb-4 shrink-0">
                    <div>
                        <p className="text-sm text-gray-600 font-medium">
                            Preview Tata Letak (A4)
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            Estimasi: {Math.ceil(assets.length / 10)} Halaman (10 Label/Halaman). Pastikan margin printer diatur ke 'Default' atau 'Minimum'.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={onClose} 
                            className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            Tutup
                        </button>
                        <button 
                            onClick={handlePrint} 
                            disabled={isPreparing}
                            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-tm-primary rounded-xl shadow-lg hover:bg-tm-primary-hover active:scale-95 transition-all disabled:bg-tm-primary/70"
                        >
                            {isPreparing ? <SpinnerIcon className="w-4 h-4 animate-spin"/> : <PrintIcon className="w-4 h-4" />}
                            {isPreparing ? 'Memproses...' : 'Cetak Sekarang'}
                        </button>
                    </div>
                </div>

                {/* Preview Area (Visual representation of A4) */}
                <div className="flex-1 overflow-y-auto bg-slate-100 p-8 flex justify-center custom-scrollbar">
                    {/* A4 Container Simulation */}
                    <div 
                        ref={printRef} 
                        className="bg-white p-[10mm] w-[210mm] min-h-[297mm] shadow-2xl grid grid-cols-2 gap-[4mm] content-start transform origin-top transition-transform"
                        style={{ height: 'fit-content' }}
                    >
                        {assets.map((asset) => (
                            <div key={asset.id} className="asset-label-wrapper flex justify-center items-center">
                                {/* Pass 'print-clean' class to force specific print styles */}
                                <AssetLabel asset={asset} className="transform scale-[0.95] print-clean" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Modal>
    );
};
