"use client";

import type React from "react";
import { Skeleton } from "./Skeleton";

export const ContentSkeleton: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 animate-fade-in">
      {/* Page Header */}
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <Skeleton variant="text" width={80} height={12} />
                <Skeleton variant="text" width={60} height={28} />
                <Skeleton variant="text" width={100} height={10} />
              </div>
              <Skeleton
                variant="rectangular"
                width={40}
                height={40}
                className="!rounded-xl"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Table Container */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        {/* Table header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <Skeleton variant="text" width={150} height={20} />
          <div className="flex gap-2">
            <Skeleton
              variant="rectangular"
              width={120}
              height={36}
              className="!rounded-lg"
            />
            <Skeleton
              variant="rectangular"
              width={80}
              height={36}
              className="!rounded-lg"
            />
          </div>
        </div>

        {/* Table rows */}
        <div className="divide-y divide-slate-100">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-4 flex items-center gap-4">
              <div className="flex-1 space-y-2">
                <Skeleton variant="text" width="50%" height={16} />
                <Skeleton variant="text" width="30%" height={12} />
              </div>
              <Skeleton variant="text" width="20%" height={14} />
              <Skeleton
                variant="rectangular"
                width={80}
                height={26}
                className="!rounded-full"
              />
              <div className="flex gap-1">
                <Skeleton
                  variant="rectangular"
                  width={32}
                  height={32}
                  className="!rounded-lg"
                />
                <Skeleton
                  variant="rectangular"
                  width={32}
                  height={32}
                  className="!rounded-lg"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination skeleton */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <Skeleton variant="text" width={150} height={14} />
          <Skeleton variant="text" width={120} height={14} />
          <div className="flex gap-1">
            <Skeleton
              variant="rectangular"
              width={32}
              height={32}
              className="!rounded-lg"
            />
            <Skeleton
              variant="rectangular"
              width={32}
              height={32}
              className="!rounded-lg"
            />
            <Skeleton
              variant="rectangular"
              width={60}
              height={32}
              className="!rounded-lg"
            />
            <Skeleton
              variant="rectangular"
              width={32}
              height={32}
              className="!rounded-lg"
            />
            <Skeleton
              variant="rectangular"
              width={32}
              height={32}
              className="!rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
