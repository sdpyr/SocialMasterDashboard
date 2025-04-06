import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import TabNavigation from '@/components/layout/TabNavigation';
import { SocialAccount } from '@shared/schema';

export default function MessagesPage() {
  const [selectedAccount, setSelectedAccount] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch social accounts
  const { data: accounts, isLoading: loadingAccounts } = useQuery<SocialAccount[]>({
    queryKey: ['/api/accounts'],
    select: (data) => data || []
  });

  // Mock message data structure
  interface Message {
    id: number;
    accountId: number;
    sender: string;
    content: string;
    timestamp: Date;
    read: boolean;
    avatar?: string;
  }

  // Mock messages - in a real app, this would come from an API call
  const mockMessages: Message[] = [
    {
      id: 1,
      accountId: 1,
      sender: "Ahmet Yılmaz",
      content: "Merhaba, ürünleriniz hakkında bilgi alabilir miyim?",
      timestamp: new Date(2024, 3, 5, 14, 30),
      read: true,
      avatar: "https://i.pravatar.cc/150?img=1"
    },
    {
      id: 2,
      accountId: 1,
      sender: "Ayşe Demir",
      content: "Geçen hafta sipariş ettiğim ürün henüz elime ulaşmadı. Sipariş numarası: #45678",
      timestamp: new Date(2024, 3, 5, 10, 15),
      read: false,
      avatar: "https://i.pravatar.cc/150?img=5"
    },
    {
      id: 3,
      accountId: 2,
      sender: "Mehmet Kaya",
      content: "Sosyal medya danışmanlığı hizmetleriniz hakkında detaylı bilgi almak istiyorum.",
      timestamp: new Date(2024, 3, 4, 16, 45),
      read: false,
      avatar: "https://i.pravatar.cc/150?img=3"
    },
    {
      id: 4,
      accountId: 3,
      sender: "Zeynep Şahin",
      content: "Pazarlama stratejinizi çok beğendim. Benzer bir yaklaşımı kendi işimizde de uygulamak istiyoruz.",
      timestamp: new Date(2024, 3, 3, 9, 20),
      read: true,
      avatar: "https://i.pravatar.cc/150?img=4"
    },
    {
      id: 5,
      accountId: 1,
      sender: "Emre Yıldız",
      content: "Kampanyanız ne zaman sona erecek? Katılmak istiyorum ama biraz zamanım var mı?",
      timestamp: new Date(2024, 3, 2, 11, 10),
      read: true,
      avatar: "https://i.pravatar.cc/150?img=6"
    }
  ];

  // Filter messages based on selected account and search query
  const filteredMessages = mockMessages
    .filter(message => !selectedAccount || message.accountId === selectedAccount)
    .filter(message => message.sender.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      message.content.toLowerCase().includes(searchQuery.toLowerCase()));

  // Format date for display
  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `Bugün ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Dün ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    } else {
      return `${date.getDate()}/${date.getMonth() + 1} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
  };

  return (
    <div>
      <TabNavigation />
      
      <div className="page-header mb-8">
        <h1 className="page-title">Mesajlar</h1>
        <p className="page-description">Sosyal medya hesaplarınızdan gelen mesajları yönetin ve yanıtlayın</p>
      </div>
      
      <div className="flex">
        {/* Left sidebar with accounts and search */}
        <div className="w-80 min-w-80 pr-6 border-r border-slate-200">
          <div className="mb-4">
            <div className="relative">
              <input
                type="search"
                placeholder="Mesajlarda ara..."
                className="form-input pl-10 pr-4 py-2 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400"
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="form-label">Sosyal Medya Hesabı</label>
            <select 
              className="form-select w-full"
              value={selectedAccount || ''}
              onChange={(e) => setSelectedAccount(Number(e.target.value) || null)}
            >
              <option value="">Tüm hesaplar</option>
              {accounts?.map(account => (
                <option key={account.id} value={account.id}>
                  {account.platform} - {account.accountName}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mt-6">
            <div className="font-medium text-sm text-slate-500 mb-2">Mesajlar ({filteredMessages.length})</div>
            
            <div className="space-y-2">
              {filteredMessages.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <p className="mt-2">Mesaj bulunamadı</p>
                </div>
              ) : (
                filteredMessages.map(message => (
                  <div 
                    key={message.id} 
                    className={`p-3 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors ${!message.read ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        {message.avatar ? (
                          <img src={message.avatar} alt={message.sender} className="w-10 h-10 rounded-full" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                            {message.sender.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex justify-between items-start">
                          <div className="font-medium truncate">{message.sender}</div>
                          <div className="text-xs text-slate-500 whitespace-nowrap ml-2">{formatDate(message.timestamp)}</div>
                        </div>
                        <div className="text-sm text-slate-600 truncate">{message.content}</div>
                      </div>
                    </div>
                    {!message.read && (
                      <div className="ml-13 mt-1">
                        <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        
        {/* Main content area */}
        <div className="flex-1 pl-6">
          <div className="h-full flex items-center justify-center bg-slate-50 rounded-lg border border-dashed border-slate-200 p-12">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 className="mt-4 text-xl font-medium text-slate-800">Sohbeti başlatın</h3>
              <p className="mt-2 text-slate-500 max-w-md mx-auto">Bir mesaj seçerek sohbet etmeye başlayın veya yeni bir mesaj oluşturun.</p>
              <div className="mt-6">
                <button className="btn btn-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Yeni Mesaj
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}