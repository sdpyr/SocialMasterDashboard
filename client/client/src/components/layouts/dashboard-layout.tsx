import { ReactNode } from "react";
import Sidebar from "@/components/dashboard/sidebar";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";
import { useTranslation } from "@/i18n";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { currentLanguage } = useTranslation();
  
  // Kullanıcı bilgilerini getir
  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ["/api/user"],
    queryFn: () => apiRequest("GET", "/api/user").then(res => res.json()),
  });

  // Hesapları getir
  const { data: accounts = [], isLoading: isAccountsLoading } = useQuery({
    queryKey: ["/api/accounts", 1],
    queryFn: () => apiRequest("GET", "/api/accounts/1").then(res => res.json()),
  });
  
  // Okunmamış mesaj sayısını getir
  const { data: unreadCounts = {}, isLoading: isMessagesLoading } = useQuery({
    queryKey: ["/api/messages/unread"],
    queryFn: () => apiRequest("GET", "/api/messages/unread").then(res => res.json()),
  });

  if (isUserLoading || isAccountsLoading || isMessagesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-gray-500 font-medium">
            {currentLanguage === 'tr' ? 'Yükleniyor...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar 
        accounts={accounts} 
        unreadMessageCounts={unreadCounts}
        activeAccount={accounts.length > 0 ? accounts[0] : null}
        onAccountChange={() => {}} // Hesap değişimi şimdilik boş bir fonksiyon
      />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}