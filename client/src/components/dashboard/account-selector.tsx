import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PLATFORM_DATA } from "@/lib/constants";
import type { SocialAccount } from "@shared/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarFallback } from "@/lib/utils";

interface AccountSelectorProps {
  accounts: SocialAccount[];
  activeAccount: SocialAccount | null;
  onAccountChange: (account: SocialAccount) => void;
}

export default function AccountSelector({ 
  accounts, 
  activeAccount, 
  onAccountChange 
}: AccountSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAccountSelect = (account: SocialAccount) => {
    onAccountChange(account);
    setIsOpen(false);
  };

  // Group accounts by name
  const accountGroups = accounts.reduce((groups, account) => {
    if (!groups[account.name]) {
      groups[account.name] = [];
    }
    groups[account.name].push(account);
    return groups;
  }, {} as Record<string, SocialAccount[]>);

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="outline"
        className="w-full flex items-center justify-between p-2 bg-white border border-gray-300 rounded-lg text-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          {activeAccount ? (
            <>
              <Avatar className="w-6 h-6 mr-2">
                <AvatarImage src={activeAccount.avatarUrl || ""} alt={activeAccount.username || activeAccount.name || ""} />
                <AvatarFallback>{getAvatarFallback(activeAccount.username || activeAccount.name || "")}</AvatarFallback>
              </Avatar>
              <span className="text-gray-700">{activeAccount.username || activeAccount.name || "Hesap"}</span>
            </>
          ) : (
            <span className="text-gray-700">Hesap Seçin</span>
          )}
        </div>
        <i className="ri-arrow-down-s-line text-gray-400"></i>
      </Button>
      
      {isOpen && (
        <div className="absolute w-full bg-white mt-1 border border-gray-200 rounded-lg shadow-lg z-10">
          <div className="p-2 border-b border-gray-100">
            <p className="text-xs text-gray-500 font-medium">Hesap Değiştir</p>
          </div>
          <div className="max-h-48 overflow-y-auto">
            {Object.entries(accountGroups).map(([name, groupAccounts]) => (
              <div key={name} className="border-b border-gray-100">
                <div className="p-2 bg-gray-50">
                  <span className="text-xs font-semibold text-gray-700">{name}</span>
                </div>
                {groupAccounts.map(account => (
                  <div 
                    key={account.id}
                    className={`p-2 hover:bg-gray-50 cursor-pointer flex items-center ${activeAccount?.id === account.id ? 'bg-primary/5' : ''}`}
                    onClick={() => handleAccountSelect(account)}
                  >
                    <div className="flex items-center overflow-hidden flex-1">
                      <Avatar className="w-6 h-6 mr-2 flex-shrink-0">
                        <AvatarImage src={account.avatarUrl || ""} alt={account.username || account.name} />
                        <AvatarFallback className="text-xs">{getAvatarFallback(account.username || account.name)}</AvatarFallback>
                      </Avatar>
                      <div className="overflow-hidden">
                        <div className="text-sm font-medium truncate">{account.username || account.name}</div>
                        <div className="text-xs text-gray-500 truncate">{account.platform}</div>
                      </div>
                    </div>
                    <div className="ml-2 flex-shrink-0">
                      <i className={`${PLATFORM_DATA[account.platform].iconClass} ${PLATFORM_DATA[account.platform].color} text-sm`}></i>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="p-2 border-t border-gray-100">
            <Button 
              variant="link" 
              className="w-full text-left text-xs text-primary hover:text-primary-800 font-medium"
            >
              + Yeni Hesap Ekle
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
