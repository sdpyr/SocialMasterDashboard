import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-mobile";
import AccountSelector from "./account-selector";
import { FEATURE_LINKS, PLATFORM_DATA, PLATFORMS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { SocialAccount } from "@shared/schema";

interface SidebarProps {
  accounts?: SocialAccount[];
  unreadMessageCounts?: Record<string, number>;
  activeAccount?: SocialAccount | null;
  onAccountChange?: (account: SocialAccount) => void;
}

export default function Sidebar({ 
  accounts = [], 
  unreadMessageCounts = {}, 
  activeAccount = null,
  onAccountChange = () => {}
}: SidebarProps) {
  const [location] = useLocation();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isOpen, setIsOpen] = useState(!isMobile);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const totalUnread = Object.values(unreadMessageCounts).reduce((a, b) => a + b, 0);

  return (
    <>
      {isMobile && (
        <Button 
          variant="outline" 
          size="icon" 
          className="fixed top-4 left-4 z-30"
          onClick={toggleSidebar}
        >
          <i className={`ri-${isOpen ? 'close' : 'menu'}-line text-xl`}></i>
        </Button>
      )}

      <aside 
        className={cn(
          "dashboard-panel transition-all duration-300 flex flex-col",
          isMobile ? 
            isOpen ? "fixed inset-0 z-20 w-64 h-full opacity-100 shadow-lg" : "fixed inset-0 z-20 w-0 opacity-0 pointer-events-none" 
            : "w-64 min-h-screen sticky top-0 overflow-y-auto"
        )}
      >
        {/* Header & Logo */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <i className="ri-bubble-chart-fill text-white text-xl"></i>
            </div>
            <h1 className="text-lg font-semibold text-gray-900">SosyalYönet</h1>
          </div>
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <i className="ri-close-line text-xl"></i>
            </Button>
          )}
        </div>
        
        {/* Account selector */}
        <div className="p-4">
          <AccountSelector 
            accounts={accounts} 
            activeAccount={activeAccount}
            onAccountChange={onAccountChange}
          />
        </div>
        
        {/* Navigation menu */}
        <div className="py-4">
          <div className="px-4 mb-2">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">PLATFORMLAR</h2>
          </div>
          
          {/* Platform navigation */}
          <nav className="space-y-1">
            <Link href="/accounts">
              <div className={cn(
                "flex items-center px-4 py-3 text-sm font-medium cursor-pointer", 
                (location === "/accounts" || location === "/") ? "platform-active" : "text-gray-600 hover:bg-gray-50 hover:text-primary"
              )}>
                <i className="ri-dashboard-line mr-3 text-lg"></i>
                <span>Genel Bakış</span>
              </div>
            </Link>
            
            {PLATFORMS.map((platform) => {
              const platformData = PLATFORM_DATA[platform];
              const platformAccounts = accounts.filter(a => a.platform === platform);
              const unreadCount = platformAccounts.reduce(
                (acc, account) => acc + (unreadMessageCounts[account.id.toString()] || 0), 
                0
              );
              
              return (
                <Link key={platform} href={`/platform/${platform}`}>
                  <div className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium cursor-pointer", 
                    location === `/platform/${platform}` ? "platform-active" : "text-gray-600 hover:bg-gray-50 hover:text-primary"
                  )}>
                    <i className={`${platformData.iconClass} mr-3 text-lg ${platformData.color}`}></i>
                    <span>{platformData.label}</span>
                    {platformAccounts.length > 0 && (
                      <span className="ml-auto bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                        {platformAccounts.length}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>
          
          {/* Features navigation */}
          <div className="px-4 mt-6 mb-2">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">ÖZELLİKLER</h2>
          </div>
          
          <nav className="space-y-1">
            {FEATURE_LINKS.map((link) => (
              <Link key={link.path} href={link.path}>
                <div className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium cursor-pointer",
                  location === link.path ? "platform-active" : "text-gray-600 hover:bg-gray-50 hover:text-primary"
                )}>
                  <i className={`${link.icon} mr-3 text-lg`}></i>
                  <span>{link.label}</span>
                  {link.path === "/mesajlar" && totalUnread > 0 && (
                    <span className="ml-auto bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                      {totalUnread}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </nav>
        </div>
        
        {/* User menu */}
        <div className="mt-auto p-4 border-t border-gray-200">
          <div className="flex items-center">
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
              alt="Kullanıcı Avatar" 
              className="w-8 h-8 rounded-full mr-3"
            />
            <div>
              <p className="text-sm font-medium text-gray-700">Mehmet Yılmaz</p>
              <p className="text-xs text-gray-500">mehmet@example.com</p>
            </div>
            <div className="ml-auto flex">
              <Link href="/ayarlar">
                <div className="p-2 text-gray-400 hover:text-gray-500 rounded-md hover:bg-gray-50 cursor-pointer">
                  <i className="ri-settings-3-line text-lg"></i>
                </div>
              </Link>
              <Link href="/admin-panel">
                <div className="p-2 text-gray-400 hover:text-gray-500 rounded-md hover:bg-gray-50 cursor-pointer">
                  <i className="ri-shield-keyhole-line text-lg"></i>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
