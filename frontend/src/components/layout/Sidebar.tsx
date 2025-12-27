"use client";

import type React from "react";
import { useState, useEffect, useMemo } from "react";
import type { Page, User, Permission } from "../../types";
import { hasPermission } from "../../utils/permissions";
import { DashboardIcon } from "../icons/DashboardIcon";
import { RequestIcon } from "../icons/RequestIcon";
import { RegisterIcon } from "../icons/RegisterIcon";
import { HandoverIcon } from "../icons/HandoverIcon";
import { DismantleIcon } from "../icons/DismantleIcon";
import { CloseIcon } from "../icons/CloseIcon";
import { AssetIcon } from "../icons/AssetIcon";
import { ChevronDownIcon } from "../icons/ChevronDownIcon";
import { UsersIcon } from "../icons/UsersIcon";
import { TrinitiLogoIcon } from "../icons/TrinitiLogoIcon";
import { CustomerIcon } from "../icons/CustomerIcon";
import { BoxIcon } from "../icons/BoxIcon";
import { SettingsIcon } from "../icons/SettingsIcon";
import { CategoryIcon } from "../icons/CategoryIcon";
import { WrenchIcon } from "../icons/WrenchIcon";
import { FileSignatureIcon } from "../icons/FileSignatureIcon";
import { JournalCheckIcon } from "../icons/JournalCheckIcon";
import { UserCogIcon } from "../icons/UserCogIcon";

// Zustand Imports
import { useUIStore } from "../../stores/useUIStore";
import { useAuthStore } from "../../stores/useAuthStore";

interface SidebarProps {
  currentUser: User;
  activePage: Page;
  setActivePage: (page: Page, filters?: any) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

type MenuItem = {
  id: string;
  label: string;
  icon: React.FC<{ className?: string }>;
  permission?: Permission;
  children?: MenuItem[];
  page?: Page;
  filter?: Record<string, any>;
  isExternal?: boolean;
  path?: string;
};

const allMenuItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: DashboardIcon,
    permission: "dashboard:view",
  },
  {
    id: "assetManagement",
    label: "Pusat Aset",
    icon: AssetIcon,
    permission: "assets:view",
    children: [
      {
        id: "registration",
        label: "Catat Aset",
        icon: RegisterIcon,
        permission: "assets:create",
      },
      {
        id: "stock",
        label: "Stok Aset",
        icon: BoxIcon,
        permission: "assets:view",
      },
      {
        id: "request-parent",
        label: "Request Aset",
        icon: RequestIcon,
        children: [
          {
            id: "request-new",
            page: "request",
            label: "Request Baru",
            icon: RequestIcon,
            permission: "requests:view:own",
          },
          {
            id: "request-loan",
            page: "request-pinjam",
            label: "Request Pinjam",
            icon: JournalCheckIcon,
            permission: "loan-requests:view:own",
          },
        ],
      },
      {
        id: "handover",
        label: "Handover Aset",
        icon: HandoverIcon,
        permission: "assets:handover",
      },
      {
        id: "repair",
        label: "Perbaikan Aset",
        icon: WrenchIcon,
        permission: "assets:repair:manage",
      },
    ],
  },
  {
    id: "customerManagement",
    label: "Manajemen Pelanggan",
    icon: CustomerIcon,
    permission: "customers:view",
    children: [
      {
        id: "customers",
        label: "Daftar Pelanggan",
        icon: UsersIcon,
        permission: "customers:view",
      },
      {
        id: "customer-installation-form",
        page: "customer-installation-form",
        label: "Manajemen Instalasi",
        icon: FileSignatureIcon,
        permission: "assets:install",
      },
      {
        id: "customer-maintenance-form",
        page: "customer-maintenance-form",
        label: "Manajemen Maintenance",
        icon: WrenchIcon,
        permission: "assets:repair:manage",
      },
      {
        id: "customer-dismantle",
        page: "customer-dismantle",
        label: "Data Dismantle",
        icon: DismantleIcon,
        permission: "assets:dismantle",
      },
    ],
  },
  {
    id: "settings",
    label: "Pengaturan",
    icon: SettingsIcon,
    children: [
      {
        id: "settings-akun",
        page: "pengaturan-akun",
        label: "Kelola Akun",
        icon: UserCogIcon,
        permission: "account:manage",
      },
      {
        id: "settings-pengguna",
        page: "pengaturan-pengguna",
        label: "Akun & Divisi",
        icon: UsersIcon,
        permission: "users:view",
      },
      {
        id: "settings-kategori",
        page: "kategori",
        label: "Kategori & Model",
        icon: CategoryIcon,
        permission: "categories:manage",
      },
    ],
  },
];

