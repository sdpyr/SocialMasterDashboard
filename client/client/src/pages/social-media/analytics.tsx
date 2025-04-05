import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/dashboard/sidebar";
import { DEMO_USER_ID, PLATFORM_DATA, TIME_INTERVALS } from "@/lib/constants";
import { getDateRangeFromInterval } from "@/lib/utils";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import useAccounts from "@/hooks/use-accounts";
import useDateRange from "@/hooks/use-date-range";

export default function Analytics() {
  const { accounts, isLoading: isLoadingAccounts, activeAccount, setActiveAccount } = useAccounts();
  const { dateRange, selectedInterval, setSelectedInterval } = useDateRange();
  const [selectedMetric, setSelectedMetric] = useState("followers");
  
  // Calculate unread message counts
  const unreadMessageCounts: Record<string, number> = {};
  
  // Fetch analytics data
  const { data: analyticsData, isLoading: isLoadingAnalytics } = useQuery({
    queryKey: [
      activeAccount ? 
        `/api/analytics/${activeAccount.id}?startDate=${dateRange.startDate.toISOString()}&endDate=${dateRange.endDate.toISOString()}` 
        : null
    ],
    enabled: !!activeAccount
  });
  
  // Compare with previous period
  const prevDateRange = {
    startDate: new Date(dateRange.startDate.getTime() - (dateRange.endDate.getTime() - dateRange.startDate.getTime())),
    endDate: new Date(dateRange.startDate)
  };
  
  const { data: previousAnalyticsData, isLoading: isLoadingPrevious } = useQuery({
    queryKey: [
      activeAccount ? 
        `/api/analytics/${activeAccount.id}?startDate=${prevDateRange.startDate.toISOString()}&endDate=${prevDateRange.endDate.toISOString()}` 
        : null
    ],
    enabled: !!activeAccount
  });
  
  const isLoading = isLoadingAccounts || isLoadingAnalytics || isLoadingPrevious;
  
  // For followers growth chart data
  const chartData = {
    labels: ["1 Oca", "15 Oca", "1 Şub", "15 Şub", "1 Mar", "15 Mar"],
    datasets: [
      {
        platform: "instagram",
        data: [140, 120, 100, 70, 40, 10],
      },
      {
        platform: "youtube",
        data: [170, 160, 150, 145, 100, 50],
      },
      {
        platform: "tiktok",
        data: [180, 170, 160, 140, 90, 30],
      },
      {
        platform: "facebook",
        data: [150, 145, 140, 130, 105, 75],
      },
    ],
  };
  
  // For engagement distribution chart data
  const engagementData = [
    { platform: "instagram", value: 14280, percentage: 42 },
    { platform: "youtube", value: 9576, percentage: 28 },
    { platform: "tiktok", value: 6156, percentage: 18 },
    { platform: "facebook", value: 4104, percentage: 12 },
  ];
  
  // Processed analytics data for charts
  const processedData = analyticsData?.map(item => ({
    date: new Date(item.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
    followers: item.followers,
    engagement: item.engagement,
    impressions: item.impressions,
    likes: item.likes || 0,
    comments: item.comments || 0,
    shares: item.shares || 0,
    views: item.views || 0,
  })) || [];
  
  // For summary stats
  const currentMetricTotal = processedData.reduce((sum, item) => sum + (item[selectedMetric as keyof typeof item] as number || 0), 0);
  const previousMetricTotal = previousAnalyticsData?.reduce(
    (sum, item) => sum + (item[selectedMetric as keyof typeof item] as number || 0), 
    0
  ) || 0;
  
  const percentChange = previousMetricTotal === 0 
    ? 100 
    : Math.round(((currentMetricTotal - previousMetricTotal) / previousMetricTotal) * 100);
  
  // Calculate summary data
  const summaryData = {
    followers: {
      current: processedData.length > 0 ? processedData[processedData.length - 1].followers : 0,
      change: percentChange
    },
    engagement: {
      total: currentMetricTotal,
      change: percentChange
    },
    impressions: {
      total: processedData.reduce((sum, item) => sum + item.impressions, 0),
      change: percentChange
    },
    interactions: {
      total: processedData.reduce((sum, item) => sum + (item.likes || 0) + (item.comments || 0) + (item.shares || 0), 0),
      change: percentChange
    }
  };
  
  // Comparison chart data
  const comparisonData = [
    { name: "Beğeniler", current: processedData.reduce((sum, item) => sum + (item.likes || 0), 0), previous: 4500 },
    { name: "Yorumlar", current: processedData.reduce((sum, item) => sum + (item.comments || 0), 0), previous: 1200 },
    { name: "Paylaşımlar", current: processedData.reduce((sum, item) => sum + (item.shares || 0), 0), previous: 800 },
    { name: "Görüntülemeler", current: processedData.reduce((sum, item) => sum + (item.views || 0), 0), previous: 15000 }
  ];
  
  // Platform distribution data for pie chart
  const platformDistribution = [
    { name: "Instagram", value: 42 },
    { name: "YouTube", value: 28 },
    { name: "TikTok", value: 18 },
    { name: "Facebook", value: 12 }
  ];
  
  const platformColors = {
    Instagram: "#E1306C",
    YouTube: "#FF0000",
    TikTok: "#000000",
    Facebook: "#4267B2"
  };
  
  if (isLoading) {
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
              <p className="text-gray-600">Analizler yükleniyor...</p>
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
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Analizler</h1>
            <p className="text-sm text-gray-500">
              {activeAccount 
                ? `${activeAccount.name} hesabı için analiz verileri` 
                : "Hesap analiz verilerini görüntüleyin"}
            </p>
          </div>
          
          {/* Date range selector */}
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
            
            <Button variant="outline">
              <i className="ri-download-line mr-2"></i>
              Rapor İndir
            </Button>
          </div>
        </div>
        
        {/* Analytics content */}
        <div className="p-4 md:p-6">
          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-500">Takipçiler</span>
                  <span className={`flex items-center text-xs font-medium ${summaryData.followers.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                    <i className={`${summaryData.followers.change >= 0 ? "ri-arrow-up-line" : "ri-arrow-down-line"} mr-1`}></i>
                    {Math.abs(summaryData.followers.change)}%
                  </span>
                </div>
                <div className="flex items-baseline">
                  <h3 className="text-2xl font-bold text-gray-900">{summaryData.followers.current.toLocaleString()}</h3>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-500">Etkileşimler</span>
                  <span className={`flex items-center text-xs font-medium ${summaryData.engagement.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                    <i className={`${summaryData.engagement.change >= 0 ? "ri-arrow-up-line" : "ri-arrow-down-line"} mr-1`}></i>
                    {Math.abs(summaryData.engagement.change)}%
                  </span>
                </div>
                <div className="flex items-baseline">
                  <h3 className="text-2xl font-bold text-gray-900">{summaryData.engagement.total.toLocaleString()}</h3>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-500">Görüntülenmeler</span>
                  <span className={`flex items-center text-xs font-medium ${summaryData.impressions.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                    <i className={`${summaryData.impressions.change >= 0 ? "ri-arrow-up-line" : "ri-arrow-down-line"} mr-1`}></i>
                    {Math.abs(summaryData.impressions.change)}%
                  </span>
                </div>
                <div className="flex items-baseline">
                  <h3 className="text-2xl font-bold text-gray-900">{summaryData.impressions.total.toLocaleString()}</h3>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-500">Toplam Etkileşim</span>
                  <span className={`flex items-center text-xs font-medium ${summaryData.interactions.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                    <i className={`${summaryData.interactions.change >= 0 ? "ri-arrow-up-line" : "ri-arrow-down-line"} mr-1`}></i>
                    {Math.abs(summaryData.interactions.change)}%
                  </span>
                </div>
                <div className="flex items-baseline">
                  <h3 className="text-2xl font-bold text-gray-900">{summaryData.interactions.total.toLocaleString()}</h3>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Charts rows */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Takipçi Büyümesi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={processedData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: number) => [value.toLocaleString(), ""]}
                        labelFormatter={(label) => `${label}`}
                      />
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
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Etkileşim Dağılımı</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={engagementData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="platform"
                        label={({ platform, percent }) => `${platform} ${(percent * 100).toFixed(0)}%`}
                      >
                        {engagementData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={platformColors[entry.platform === "instagram" ? "Instagram" : 
                                  entry.platform === "youtube" ? "YouTube" : 
                                  entry.platform === "tiktok" ? "TikTok" : 
                                  "Facebook"]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Detailed metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="w-full h-full bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <h3 className="text-lg font-medium mb-4">Metrik Karşılaştırması</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={comparisonData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [value.toLocaleString(), ""]}
                      labelFormatter={(label) => `${label}`}
                    />
                    <Legend />
                    <Bar dataKey="current" name="Güncel Dönem" fill="#8B5CF6" />
                    <Bar dataKey="previous" name="Önceki Dönem" fill="#C4B5FD" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="w-full h-full bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <h3 className="text-lg font-medium mb-4">Metrik Trendi</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={processedData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [value.toLocaleString(), ""]}
                      labelFormatter={(label) => `${label}`}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="followers" 
                      name="Takipçiler" 
                      stroke="#8B5CF6" 
                      activeDot={{ r: 8 }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="engagement" 
                      name="Etkileşim" 
                      stroke="#EC4899" 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="impressions" 
                      name="Görüntülenme" 
                      stroke="#3B82F6" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="w-full h-full bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <h3 className="text-lg font-medium mb-4">Platform Dağılımı</h3>
              <div className="h-[300px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={platformDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {platformDistribution.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={platformColors[entry.name as keyof typeof platformColors]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [`${value}%`, ""]}
                      labelFormatter={(label) => `${label}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="w-full h-full bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <h3 className="text-lg font-medium mb-4">Haftalık Performans</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { date: '12 Mar', likes: 240, comments: 80, shares: 36 },
                      { date: '13 Mar', likes: 258, comments: 53, shares: 25 },
                      { date: '14 Mar', likes: 326, comments: 65, shares: 42 },
                      { date: '15 Mar', likes: 412, comments: 78, shares: 51 },
                      { date: '16 Mar', likes: 367, comments: 92, shares: 38 },
                      { date: '17 Mar', likes: 421, comments: 116, shares: 63 },
                      { date: '18 Mar', likes: 489, comments: 134, shares: 78 }
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [value.toLocaleString(), ""]}
                      labelFormatter={(label) => `${label}`}
                    />
                    <Legend />
                    <Bar 
                      stackId="a" 
                      dataKey="likes" 
                      name="Beğeni" 
                      fill="#EC4899" 
                    />
                    <Bar 
                      stackId="a" 
                      dataKey="comments" 
                      name="Yorum" 
                      fill="#8B5CF6" 
                    />
                    <Bar 
                      stackId="a" 
                      dataKey="shares" 
                      name="Paylaşım" 
                      fill="#3B82F6" 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
