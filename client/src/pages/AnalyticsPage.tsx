import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import TabNavigation from '@/components/layout/TabNavigation';
import { SortOption } from '@/lib/types';
import type { SocialAccount, Analytics } from '@shared/schema';

export default function AnalyticsPage() {
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);
  const [timeRange, setTimeRange] = useState('week');

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
  
  // Get selected account name
  const getSelectedAccountName = () => {
    if (!selectedAccountId || !accounts) return '';
    const account = accounts.find(acc => acc.id === selectedAccountId);
    return account ? `${account.platform} - ${account.accountName}` : '';
  };

  return (
    <div>
      <TabNavigation />
      
      <div className="page-header mb-8">
        <h1 className="page-title">Analitik Veriler</h1>
        <p className="page-description">Sosyal medya performansınızı analiz edin ve etkileşimi artırın</p>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div>
            <label className="form-label">Sosyal Medya Hesabı</label>
            <select 
              className="form-select w-64"
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
          
          <div>
            <label className="form-label">Zaman Aralığı</label>
            <select 
              className="form-select w-36"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="week">Son 7 Gün</option>
              <option value="month">Son 30 Gün</option>
              <option value="quarter">Son 3 Ay</option>
              <option value="year">Son 1 Yıl</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="btn btn-outline">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
            Filtrele
          </button>
          <button className="btn btn-outline">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
            </svg>
            Raporu Dışa Aktar
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : selectedAccountId && analytics && analytics.length > 0 ? (
        <>
          {/* Header with selected account */}
          <div className="card mb-6">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">{getSelectedAccountName()}</h2>
                  <p className="text-sm text-slate-500">{timeRange === 'week' ? 'Son 7 gün analizi' : timeRange === 'month' ? 'Son 30 gün analizi' : timeRange === 'quarter' ? 'Son 3 ay analizi' : 'Son 1 yıl analizi'}</p>
                </div>
                <div className="badge badge-primary">
                  {latestMetrics?.followers > (analytics[1]?.followers || 0) ? 'Yükseliyor' : 'Düşüşte'}
                </div>
              </div>
            </div>
          </div>
          
          {/* Summary metrics cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="stat-card">
              <div className="stat-title">Takipçi Sayısı</div>
              <div className="stat-value">{latestMetrics?.followers.toLocaleString()}</div>
              <div className={`stat-change ${(latestMetrics?.followers || 0) - (analytics[1]?.followers || 0) >= 0 ? 'stat-change-positive' : 'stat-change-negative'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  {(latestMetrics?.followers || 0) - (analytics[1]?.followers || 0) >= 0 ? (
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                  ) : (
                    <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                  )}
                </svg>
                <span>{Math.abs((latestMetrics?.followers || 0) - (analytics[1]?.followers || 0))} bu hafta</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-title">Etkileşim</div>
              <div className="stat-value">{latestMetrics?.engagement.toLocaleString()}</div>
              <div className={`stat-change ${(latestMetrics?.engagement || 0) - (analytics[1]?.engagement || 0) >= 0 ? 'stat-change-positive' : 'stat-change-negative'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  {(latestMetrics?.engagement || 0) - (analytics[1]?.engagement || 0) >= 0 ? (
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                  ) : (
                    <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                  )}
                </svg>
                <span>{Math.abs((latestMetrics?.engagement || 0) - (analytics[1]?.engagement || 0))} bu hafta</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-title">Erişim</div>
              <div className="stat-value">{latestMetrics?.reach.toLocaleString()}</div>
              <div className={`stat-change ${(latestMetrics?.reach || 0) - (analytics[1]?.reach || 0) >= 0 ? 'stat-change-positive' : 'stat-change-negative'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  {(latestMetrics?.reach || 0) - (analytics[1]?.reach || 0) >= 0 ? (
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                  ) : (
                    <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                  )}
                </svg>
                <span>{Math.abs((latestMetrics?.reach || 0) - (analytics[1]?.reach || 0))} bu hafta</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-title">Profil Ziyareti</div>
              <div className="stat-value">{latestMetrics?.profileVisits.toLocaleString()}</div>
              <div className={`stat-change ${(latestMetrics?.profileVisits || 0) - (analytics[1]?.profileVisits || 0) >= 0 ? 'stat-change-positive' : 'stat-change-negative'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  {(latestMetrics?.profileVisits || 0) - (analytics[1]?.profileVisits || 0) >= 0 ? (
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                  ) : (
                    <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                  )}
                </svg>
                <span>{Math.abs((latestMetrics?.profileVisits || 0) - (analytics[1]?.profileVisits || 0))} bu hafta</span>
              </div>
            </div>
          </div>
          
          {/* Follower growth chart */}
          <div className="card mb-6">
            <div className="card-header">
              <h3 className="text-lg font-medium text-slate-800">Takipçi Büyümesi</h3>
              <div className="flex gap-2">
                <button className={`btn btn-sm ${timeRange === 'week' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTimeRange('week')}>7G</button>
                <button className={`btn btn-sm ${timeRange === 'month' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTimeRange('month')}>30G</button>
                <button className={`btn btn-sm ${timeRange === 'quarter' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTimeRange('quarter')}>3A</button>
                <button className={`btn btn-sm ${timeRange === 'year' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTimeRange('year')}>1Y</button>
              </div>
            </div>
            <div className="card-body">
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
          </div>
          
          {/* Engagement metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-slate-800">Etkileşim Metrikleri</h3>
              </div>
              <div className="card-body">
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
            </div>
            
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-slate-800">Profil Aktivitesi</h3>
              </div>
              <div className="card-body">
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
          </div>
        </>
      ) : (
        <div className="card py-16">
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="mt-4 text-xl font-medium text-slate-800">Analiz verilerini görüntülemek için bir hesap seçin</h3>
            <p className="mt-2 text-slate-500 max-w-md mx-auto">Sosyal medya hesaplarınızın performansını izlemek ve etkileşim metriklerinizi görmek için bir hesap seçin.</p>
            <div className="mt-6">
              <select 
                className="form-select w-64 mx-auto"
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
          </div>
        </div>
      )}
    </div>
  );
}
