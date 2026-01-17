import React from "react";
import { TrinitiLogoIcon } from "../icons/TrinitiLogoIcon";

export const Letterhead: React.FC = () => (
  <div className="mb-6 pb-4 border-b-2 border-gray-900">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <TrinitiLogoIcon className="w-12 h-12 text-primary-600" />
        <div>
          <h1 className="text-xl font-bold tracking-wide text-gray-900">
            PT. TRINITI MEDIA INDONESIA
          </h1>
          <p className="text-xs text-gray-500">
            Jl. Bojong Raya No. 6, Rawa Buaya, Cengkareng, Jakarta Barat 11740
          </p>
        </div>
      </div>
      <div className="text-right text-xs text-gray-500">
        <p>Telp: (021) 123-4567</p>
        <p>Email: info@trinitimedia.com</p>
      </div>
    </div>
  </div>
);
