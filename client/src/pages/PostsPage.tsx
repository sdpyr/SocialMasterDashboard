import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/layout/Header';
import AddressBar from '@/components/layout/AddressBar';
import TabNavigation from '@/components/layout/TabNavigation';
import Sidebar from '@/components/layout/Sidebar';
import StatusBar from '@/components/layout/StatusBar';
import ContentHeader from '@/components/dashboard/ContentHeader';
import { BreadcrumbItem, SortOption } from '@/lib/types';
import type { Post, SocialAccount } from '@shared/schema';

export default function PostsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSort, setCurrentSort] = useState('date');
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);

  // Breadcrumbs for the current location
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Belgeler', path: '/documents' },
    { label: 'SocialMasterDashboard', path: '/' },
    { label: 'Gönderiler', path: '/posts', isActive: true }
  ];

  // Sort options for the content
  const sortOptions: SortOption[] = [
    { label: 'Tarih', value: 'date' },
    { label: 'Platform', value: 'platform' },
    { label: 'Durum', value: 'status' }
  ];

  // Fetch social accounts
  const { data: accounts } = useQuery<SocialAccount[]>({
    queryKey: ['/api/accounts'],
    select: (data) => data || []
  });

  // Fetch posts for the selected account
  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ['/api/accounts', selectedAccountId, 'posts'],
    queryFn: async () => {
      if (!selectedAccountId) return [];
      const res = await fetch(`/api/accounts/${selectedAccountId}/posts`);
      if (!res.ok) throw new Error('Failed to fetch posts');
      return res.json();
    },
    enabled: !!selectedAccountId
  });

  // Function to format date
  const formatDate = (date: Date | string | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('tr-TR');
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    let color;
    switch (status) {
      case 'published':
        color = 'bg-green-100 text-green-800';
        break;
      case 'scheduled':
        color = 'bg-blue-100 text-blue-800';
        break;
      case 'draft':
        color = 'bg-yellow-100 text-yellow-800';
        break;
      case 'failed':
        color = 'bg-red-100 text-red-800';
        break;
      default:
        color = 'bg-gray-100 text-gray-800';
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${color}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="windows-frame">
      <Header title="SocialMasterDashboard - Gönderiler" />
      
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
            title="Gönderiler"
            subtitle="Sosyal medya gönderilerinizi yönetin"
            sortOptions={sortOptions}
            currentSort={currentSort}
            onSortChange={setCurrentSort}
          />
          
          <div className="mb-4">
            <label className="text-sm font-medium mr-2">Hesap seçin:</label>
            <select 
              className="border border-gray-300 rounded px-2 py-1"
              value={selectedAccountId || ''}
              onChange={(e) => setSelectedAccountId(Number(e.target.value) || null)}
            >
              <option value="">Tüm hesaplar</option>
              {accounts?.map(account => (
                <option key={account.id} value={account.id}>
                  {account.platform} - {account.accountName}
                </option>
              ))}
            </select>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : selectedAccountId && posts ? (
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İçerik
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Platform
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durum
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tarih
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Etkileşim
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {posts?.filter(post => 
                    post.content?.toLowerCase().includes(searchQuery.toLowerCase())
                  ).map((post) => (
                    <tr key={post.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="max-w-xs truncate">{post.content}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {post.platform}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={post.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {post.status === 'published' ? formatDate(post.publishedAt) : 
                         post.status === 'scheduled' ? formatDate(post.scheduledFor) : 
                         formatDate(post.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {post.engagement ? (
                          <div className="flex items-center space-x-2">
                            <div>
                              <span className="text-blue-500">👍 {(post.engagement as any).likes || 0}</span>
                            </div>
                            <div>
                              <span className="text-green-500">💬 {(post.engagement as any).comments || 0}</span>
                            </div>
                            <div>
                              <span className="text-yellow-500">🔄 {(post.engagement as any).shares || 0}</span>
                            </div>
                          </div>
                        ) : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center p-12 border rounded-lg bg-gray-50">
              <p className="text-gray-500">Lütfen bir hesap seçin</p>
            </div>
          )}
        </div>
      </div>
      
      <StatusBar itemCount={posts?.length || 0} />
    </div>
  );
}
