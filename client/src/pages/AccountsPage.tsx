import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/layout/Header';
import AddressBar from '@/components/layout/AddressBar';
import TabNavigation from '@/components/layout/TabNavigation';
import Sidebar from '@/components/layout/Sidebar';
import StatusBar from '@/components/layout/StatusBar';
import ContentHeader from '@/components/dashboard/ContentHeader';
import FolderGrid from '@/components/dashboard/FolderGrid';
import { BreadcrumbItem, FileItem, SortOption } from '@/lib/types';
import type { SocialAccount } from '@shared/schema';

export default function AccountsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSort, setCurrentSort] = useState('platform');

  // Breadcrumbs for the current location
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Belgeler', path: '/documents' },
    { label: 'SocialMasterDashboard', path: '/' },
    { label: 'Hesaplar', path: '/accounts', isActive: true }
  ];

  // Sort options for the content
  const sortOptions: SortOption[] = [
    { label: 'Platform', value: 'platform' },
    { label: 'İsim', value: 'name' },
    { label: 'Takipçi', value: 'followers' }
  ];

  // Fetch social accounts
  const { data: accounts, isLoading } = useQuery<SocialAccount[]>({
    queryKey: ['/api/accounts'],
    select: (data) => data || []
  });

  // Convert accounts to file items for display
  const accountItems: FileItem[] = accounts
    ? accounts.map(account => ({
        id: account.id.toString(),
        name: account.accountName,
        icon: 'file',
        type: 'file',
        path: `/accounts/${account.id}`,
        platformIcon: account.platform
      }))
    : [];

  // Apply sorting
  const sortedAccounts = [...accountItems].sort((a, b) => {
    if (currentSort === 'name') {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  // Apply filtering if search query exists
  const filteredAccounts = searchQuery 
    ? sortedAccounts.filter(account => account.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : sortedAccounts;

  return (
    <div className="windows-frame">
      <Header title="SocialMasterDashboard - Hesaplar" />
      
      <AddressBar 
        breadcrumbs={breadcrumbs} 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <TabNavigation />
      
      <div className="flex flex-1">
        <Sidebar />
        
        <div className="flex-1 p-4">
          <ContentHeader 
            title="Sosyal Medya Hesapları"
            subtitle="Bağlı hesaplarınızı yönetin"
            sortOptions={sortOptions}
            currentSort={currentSort}
            onSortChange={setCurrentSort}
          />
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <FolderGrid 
              folders={[]} 
              files={filteredAccounts} 
            />
          )}
        </div>
      </div>
      
      <StatusBar itemCount={filteredAccounts.length} />
    </div>
  );
}
