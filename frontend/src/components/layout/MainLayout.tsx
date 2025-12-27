"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import type { User, Page, PreviewData } from "../../types";
import { Sidebar } from "./Sidebar";
import { NotificationBell } from "../ui/NotificationBell";
import { MenuIcon } from "../icons/MenuIcon";
import { QrCodeIcon } from "../icons/QrCodeIcon";
import { ChevronDownIcon } from "../icons/ChevronDownIcon";
import { UserCogIcon } from "../icons/UserCogIcon";
import { LogoutIcon } from "../icons/LogoutIcon";
import { CommandPalette } from "../ui/CommandPalette";
import { GlobalScannerModal } from "../ui/GlobalScannerModal";
import { TopLoadingBar } from "../ui/TopLoadingBar";
import { ContentSkeleton } from "../ui/ContentSkeleton";
import PreviewModal from "../ui/PreviewModal";
import { WhatsAppSimulationModal } from "../ui/WhatsAppSimulationModal";

// Stores
import { useUIStore } from "../../stores/useUIStore";

interface MainLayoutProps {
  children: React.ReactNode;
  currentUser: User;
  onLogout: () => void;
  setActivePage: (page: Page, filters?: any) => void;
  onShowPreview: (data: PreviewData) => void;
  onOpenScanner: () => void;
  isGlobalScannerOpen: boolean;
  setIsGlobalScannerOpen: (open: boolean) => void;
  onScanSuccess: (data: any) => void;
  previewData: PreviewData | null;
  setPreviewData: (data: PreviewData | null) => void;
  previewActions: {
    onInitiateHandover: (asset: any) => void;
    onInitiateDismantle: (asset: any) => void;
    onInitiateInstallation: (asset: any) => void;
    onReportDamage: () => void;
    onStartRepair: () => void;
    onMarkAsRepaired: () => void;
    onDecommission: () => void;
    onReceiveFromRepair: () => void;
    onToggleVisibility?: () => void;
    onAddProgressUpdate: () => void;
    onEditItem: (data: any) => void;
  };
}

const getRoleBadgeStyles = (role: User["role"]) => {
  const styles = {
    "Super Admin": "bg-purple-100 text-purple-700 ring-purple-200",
    "Admin Logistik": "bg-sky-100 text-sky-700 ring-sky-200",
    "Admin Purchase": "bg-teal-100 text-teal-700 ring-teal-200",
    Leader: "bg-amber-100 text-amber-700 ring-amber-200",
    Staff: "bg-slate-100 text-slate-700 ring-slate-200",
  };
  return styles[role] || styles["Staff"];
};

