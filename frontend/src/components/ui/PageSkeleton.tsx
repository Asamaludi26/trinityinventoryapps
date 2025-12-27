"use client";

import type React from "react";
import { Skeleton } from "./Skeleton";

export const PageSkeleton: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-tm-light">
      {/* Sidebar Skeleton */}
      <aside className="hidden md:flex flex-col w-64 bg-tm-dark p-4 space-y-6">
        {/* Logo area */}
        <div className="flex items-center gap-3 px-2 py-4 mb-4 border-b border-white/10">
          <Skeleton
            variant="rectangular"
            width={40}
            height={40}
            className="!bg-white/10 !rounded-xl"
          />
          <div className="space-y-2">
            <Skeleton
              variant="text"
              width={100}
              height={18}
              className="!bg-white/10"
            />
            <Skeleton
              variant="text"
              width={70}
              height={10}
              className="!bg-white/10"
            />
          </div>
        </div>

        {/* Menu label */}
        <Skeleton
          variant="text"
          width={80}
          height={10}
          className="!bg-white/10 ml-2"
        />

        {/* Menu items */}
        <div className="space-y-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              height={44}
              className="!bg-white/5 !rounded-xl w-full"
            />
          ))}
        </div>
      </aside>

      {/* Main Content Skeleton */}
      <div className="flex-1 flex flex-col">
        {/* Header Skeleton */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6">
          <Skeleton
            variant="rectangular"
            width={32}
            height={32}
            className="!rounded-lg md:hidden"
          />

          <div className="hidden md:block" />

          <div className="flex items-center gap-3">
            <Skeleton
              variant="rectangular"
              width={140}
              height={36}
              className="hidden md:block !rounded-xl"
            />
            <Skeleton variant="circular" width={36} height={36} />
            <Skeleton variant="circular" width={36} height={36} />
            <div className="hidden sm:flex items-center gap-2 ml-2">
              <div className="text-right space-y-1.5">
                <Skeleton variant="text" width={80} height={14} />
                <Skeleton variant="text" width={60} height={10} />
              </div>
              <Skeleton
                variant="rectangular"
                width={36}
                height={36}
                className="!rounded-xl"
              />
            </div>
          </div>
        </header>

        {/* Content Area Skeleton */}
        <main className="p-4 sm:p-6 md:p-8 space-y-6">
          {/* Page header */}
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="space-y-2">
              <Skeleton variant="text" width={280} height={32} />
              <Skeleton variant="text" width={180} height={16} />
            </div>
            <div className="flex gap-2">
              <Skeleton
                variant="rectangular"
                width={110}
                height={40}
                className="!rounded-xl"
              />
              <Skeleton
                variant="rectangular"
                width={110}
                height={40}
                className="!rounded-xl"
              />
            </div>
          </div>

          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                height={100}
                className="!rounded-2xl shadow-sm"
              />
            ))}
          </div>

          {/* Table/Card Container Skeleton */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            {/* Table header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <Skeleton variant="text" width={120} height={20} />
              <Skeleton
                variant="rectangular"
                width={100}
                height={32}
                className="!rounded-lg"
              />
            </div>

            {/* Table rows */}
            <div className="divide-y divide-slate-100">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="p-4 flex items-center gap-4">
                  <Skeleton
                    variant="rectangular"
                    width={48}
                    height={48}
                    className="!rounded-xl flex-shrink-0"
                  />
                  <div className="flex-1 space-y-2">
                    <Skeleton variant="text" width="60%" height={16} />
                    <Skeleton variant="text" width="40%" height={12} />
                  </div>
                  <Skeleton
                    variant="rectangular"
                    width={80}
                    height={28}
                    className="!rounded-full"
                  />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
