"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { PLATFORM_DATA } from "@/lib/constants";
import type { Platform } from "@shared/schema";
import useAccounts from "@/hooks/use-accounts";
import { Skeleton } from "@/components/ui/skeleton";

interface PlatformSelectorProps {
  selectedPlatforms: Platform[];
  setSelectedPlatforms: React.Dispatch<React.SetStateAction<Platform[]>>;
}

export function PlatformSelector({
  selectedPlatforms,
  setSelectedPlatforms,
}: PlatformSelectorProps) {
  const { accounts, isLoading } = useAccounts();

  const togglePlatform = (platform: Platform) => {
    // Çoklu platform seçimi - tıklanan platform eklenip çıkarılır
    setSelectedPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    );
  };

  const availablePlatforms = Object.keys(PLATFORM_DATA) as Platform[];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">
        Platformları Seç
      </h2>
      <div className="flex flex-wrap gap-3">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="w-[80px] h-12 rounded-xl" />
            ))
          : availablePlatforms.map((platform) => {
              const platformData = PLATFORM_DATA[platform];
              const isSelected = selectedPlatforms.includes(platform);
              const hasAccount = accounts?.some(account => account.platform === platform);
              
              return (
                <button
                  key={platform}
                  type="button"
                  onClick={() => togglePlatform(platform)}
                  disabled={!hasAccount}
                  className={cn(
                    "relative flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 border",
                    isSelected
                      ? `${platformData.bgColor} border-primary text-primary`
                      : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50",
                    !hasAccount && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <i className={`${platformData.iconClass} text-lg ${isSelected ? platformData.color : ""}`}></i>
                  <span className="text-sm font-medium">{platformData.label}</span>
                  
                  {isSelected && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white w-5 h-5 flex items-center justify-center rounded-full text-xs">
                      <i className="ri-check-line"></i>
                    </span>
                  )}
                </button>
              );
            })}
      </div>
      
      <div className="text-xs text-gray-500 italic">
        Not: Sadece bağladığınız hesapların bulunduğu platformlara içerik gönderebilirsiniz.
      </div>
    </div>
  );
}