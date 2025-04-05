import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Sidebar from "@/components/dashboard/sidebar";
import { StatsCard } from "@/components/dashboard/stats-card";
import { DEMO_USER_ID, PLATFORM_DATA, TIME_INTERVALS } from "@/lib/constants";
import { formatNumber } from "@/lib/utils";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  PieChart,
  Pie,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { MessageList } from "@/components/dashboard/message-list";
import { KeywordTracking } from "@/components/dashboard/keyword-tracking";
import useAccounts from "@/hooks/use-accounts";
import useDateRange from "@/hooks/use-date-range";

export default function PlatformDetail() {
  const params = useParams<{ platform: string }>();
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const { dateRange, selectedInterval, setSelectedInterval } = useDateRange();
  
  const { accounts, isLoading: isLoadingAccounts, activeAccount, setActiveAccount } = useAccounts();
  
  // Make sure the active account matches the platform
  React.useEffect(() => {
    if (accounts && params.platform) {
      const platformAccounts = accounts.filter(account => account.platform === params.platform);
      if (platformAccounts.length > 0 && (!activeAccount || activeAccount.platform !== params.platform)) {
        setActiveAccount(platformAccounts[0]);
      }
    }
  }, [accounts, params.platform, activeAccount, setActiveAccount]);
  
  // Fetch analytics for the active account
  const { data: analyticsData, isLoading: isLoadingAnalytics } = useQuery({
    queryKey: [
      activeAccount ? 
        `/api/analytics/${activeAccount.id}?startDate=${dateRange.startDate.toISOString()}&endDate=${dateRange.endDate.toISOString()}` 
        : null
    ],
    enabled: !!activeAccount
  });
  
  // Fetch activities for the active account
  const { data: activities, isLoading: isLoadingActivities } = useQuery({
    queryKey: [
      activeAccount ? `/api/activities/${activeAccount.id}?limit=5` : null
    ],
    enabled: !!activeAccount
  });
  
  // Fetch messages for the active account
  const { data: messages, isLoading: isLoadingMessages } = useQuery({
    queryKey: [
      activeAccount ? `/api/messages/${activeAccount.id}` : null
    ],
    enabled: !!activeAccount
  });
  
  // Fetch keywords for the platform
  const { data: keywords, isLoading: isLoadingKeywords } = useQuery({
    queryKey: [
      `/api/keywords/${DEMO_USER_ID}?platform=${params.platform}`
    ],
    enabled: !!params.platform
  });
  
  // Calculate unread message counts
  const unreadMessageCounts: Record<string, number> = {};
  if (activeAccount && messages) {
    const unreadCount = messages.filter(message => !message.isRead).length;
    unreadMessageCounts[activeAccount.id.toString()] = unreadCount;
  }
  
  const isLoading = isLoadingAccounts || isLoadingAnalytics || isLoadingActivities || 
                   isLoadingMessages || isLoadingKeywords;
  
  // Handle navigation
  const handleViewAllMessages = () => {
    setLocation("/mesajlar");
  };
  
  const handleViewAllActivities = () => {
    setLocation("/analizler");
  };
  
  const handleViewAllKeywords = () => {
    setLocation("/anahtar-kelimeler");
  };
  
  // Handle message click
  const handleMessageClick = () => {
    setLocation("/mesajlar");
  };
  
  // Handle new message button
  const handleNewMessage = () => {
    setLocation("/mesajlar");
  };
  
  // Platform data
  const platformData = params.platform ? PLATFORM_DATA[params.platform as keyof typeof PLATFORM_DATA] : null;
  
  // Statistics data (varsayılan değerler kullanıyoruz)
  const statsData = {
    followers: 5000,
    posts: 120,
    engagement: 3.2,
    views: 12000,
    likes: 2500,
    comments: 850,
    shares: 320
  };
  
  // Eğer analyticsData bir dizi ise (followers dizisi) istatistikleri hesapla
  if (analyticsData && Array.isArray(analyticsData.followers)) {
    const followerData = analyticsData.followers;
    statsData.followers = followerData.length > 0 ? followerData[followerData.length - 1].count : 5000;
  }
  
  // Time series data for charts - Eğer analyticsData var ve followers bir dizi ise
  const timeSeriesData = analyticsData && Array.isArray(analyticsData.followers) 
    ? analyticsData.followers.map(item => ({
        date: new Date(item.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
        followers: item.count,
        engagement: 0, // API'den etkileşim verisi şu an yok
        impressions: 0, // Şu an için varsayılan değer
        interactions: 0 // Şu an için varsayılan değer
      })) 
    : [];
  
  // Daily interactions data
  const dailyInteractionsData = [
    { name: 'Pzt', likes: 240, comments: 45, shares: 15 },
    { name: 'Sal', likes: 300, comments: 60, shares: 25 },
    { name: 'Çar', likes: 280, comments: 55, shares: 20 },
    { name: 'Per', likes: 350, comments: 70, shares: 30 },
    { name: 'Cum', likes: 450, comments: 90, shares: 40 },
    { name: 'Cmt', likes: 380, comments: 75, shares: 35 },
    { name: 'Paz', likes: 320, comments: 65, shares: 30 }
  ];
  
  // Demographics data (example)
  const demographicsData = {
    gender: [
      { name: 'Kadın', value: 65 },
      { name: 'Erkek', value: 35 }
    ],
    age: [
      { name: '13-17', value: 5 },
      { name: '18-24', value: 35 },
      { name: '25-34', value: 30 },
      { name: '35-44', value: 20 },
      { name: '45-54', value: 8 },
      { name: '55+', value: 2 }
    ],
    location: [
      { name: 'Türkiye', value: 75 },
      { name: 'Almanya', value: 8 },
      { name: 'ABD', value: 5 },
      { name: 'İngiltere', value: 4 },
      { name: 'Diğer', value: 8 }
    ]
  };
  
  if (isLoading || !platformData) {
    return (
      <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
        <Sidebar 
          accounts={accounts || []}
          unreadMessageCounts={unreadMessageCounts}
          activeAccount={activeAccount}
          onAccountChange={setActiveAccount}
        />
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="loading-pulse">
            <div className="text-center">
              <i className="ri-loader-4-line text-4xl text-primary mb-4"></i>
              <p className="text-gray-600">Platform verileri yükleniyor...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      <Sidebar 
        accounts={accounts || []}
        unreadMessageCounts={unreadMessageCounts}
        activeAccount={activeAccount}
        onAccountChange={setActiveAccount}
      />
      
      <main className="flex-1 overflow-x-hidden main-content">
        {/* Topbar */}
        <div className="bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center">
            <i className={`${platformData.iconClass} text-2xl ${platformData.color} mr-3`}></i>
            <div>
              <h1 className="text-xl font-semibold text-gray-800">{platformData.label}</h1>
              <p className="text-sm text-gray-500">
                {activeAccount ? activeAccount.name : 'Tüm hesaplar'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Select value={selectedInterval} onValueChange={setSelectedInterval}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Zaman aralığı" />
              </SelectTrigger>
              <SelectContent>
                {TIME_INTERVALS.map(interval => (
                  <SelectItem key={interval.value} value={interval.value}>
                    {interval.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button>
              <i className="ri-add-line mr-2"></i>
              Yeni İçerik
            </Button>
          </div>
        </div>
        
        {/* Account selector (if multiple accounts for this platform) */}
        {accounts?.filter(account => account.platform === params.platform).length > 1 && (
          <div className="bg-white border-b border-gray-200 px-6 py-3">
            <Select 
              value={activeAccount?.id.toString() || ""} 
              onValueChange={(value) => {
                const account = accounts?.find(a => a.id.toString() === value);
                if (account) {
                  setActiveAccount(account);
                }
              }}
            >
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Hesap seçin" />
              </SelectTrigger>
              <SelectContent>
                {accounts?.filter(account => account.platform === params.platform).map(account => (
                  <SelectItem key={account.id} value={account.id.toString()} className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2 overflow-hidden">
                      {account.avatarUrl ? (
                        <img src={account.avatarUrl} alt={account.username} className="h-6 w-6 rounded-full" />
                      ) : (
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                          <i className={`${PLATFORM_DATA[account.platform].iconClass} text-xs ${PLATFORM_DATA[account.platform].color}`}></i>
                        </div>
                      )}
                      <span className="font-medium text-sm truncate">{account.username || account.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        {/* Tabs */}
        <div className="bg-white border-b border-gray-200">
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="w-full max-w-4xl mx-auto"
          >
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
              <TabsTrigger value="content">İçerik</TabsTrigger>
              <TabsTrigger value="audience">Kitle</TabsTrigger>
              <TabsTrigger value="engagement">Etkileşim</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Tab content */}
        <div className="p-4 md:p-6">
          <Tabs value={activeTab}>
            <TabsContent value="overview" className="mt-0">
            {/* Overview tab */}
            <div className="space-y-6">
              {/* Stats cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                  title="Takipçiler"
                  value={statsData.followers}
                  change={12.5}
                />
                
                <StatsCard
                  title="Toplam İçerik"
                  value={statsData.posts}
                  change={8.2}
                />
                
                <StatsCard
                  title="Etkileşim Oranı"
                  value={`${statsData.engagement}%`}
                  change={5.4}
                />
                
                <StatsCard
                  title="Toplam Görüntülenme"
                  value={statsData.views}
                  change={35.8}
                />
              </div>
              
              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Takipçi Artışı</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={timeSeriesData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="followers" 
                            name="Takipçiler" 
                            stroke="#8B5CF6" 
                            activeDot={{ r: 8 }} 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Günlük Etkileşimler</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={dailyInteractionsData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="likes" name="Beğeni" stackId="a" fill="#8B5CF6" />
                          <Bar dataKey="comments" name="Yorum" stackId="a" fill="#EC4899" />
                          <Bar dataKey="shares" name="Paylaşım" stackId="a" fill="#3B82F6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Activities and Messages */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ActivityFeed 
                  activities={activities || []} 
                  onViewAll={handleViewAllActivities}
                />
                
                <MessageList 
                  messages={(messages || []).slice(0, 4)}
                  onMessageClick={handleMessageClick}
                  onNewMessage={handleNewMessage}
                  onViewAll={handleViewAllMessages}
                />
              </div>
              
              {/* Keywords */}
              <KeywordTracking 
                keywords={keywords || []}
                onViewDetails={(keyword) => setLocation("/anahtar-kelimeler")}
                onAddKeyword={() => setLocation("/anahtar-kelimeler")}
                onSearchKeyword={(term) => console.log("Search:", term)}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="content" className="mt-0">
            {/* Content tab */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>İçerik Performansı</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { type: 'Fotoğraf', impressions: 28500, engagement: 2100 },
                          { type: 'Video', impressions: 42000, engagement: 3500 },
                          { type: 'Hikaye', impressions: 32000, engagement: 1800 },
                          { type: 'Reels', impressions: 38000, engagement: 4200 },
                          { type: 'Canlı Yayın', impressions: 21000, engagement: 2800 }
                        ]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="type" />
                        <YAxis yAxisId="left" orientation="left" stroke="#8B5CF6" />
                        <YAxis yAxisId="right" orientation="right" stroke="#EC4899" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="impressions" name="Gösterimler" fill="#8B5CF6" />
                        <Bar yAxisId="right" dataKey="engagement" name="Etkileşimler" fill="#EC4899" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>İçerik İstatistikleri</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>En Yüksek Etkileşim</span>
                          <span className="font-medium">{formatNumber(statsData.engagement * 20)}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: '78%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>Ortalama Etkileşim</span>
                          <span className="font-medium">{formatNumber(statsData.engagement * 10)}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: '65%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>En Yüksek Görüntülenme</span>
                          <span className="font-medium">{formatNumber(statsData.views * 0.2)}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: '92%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>Ortalama Görüntülenme</span>
                          <span className="font-medium">{formatNumber(statsData.views * 0.1)}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: '81%' }}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Etkileşim Verileri</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                            <i className="ri-thumb-up-line text-lg text-primary"></i>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Beğeniler</p>
                            <p className="text-lg font-semibold">{formatNumber(statsData.likes)}</p>
                          </div>
                        </div>
                        <span className="text-green-500 text-sm">+12.5%</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center mr-3">
                            <i className="ri-chat-1-line text-lg text-pink-600"></i>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Yorumlar</p>
                            <p className="text-lg font-semibold">{formatNumber(statsData.comments)}</p>
                          </div>
                        </div>
                        <span className="text-green-500 text-sm">+8.2%</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <i className="ri-share-line text-lg text-blue-600"></i>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Paylaşımlar</p>
                            <p className="text-lg font-semibold">{formatNumber(statsData.shares)}</p>
                          </div>
                        </div>
                        <span className="text-green-500 text-sm">+15.3%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>En İyi Performans Gösteren İçerikler</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium">Ürün Tanıtımı</span>
                          <span className="text-gray-500">3 gün önce</span>
                        </div>
                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                          Yeni ürünümüz hakkında detaylı bilgi için web sitemizi ziyaret edebilirsiniz!
                        </p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">
                            <i className="ri-eye-line mr-1"></i> 8.5K
                          </span>
                          <span className="text-gray-500">
                            <i className="ri-thumb-up-line mr-1"></i> 945
                          </span>
                          <span className="text-gray-500">
                            <i className="ri-chat-1-line mr-1"></i> 87
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium">Kullanıcı Tavsiyeleri</span>
                          <span className="text-gray-500">1 hafta önce</span>
                        </div>
                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                          Kullanıcılarımızdan gelen tavsiyelerle ürünlerimizi sürekli geliştiriyoruz.
                        </p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">
                            <i className="ri-eye-line mr-1"></i> 7.2K
                          </span>
                          <span className="text-gray-500">
                            <i className="ri-thumb-up-line mr-1"></i> 823
                          </span>
                          <span className="text-gray-500">
                            <i className="ri-chat-1-line mr-1"></i> 112
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium">Kampanya Duyurusu</span>
                          <span className="text-gray-500">2 hafta önce</span>
                        </div>
                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                          Bu haftasonu tüm ürünlerimizde %20 indirim fırsatını kaçırmayın!
                        </p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">
                            <i className="ri-eye-line mr-1"></i> 6.8K
                          </span>
                          <span className="text-gray-500">
                            <i className="ri-thumb-up-line mr-1"></i> 756
                          </span>
                          <span className="text-gray-500">
                            <i className="ri-chat-1-line mr-1"></i> 68
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="audience" className="mt-0">
            {/* Audience tab */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Cinsiyet Dağılımı</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={demographicsData.gender}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center space-x-6 mt-4">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-[#8B5CF6] rounded-full mr-2"></div>
                        <span className="text-sm">Kadın: 65%</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-[#EC4899] rounded-full mr-2"></div>
                        <span className="text-sm">Erkek: 35%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Yaş Dağılımı</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          layout="vertical"
                          data={demographicsData.age}
                          margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                          <XAxis type="number" />
                          <YAxis dataKey="name" type="category" />
                          <Tooltip formatter={(value) => `${value}%`} />
                          <Bar dataKey="value" fill="#8B5CF6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Konum Dağılımı</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {demographicsData.location.map((item, index) => (
                        <div key={index}>
                          <div className="flex justify-between mb-1 text-sm">
                            <span>{item.name}</span>
                            <span className="font-medium">{item.value}%</span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary" 
                              style={{ width: `${item.value}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Takipçi Artışı</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={timeSeriesData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="followers" 
                          name="Takipçiler" 
                          stroke="#8B5CF6" 
                          activeDot={{ r: 8 }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Çevrimiçi Saatler</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={Array.from({ length: 24 }, (_, i) => ({
                            hour: `${i}:00`,
                            users: Math.floor(Math.random() * 500) + 500
                          }))}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="hour" />
                          <YAxis />
                          <Tooltip />
                          <Line
                            type="monotone"
                            dataKey="users"
                            name="Aktif Kullanıcılar"
                            stroke="#8B5CF6"
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Takipçi Etkileşimi</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { category: 'Düşük', count: 12500 },
                            { category: 'Orta', count: 28000 },
                            { category: 'Yüksek', count: 15000 }
                          ]}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="category" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" name="Takipçi Sayısı" fill="#8B5CF6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="engagement" className="mt-0">
            {/* Engagement tab */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <StatsCard
                  title="Beğeniler"
                  value={statsData.likes}
                  change={12.5}
                />
                
                <StatsCard
                  title="Yorumlar"
                  value={statsData.comments}
                  change={8.2}
                />
                
                <StatsCard
                  title="Paylaşımlar"
                  value={statsData.shares}
                  change={15.3}
                />
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Etkileşim Trendi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={timeSeriesData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="engagement" 
                          name="Etkileşim" 
                          stroke="#8B5CF6" 
                          activeDot={{ r: 8 }} 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="impressions" 
                          name="Gösterimler" 
                          stroke="#EC4899" 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="interactions" 
                          name="Toplam Etkileşim" 
                          stroke="#3B82F6" 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Haftalık Etkileşim</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={dailyInteractionsData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="likes" name="Beğeni" fill="#8B5CF6" />
                          <Bar dataKey="comments" name="Yorum" fill="#EC4899" />
                          <Bar dataKey="shares" name="Paylaşım" fill="#3B82F6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>İçerik Etkileşimi</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { type: 'Metin', rate: 2.1 },
                            { type: 'Fotoğraf', rate: 4.5 },
                            { type: 'Video', rate: 7.8 },
                            { type: 'Hikaye', rate: 5.4 },
                            { type: 'Canlı', rate: 8.9 }
                          ]}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="type" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`${value}%`, "Etkileşim Oranı"]} />
                          <Bar dataKey="rate" name="Etkileşim Oranı" fill="#8B5CF6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>En Çok Etkileşim Alan Gönderiler</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg mr-3 flex items-center justify-center">
                          <i className="ri-image-line text-gray-500 text-xl"></i>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-gray-900">Ürün Lansmanı</h4>
                            <span className="text-sm text-gray-500">2 gün önce</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1 mb-2">
                            Yeni ürünümüzü piyasaya sürdük! İlk 24 saatte 1000+ sipariş aldık.
                          </p>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="flex items-center text-gray-500">
                              <i className="ri-thumb-up-line mr-1"></i> 1,245
                            </span>
                            <span className="flex items-center text-gray-500">
                              <i className="ri-chat-1-line mr-1"></i> 123
                            </span>
                            <span className="flex items-center text-gray-500">
                              <i className="ri-share-line mr-1"></i> 48
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg mr-3 flex items-center justify-center">
                          <i className="ri-video-line text-gray-500 text-xl"></i>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-gray-900">Müşteri Hikayeleri</h4>
                            <span className="text-sm text-gray-500">1 hafta önce</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1 mb-2">
                            Müşterilerimizin başarı hikayeleri serisinin ilk videosu.
                          </p>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="flex items-center text-gray-500">
                              <i className="ri-thumb-up-line mr-1"></i> 978
                            </span>
                            <span className="flex items-center text-gray-500">
                              <i className="ri-chat-1-line mr-1"></i> 87
                            </span>
                            <span className="flex items-center text-gray-500">
                              <i className="ri-share-line mr-1"></i> 35
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg mr-3 flex items-center justify-center">
                          <i className="ri-gallery-line text-gray-500 text-xl"></i>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-gray-900">Kullanım Kılavuzu</h4>
                            <span className="text-sm text-gray-500">2 hafta önce</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1 mb-2">
                            Ürünlerimizin doğru kullanımı için hazırladığımız kılavuz serisi.
                          </p>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="flex items-center text-gray-500">
                              <i className="ri-thumb-up-line mr-1"></i> 865
                            </span>
                            <span className="flex items-center text-gray-500">
                              <i className="ri-chat-1-line mr-1"></i> 92
                            </span>
                            <span className="flex items-center text-gray-500">
                              <i className="ri-share-line mr-1"></i> 41
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