const NavLink: React.FC<{
  item: MenuItem;
  activePage: Page;
  onClick: () => void;
  isSubmenu?: boolean;
}> = ({ item, activePage, onClick, isSubmenu = false }) => {
  const pageId = item.page || (item.id as Page);
  const isActive = activePage === pageId;

  const linkContent = (
    <>
      {/* Active indicator bar */}
      <span
        className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-tm-accent transition-all duration-200 ${
          isActive && !item.isExternal
            ? "opacity-100 scale-100"
            : "opacity-0 scale-0"
        }`}
      />

      {/* Icon with refined styling */}
      <item.icon
        className={`flex-shrink-0 w-5 h-5 transition-colors duration-200 ${
          isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"
        }`}
      />

      {/* Label */}
      <span
        className={`flex-1 truncate ${isSubmenu ? "text-[13px]" : "text-sm"}`}
      >
        {item.label}
      </span>

      {/* External link indicator */}
      {item.isExternal && (
        <svg
          className="w-4 h-4 text-slate-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      )}
    </>
  );

  const baseClasses = `
    relative flex items-center gap-3 px-4 py-2.5 my-0.5 mx-2 rounded-xl text-sm font-medium
    transition-all duration-200 ease-out group
    ${isSubmenu ? "ml-4" : ""}
  `;

  const activeClasses = "bg-white/10 text-white shadow-sm backdrop-blur-sm";
  const inactiveClasses = "text-slate-300 hover:bg-white/5 hover:text-white";

  if (item.isExternal) {
    return (
      <a
        href={item.path}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClasses} ${inactiveClasses}`}
      >
        {linkContent}
      </a>
    );
  }

  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
    >
      {linkContent}
    </a>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({
  currentUser: propUser,
  activePage: propActivePage,
  setActivePage: propSetActivePage,
  isOpen: propIsOpen,
  setIsOpen: propSetIsOpen,
}) => {
  // Zustand Integration
  const storeActivePage = useUIStore((state) => state.activePage);
  const storeSetActivePage = useUIStore((state) => state.setActivePage);
  const storeSidebarOpen = useUIStore((state) => state.sidebarOpen);
  const storeToggleSidebar = useUIStore((state) => state.toggleSidebar);
  const storeUser = useAuthStore((state) => state.currentUser);

  const activePage = storeActivePage;
  const currentUser = storeUser || propUser;
  const isOpen = storeSidebarOpen;

  const handleSetActivePage = (page: Page, filters?: any) => {
    storeSetActivePage(page, filters);
    propSetActivePage(page, filters);
  };

  const handleSetIsOpen = (val: boolean) => {
    storeToggleSidebar(val);
    propSetIsOpen(val);
  };

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {};
    allMenuItems.forEach((item) => {
      if (item.children) {
        const childPages = item.children.map((c) => c.page || c.id);
        if (childPages.includes(activePage)) {
          initialState[item.id] = true;
        }
      }
    });
    return initialState;
  });

  const menuItems = useMemo(() => {
    const filterVisibleItems = (items: MenuItem[]): MenuItem[] => {
      return items.reduce((acc: MenuItem[], item) => {
        if (item.permission && !hasPermission(currentUser, item.permission)) {
          return acc;
        }

        if (item.children && item.children.length > 0) {
          const visibleChildren = filterVisibleItems(item.children);
          if (visibleChildren.length === 0) {
            if (!item.page && !item.path) {
              return acc;
            }
            return [...acc, { ...item, children: undefined }];
          }
          return [...acc, { ...item, children: visibleChildren }];
        }

        return [...acc, item];
      }, []);
    };

    return filterVisibleItems(allMenuItems);
  }, [currentUser]);

  useEffect(() => {
    allMenuItems.forEach((item) => {
      if (item.children) {
        const childPages = item.children.flatMap((c) =>
          c.children
            ? c.children.map((gc) => gc.page || gc.id)
            : [c.page || c.id]
        );
        if (childPages.includes(activePage)) {
          setOpenMenus((prev) => ({ ...prev, [item.id]: true }));
          const parentOfActive = item.children.find((c) =>
            c.children?.some((gc) => (gc.page || gc.id) === activePage)
          );
          if (parentOfActive) {
            setOpenMenus((prev) => ({ ...prev, [parentOfActive.id]: true }));
          }
        }
      }
    });
  }, [activePage]);

  const handleNavClick = (page: Page, filters?: Record<string, any>) => {
    handleSetActivePage(page, filters);
    if (window.innerWidth < 768) {
      handleSetIsOpen(false);
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header with refined branding */}
      <div className="flex items-center justify-between h-20 px-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-tm-accent/20 rounded-xl">
            <TrinitiLogoIcon className="w-8 h-8 text-tm-accent" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white">
              Triniti<span className="font-normal text-slate-300">Asset</span>
            </span>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">
              Inventory System
            </p>
          </div>
        </div>
        <button
          onClick={() => handleSetIsOpen(false)}
          className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors md:hidden"
        >
          <CloseIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto dark-scrollbar">
        <div className="px-4 mb-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Menu Utama
          </span>
        </div>

        {menuItems.map((item) => {
          if (!item.children || item.children.length === 0) {
            return (
              <NavLink
                key={item.id}
                item={item}
                activePage={activePage}
                onClick={() => handleNavClick((item.page || item.id) as Page)}
              />
            );
          }

          const isParentActive = item.children?.some(
            (child) =>
              (child.page || child.id) === activePage ||
              child.children?.some((gc) => (gc.page || gc.id) === activePage)
          );

          return (
            <div key={item.id} className="mb-1">
              {/* Parent menu button */}
              <button
                onClick={() =>
                  setOpenMenus((prev) => ({
                    ...prev,
                    [item.id]: !prev[item.id],
                  }))
                }
                className={`
                                    flex items-center justify-between w-[calc(100%-1rem)] mx-2 px-4 py-2.5 rounded-xl
                                    text-sm font-medium transition-all duration-200 group
                                    ${
                                      isParentActive
                                        ? "text-white"
                                        : "text-slate-300 hover:text-white hover:bg-white/5"
                                    }
                                `}
              >
                <div className="flex items-center gap-3">
                  <item.icon
                    className={`w-5 h-5 transition-colors ${
                      isParentActive
                        ? "text-white"
                        : "text-slate-400 group-hover:text-slate-200"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                <ChevronDownIcon
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                    openMenus[item.id] ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Submenu with smooth animation */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-out ${
                  openMenus[item.id]
                    ? "max-h-[500px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="pt-1 pl-3 border-l border-white/10 ml-7 mb-2">
                  {item.children.map((child) => {
                    if (!child.children || child.children.length === 0) {
                      return (
                        <NavLink
                          key={child.id}
                          item={child}
                          activePage={activePage}
                          onClick={() =>
                            handleNavClick(
                              (child.page || child.id) as Page,
                              child.filter
                            )
                          }
                          isSubmenu={true}
                        />
                      );
                    }

                    const isChildParentActive = child.children?.some(
                      (gc) => (gc.page || gc.id) === activePage
                    );

                    return (
                      <div key={child.id}>
                        <button
                          onClick={() =>
                            setOpenMenus((prev) => ({
                              ...prev,
                              [child.id]: !prev[child.id],
                            }))
                          }
                          className={`
                                                        flex items-center justify-between w-full px-4 py-2 rounded-lg
                                                        text-[13px] font-medium transition-all duration-200 group
                                                        ${
                                                          isChildParentActive
                                                            ? "text-white"
                                                            : "text-slate-300 hover:text-white hover:bg-white/5"
                                                        }
                                                    `}
                        >
                          <div className="flex items-center gap-3">
                            <child.icon
                              className={`w-4 h-4 ${
                                isChildParentActive
                                  ? "text-white"
                                  : "text-slate-400"
                              }`}
                            />
                            <span>{child.label}</span>
                          </div>
                          <ChevronDownIcon
                            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                              openMenus[child.id] ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        <div
                          className={`overflow-hidden transition-all duration-300 ease-out ${
                            openMenus[child.id] ? "max-h-96" : "max-h-0"
                          }`}
                        >
                          <div className="pt-1 pl-4">
                            {child.children.map((grandchild) => (
                              <NavLink
                                key={grandchild.id}
                                item={grandchild}
                                activePage={activePage}
                                onClick={() =>
                                  handleNavClick(
                                    (grandchild.page || grandchild.id) as Page,
                                    grandchild.filter
                                  )
                                }
                                isSubmenu={true}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <div className="px-4 py-3 bg-white/5 rounded-xl">
          <p className="text-[11px] text-center text-slate-400">
            © 2025 Triniti Media Indonesia
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay with glassmorphism */}
      <div
        className={`
                    fixed inset-0 z-20 bg-slate-900/60 backdrop-blur-sm transition-all duration-300 md:hidden no-print
                    ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
                `}
        onClick={() => handleSetIsOpen(false)}
      />

      {/* Sidebar with refined styling */}
      <aside
        className={`
                    fixed top-0 left-0 z-30 h-full w-64 bg-tm-dark 
                    transform transition-transform duration-300 ease-out 
                    md:translate-x-0 no-print
                    ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
                `}
      >
        <SidebarContent />
      </aside>
    </>
  );
};
