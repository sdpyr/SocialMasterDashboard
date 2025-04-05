import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Header from '@/components/layout/Header';
import AddressBar from '@/components/layout/AddressBar';
import TabNavigation from '@/components/layout/TabNavigation';
import Sidebar from '@/components/layout/Sidebar';
import StatusBar from '@/components/layout/StatusBar';
import ContentHeader from '@/components/dashboard/ContentHeader';
import { BreadcrumbItem, SortOption } from '@/lib/types';
import type { SocialAccount, Analytics } from '@shared/schema';

export default function AnalyticsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSort, setCurrentSort] = useState('date');
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);

  // Breadcrumbs for the current location
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Belgeler', path: '/documents' },
    { label: 'SocialMasterDashboard', path: '/' },
    { label: 'Analitik', path: '/analytics', isActive: true }
  ];

  // Sort options for the content
  const sortOptions: SortOption[] = [
    { label: 'Tarih', value: 'date' },
    { label: 'Etkileşim', value: 'engagement' }
  ];

  // Fetch social accounts
  const { data: accounts } = useQuery<SocialAccount[]>({
    queryKey: ['/api/accounts'],
    select: (data) => data || []
  });

  // Fetch analytics for the selected account
  const { data: analytics, isLoading } = useQuery<Analytics[]>({
    queryKey: ['/api/accounts', selectedAccountId, 'analytics'],
    queryFn: async () => {
      if (!selectedAccountId) return [];
      const res = await fetch(`/api/accounts/${selectedAccountId}/analytics`);
      if (!res.ok) throw new Error('Failed to fetch analytics');
      return res.json();
    },
    enabled: !!selectedAccountId
  });

  // Format data for charts
  const formatChartData = (data: Analytics[] | undefined) => {
    if (!data || data.length === 0) return [];
    
    return data.map(item => ({
      date: new Date(item.date).toLocaleDateString('tr-TR'),
      followers: item.followers,
      following: item.following,
      engagement: item.engagement,
      impressions: item.impressions,
      reach: item.reach,
      profileVisits: item.profileVisits,
      clickThroughs: item.clickThroughs
    }));
  };

  const chartData = formatChartData(analytics);

  // Summary metrics
  const getLatestMetrics = () => {
    if (!analytics || analytics.length === 0) return null;
    return analytics[0]; // Assuming the first item is the most recent
  };

  const latestMetrics = getLatestMetrics();

  return (
    <div className="windows-frame">
      <Header title="SocialMasterDashboard - Analitik" />
      
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
            title="Analitik Veriler"
            subtitle="Sosyal medya performansınızı analiz edin"
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
              <option value="">Hesap seçin</option>
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
          ) : selectedAccountId && analytics && analytics.length > 0 ? (
            <>
              {/* Summary metrics cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-sm font-medium text-gray-500">Takipçi Sayısı</h3>
                  <p className="text-2xl font-bold">{latestMetrics?.followers.toLocaleString()}</p>
                  <p className="text-xs text-green-500">
                    +{(latestMetrics?.followers || 0) - (analytics[1]?.followers || 0)} bu hafta
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-sm font-medium text-gray-500">Etkileşim</h3>
                  <p className="text-2xl font-bold">{latestMetrics?.engagement.toLocaleString()}</p>
                  <p className="text-xs text-green-500">
                    +{(latestMetrics?.engagement || 0) - (analytics[1]?.engagement || 0)} bu hafta
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-sm font-medium text-gray-500">Erişim</h3>
                  <p className="text-2xl font-bold">{latestMetrics?.reach.toLocaleString()}</p>
                  <p className="text-xs text-green-500">
                    +{(latestMetrics?.reach || 0) - (analytics[1]?.reach || 0)} bu hafta
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-sm font-medium text-gray-500">Profil Ziyareti</h3>
                  <p className="text-2xl font-bold">{latestMetrics?.profileVisits.toLocaleString()}</p>
                  <p className="text-xs text-green-500">
                    +{(latestMetrics?.profileVisits || 0) - (analytics[1]?.profileVisits || 0)} bu hafta
                  </p>
                </div>
              </div>
              
              {/* Follower growth chart */}
              <div className="bg-white p-4 rounded-lg shadow mb-6">
                <h3 className="text-base font-medium mb-4">Takipçi Büyümesi</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="followers" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Engagement metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-base font-medium mb-4">Etkileşim Metrikleri</h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="engagement" fill="#82ca9d" name="Etkileşim" />
                        <Bar dataKey="impressions" fill="#8884d8" name="Gösterim" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-base font-medium mb-4">Profil Aktivitesi</h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={chartData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="profileVisits" stroke="#ff7300" name="Profil Ziyaretleri" />
                        <Line type="monotone" dataKey="clickThroughs" stroke="#387908" name="Tıklamalar" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center p-12 border rounded-lg bg-gray-50">
              <p className="text-gray-500">Lütfen bir hesap seçin</p>
            </div>
          )}
        </div>
      </div>
      
      <StatusBar itemCount={analytics?.length || 0} />
    </div>
  );
}