const getAvatarColor = (role: User["role"]) => {
  const colors = {
    "Super Admin": "bg-purple-600",
    "Admin Logistik": "bg-sky-600",
    "Admin Purchase": "bg-teal-600",
    Leader: "bg-amber-600",
    Staff: "bg-slate-600",
  };
  return colors[role] || colors["Staff"];
};

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  currentUser,
  onLogout,
  setActivePage,
  onShowPreview,
  onOpenScanner,
  isGlobalScannerOpen,
  setIsGlobalScannerOpen,
  onScanSuccess,
  previewData,
  setPreviewData,
  previewActions,
}) => {
  // UI Store
  const activePage = useUIStore((state) => state.activePage);
  const isPageLoading = useUIStore((state) => state.isPageLoading);
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const setSidebarOpen = useUIStore((state) => state.toggleSidebar);

  // Local UI State
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Command Palette Shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-tm-light flex">
      {/* Top Progress Bar */}
      <TopLoadingBar isLoading={isPageLoading} />

      {/* Sidebar */}
      <Sidebar
        currentUser={currentUser}
        activePage={activePage}
        setActivePage={setActivePage}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-64 transition-all duration-300">
        <header className="sticky top-0 z-20 flex items-center justify-between w-full h-16 px-4 sm:px-6 bg-white/80 backdrop-blur-md border-b border-slate-200/80 no-print">
          {/* Left side - Mobile menu toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all duration-200 md:hidden"
            >
              <MenuIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Command Palette Trigger */}
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="hidden md:flex items-center gap-2 h-9 px-3 text-sm text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all duration-200"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <span className="text-slate-400">Cari...</span>
              <kbd className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 rounded shadow-sm">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button>

            {/* Notification Bell */}
            <NotificationBell
              currentUser={currentUser}
              setActivePage={setActivePage}
              onShowPreview={onShowPreview}
            />

            {/* QR Scanner Button */}
            <button
              onClick={onOpenScanner}
              className="p-2 text-slate-500 hover:text-tm-primary hover:bg-tm-primary-light rounded-xl transition-all duration-200"
              title="Pindai QR Aset"
            >
              <QrCodeIcon className="w-5 h-5" />
            </button>

            {/* Divider */}
            <div className="hidden sm:block w-px h-8 bg-slate-200" />

            {/* Profile Dropdown */}
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={() => setIsProfileDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-50 transition-all duration-200 border border-transparent hover:border-slate-200"
              >
                {/* User info - hidden on mobile */}
                <div className="text-right hidden sm:block">
                  <span className="block text-sm font-semibold text-slate-800 leading-tight">
                    {currentUser.name}
                  </span>
                  <span
                    className={`inline-flex text-[10px] font-medium px-1.5 py-0.5 rounded-md ring-1 ring-inset ${getRoleBadgeStyles(
                      currentUser.role
                    )}`}
                  >
                    {currentUser.role}
                  </span>
                </div>

                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-sm ${getAvatarColor(
                    currentUser.role
                  )}`}
                >
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>

                <ChevronDownIcon
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                    isProfileDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 z-30 w-56 mt-2 origin-top-right bg-white border border-slate-200 rounded-2xl shadow-xl animate-zoom-in overflow-hidden">
                  {/* Mobile user info */}
                  <div className="px-4 py-3 border-b border-slate-100 sm:hidden">
                    <p className="text-sm font-semibold text-slate-800">
                      {currentUser.name}
                    </p>
                    <span
                      className={`inline-flex text-[10px] font-medium mt-1 px-2 py-0.5 rounded-md ring-1 ring-inset ${getRoleBadgeStyles(
                        currentUser.role
                      )}`}
                    >
                      {currentUser.role}
                    </span>
                  </div>

                  {/* Menu items */}
                  <div className="p-1.5">
                    <button
                      onClick={() => {
                        setActivePage("pengaturan-akun");
                        setIsProfileDropdownOpen(false);
                      }}
                      className="flex items-center w-full gap-3 px-3 py-2.5 text-sm text-slate-700 rounded-xl hover:bg-slate-50 hover:text-tm-primary transition-colors"
                    >
                      <UserCogIcon className="w-4 h-4" />
                      <span className="font-medium">Kelola Akun</span>
                    </button>

                    <div className="my-1.5 border-t border-slate-100" />

                    <button
                      onClick={onLogout}
                      className="flex items-center w-full gap-3 px-3 py-2.5 text-sm text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                    >
                      <LogoutIcon className="w-4 h-4" />
                      <span className="font-medium">Keluar</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Scroll Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-tm-light relative">
          {isPageLoading ? <ContentSkeleton /> : children}
        </main>
      </div>

      {/* Global Modals */}
      <GlobalScannerModal
        isOpen={isGlobalScannerOpen}
        onClose={() => setIsGlobalScannerOpen(false)}
        onScanSuccess={onScanSuccess}
      />

      <WhatsAppSimulationModal />

      <PreviewModal
        currentUser={currentUser}
        previewData={previewData}
        onClose={() => setPreviewData(null)}
        onShowPreview={onShowPreview}
        onEditItem={previewActions.onEditItem}
        onInitiateHandover={previewActions.onInitiateHandover}
        onInitiateDismantle={previewActions.onInitiateDismantle}
        onInitiateInstallation={previewActions.onInitiateInstallation}
        onReportDamage={previewActions.onReportDamage}
        onStartRepair={previewActions.onStartRepair}
        onMarkAsRepaired={previewActions.onMarkAsRepaired}
        onDecommission={previewActions.onDecommission}
        onReceiveFromRepair={previewActions.onReceiveFromRepair}
        onAddProgressUpdate={previewActions.onAddProgressUpdate}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={setActivePage}
        onShowPreview={onShowPreview}
      />
    </div>
  );
};
