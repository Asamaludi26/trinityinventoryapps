"use client";

import type React from "react";
import { ChevronLeftIcon } from "../icons/ChevronLeftIcon";
import { ChevronRightIcon } from "../icons/ChevronRightIcon";
import { ChevronsLeftIcon } from "../icons/ChevronsLeftIcon";
import { ChevronsRightIcon } from "../icons/ChevronsRightIcon";
import { CustomSelect } from "./CustomSelect";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (newPage: number) => void;
  onItemsPerPageChange: (newSize: number) => void;
  startIndex: number;
  endIndex: number;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  startIndex,
  endIndex,
}) => {
  const startItem = totalItems > 0 ? startIndex + 1 : 0;
  const endItem = Math.min(endIndex, totalItems);

  const itemsPerPageOptions = [
    { value: "10", label: "10" },
    { value: "25", label: "25" },
    { value: "50", label: "50" },
    { value: "100", label: "100" },
  ];

  return (
    <div className="flex flex-col items-center justify-between gap-4 px-4 py-3 border-t border-slate-200 bg-slate-50/50 sm:flex-row">
      {/* Items per page selector */}
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <span>Tampilkan</span>
        <div className="w-20">
          <CustomSelect
            options={itemsPerPageOptions}
            value={itemsPerPage.toString()}
            onChange={(value) => onItemsPerPageChange(Number(value))}
            direction="up"
          />
        </div>
        <span>per halaman</span>
      </div>

      {/* Results info */}
      <span className="text-sm text-slate-600">
        Menampilkan{" "}
        <span className="font-semibold text-slate-900">{startItem}</span>
        <span className="mx-0.5">-</span>
        <span className="font-semibold text-slate-900">{endItem}</span>
        <span className="mx-1">dari</span>
        <span className="font-semibold text-slate-900">{totalItems}</span> hasil
      </span>

      {/* Navigation buttons */}
      <div className="flex items-center gap-1">
        {/* First page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="inline-flex items-center justify-center w-8 h-8 text-slate-500 transition-all duration-150 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
          aria-label="Halaman pertama"
        >
          <ChevronsLeftIcon className="w-4 h-4" />
        </button>

        {/* Previous page */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="inline-flex items-center justify-center w-8 h-8 text-slate-500 transition-all duration-150 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
          aria-label="Halaman sebelumnya"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </button>

        {/* Page indicator */}
        <div className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg mx-1">
          <span>{currentPage}</span>
          <span className="mx-1 text-slate-400">/</span>
          <span>{totalPages || 1}</span>
        </div>

        {/* Next page */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="inline-flex items-center justify-center w-8 h-8 text-slate-500 transition-all duration-150 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
          aria-label="Halaman selanjutnya"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </button>

        {/* Last page */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="inline-flex items-center justify-center w-8 h-8 text-slate-500 transition-all duration-150 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
          aria-label="Halaman terakhir"
        >
          <ChevronsRightIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
