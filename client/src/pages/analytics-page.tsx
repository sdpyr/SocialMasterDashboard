import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Analytics } from "@shared/schema";
import { getQueryFn } from "@/lib/queryClient";
import DashboardLayout from "@/components/dashboard/layout";
import StatCard from "@/components/dashboard/stat-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  LineChart,
  PieChart,
  DonutChart,
  AreaChart,
} from "@/components/ui/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Loader2,
  Users,
  Eye,
  MousePointerClick,
  Clock,
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Calendar,
  Share2,
  Monitor,
  Smartphone,
  Tablet,
  MapPin,
} from "lucide-react";

// Analytics page props
interface AnalyticsPageProps {}

// Date range options
const dateRanges = [
  { value: "today", label: "Bugün" },
  { value: "yesterday", label: "Dün" },
  { value: "7days", label: "Son 7 Gün" },
  { value: "30days", label: "Son 30 Gün" },
  { value: "90days", label: "Son 90 Gün" },
  { value: "custom", label: "Özel Aralık" },
];

// Comparison options
const comparisonOptions = [
  { value: "none", label: "Karşılaştırma Yok" },
  { value: "previous_period", label: "Önceki Dönem" },
  { value: "previous_year", label: "Önceki Yıl" },
];

// Mock data for charts (in a real app, this would come from the API)
const generateMockData = () => {
  // Daily visitors data for line chart
  const visitorData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    visitors: Math.floor(Math.random() * 300) + 100,
    pageViews: Math.floor(Math.random() * 1000) + 300,
  }));

  // Device data for pie chart
  const deviceData = [
    { name: "Masaüstü", value: 56 },
    { name: "Mobil", value: 32 },
    { name: "Tablet", value: 12 },
  ];

  // Top pages data for bar chart
  const pagesData = [
    { name: "Ana Sayfa", views: 1245 },
    { name: "Hakkımızda", views: 834 },
    { name: "Ürünler", views: 753 },
    { name: "Blog", views: 642 },
    { name: "İletişim", views: 512 },
  ].sort((a, b) => b.views - a.views);

  // Referrer data for pie chart
  const referrerData = [
    { name: "Google", value: 45 },
    { name: "Doğrudan", value: 25 },
    { name: "Facebook", value: 15 },
    { name: "Twitter", value: 8 },
    { name: "Instagram", value: 7 },
  ];

  // Countries data for bar chart
  const countriesData = [
    { name: "Türkiye", value: 65 },
    { name: "ABD", value: 12 },
    { name: "Almanya", value: 8 },
    { name: "İngiltere", value: 6 },
    { name: "Fransa", value: 4 },
    { name: "Diğer", value: 5 },
  ];

  // Top pages table data
  const topPagesTable = [
    { path: "/", title: "Ana Sayfa", views: 1245, avgTime: "02:15" },
    { path: "/about", title: "Hakkımızda", views: 834, avgTime: "01:42" },
    { path: "/products", title: "Ürünler", views: 753, avgTime: "03:10" },
    { path: "/blog", title: "Blog", views: 642, avgTime: "04:22" },
    { path: "/contact", title: "İletişim", views: 512, avgTime: "01:05" },
    { path: "/services", title: "Hizmetler", views: 423, avgTime: "02:33" },
    { path: "/blog/top-10-tips", title: "10 İpucu - Blog Yazısı", views: 387, avgTime: "05:17" },
    { path: "/blog/how-to-start", title: "Nasıl Başlanır - Blog Yazısı", views: 322, avgTime: "04:45" },
    { path: "/faq", title: "SSS", views: 289, avgTime: "02:50" },
    { path: "/terms", title: "Kullanım Koşulları", views: 217, avgTime: "01:15" },
  ];

  return {
    visitorData,
    deviceData,
    pagesData,
    referrerData,
    countriesData,
    topPagesTable,
  };
};

export default function AnalyticsPage({}: AnalyticsPageProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState("30days");
  const [comparison, setComparison] = useState("none");
  const [chartType, setChartType] = useState<"line" | "bar">("line");
  
  // Fetch analytics data
  const { data: analyticsData, isLoading } = useQuery<Analytics[]>({
    queryKey: ["/api/analytics"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });
  
  // Fetch analytics summary
  const { data: analyticsSummary, isLoading: isLoadingSummary } = useQuery<{ totalVisitors: number, totalPageViews: number }>({
    queryKey: ["/api/analytics/summary"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });
  
  // Generate mock data for charts
  const mockData = generateMockData();
  
  if (isLoading || isLoadingSummary) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Site İstatistikleri</h2>
            <p className="text-muted-foreground">
              Sitenizin ziyaretçi ve performans analizi.
            </p>
          </div>
          <div className="flex space-x-2">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tarih Aralığı" />
              </SelectTrigger>
              <SelectContent>
                {dateRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={comparison} onValueChange={setComparison}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Karşılaştırma" />
              </SelectTrigger>
              <SelectContent>
                {comparisonOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Toplam Ziyaretçi"
            value={5248}
            icon={Users}
            iconColor="text-primary"
            iconBgColor="bg-primary/10"
            footerText={`${dateRange === "30days" ? "Son 30 gün" : dateRanges.find(r => r.value === dateRange)?.label}`}
          />
          
          <StatCard
            title="Sayfa Görüntüleme"
            value={13624}
            icon={Eye}
            iconColor="text-green-600"
            iconBgColor="bg-green-100"
            footerText={`${dateRange === "30days" ? "Son 30 gün" : dateRanges.find(r => r.value === dateRange)?.label}`}
          />
          
          <StatCard
            title="Ortalama Etkileşim"
            value="4.2dk"
            icon={Clock}
            iconColor="text-blue-600"
            iconBgColor="bg-blue-100"
            footerText="Ortalama oturum süresi"
          />
          
          <StatCard
            title="Hemen Çıkma Oranı"
            value="36%"
            icon={MousePointerClick}
            iconColor="text-yellow-600"
            iconBgColor="bg-yellow-100"
            footerText="Tüm ziyaretler"
          />
        </div>

        {/* Main Analytics Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
            <TabsTrigger value="audience">Kitle</TabsTrigger>
            <TabsTrigger value="acquisition">Trafik Kaynakları</TabsTrigger>
            <TabsTrigger value="behavior">Davranış</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Ziyaretçi ve Sayfa Görüntüleme</CardTitle>
                  <CardDescription>
                    Zamana göre ziyaretçi ve sayfa görüntüleme sayıları
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className={`p-1 ${chartType === "line" ? "text-primary" : "text-muted-foreground"}`}
                    onClick={() => setChartType("line")}
                  >
                    <LineChartIcon className="h-5 w-5" />
                  </button>
                  <button
                    className={`p-1 ${chartType === "bar" ? "text-primary" : "text-muted-foreground"}`}
                    onClick={() => setChartType("bar")}
                  >
                    <BarChart3 className="h-5 w-5" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {chartType === "line" ? (
                  <LineChart
                    data={mockData.visitorData}
                    xKey="date"
                    yKey={["visitors", "pageViews"]}
                    className="h-96"
                  />
                ) : (
                  <BarChart
                    data={mockData.visitorData}
                    xKey="date"
                    yKey={["visitors", "pageViews"]}
                    className="h-96"
                  />
                )}
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>En Çok Ziyaret Edilen Sayfalar</CardTitle>
                  <CardDescription>
                    En popüler içeriklerinizi görüntüleyin
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <BarChart
                    data={mockData.pagesData}
                    xKey="name"
                    yKey="views"
                    className="h-96"
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Cihaz Dağılımı</CardTitle>
                  <CardDescription>
                    Ziyaretçilerin kullandığı cihaz türleri
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <DonutChart
                    data={mockData.deviceData}
                    nameKey="name"
                    valueKey="value"
                    className="h-96"
                  />
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Popüler Sayfalar</CardTitle>
                <CardDescription>
                  En çok görüntülenen sayfalar ve metrikler
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sayfa</TableHead>
                      <TableHead className="text-right">Görüntüleme</TableHead>
                      <TableHead className="text-right">Ort. Süre</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockData.topPagesTable.slice(0, 5).map((page) => (
                      <TableRow key={page.path}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{page.title}</div>
                            <div className="text-sm text-muted-foreground">{page.path}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{page.views.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{page.avgTime}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Audience Tab */}
          <TabsContent value="audience" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Demografik Bilgiler</CardTitle>
                  <CardDescription>
                    Kullanıcıların demografik dağılımı
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-10">
                    <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Demografik veriler henüz toplanmaya başlamamıştır. Google Analytics entegrasyonu ekleyerek bu verilere erişebilirsiniz.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Ülke Dağılımı</CardTitle>
                  <CardDescription>
                    Ziyaretçilerin konum dağılımı
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <BarChart
                    data={mockData.countriesData}
                    xKey="name"
                    yKey="value"
                    className="h-80"
                  />
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Cihaz ve Tarayıcı</CardTitle>
                <CardDescription>
                  Kullanıcıların cihaz ve tarayıcı dağılımı
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-sm font-medium mb-3">Cihaz Kategorisi</h3>
                    <PieChart
                      data={mockData.deviceData}
                      nameKey="name"
                      valueKey="value"
                      className="h-60"
                    />
                    <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                      <div className="flex flex-col items-center">
                        <Monitor className="h-5 w-5 text-muted-foreground mb-1" />
                        <div className="text-sm font-medium">%56</div>
                        <div className="text-xs text-muted-foreground">Masaüstü</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <Smartphone className="h-5 w-5 text-muted-foreground mb-1" />
                        <div className="text-sm font-medium">%32</div>
                        <div className="text-xs text-muted-foreground">Mobil</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <Tablet className="h-5 w-5 text-muted-foreground mb-1" />
                        <div className="text-sm font-medium">%12</div>
                        <div className="text-xs text-muted-foreground">Tablet</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-3">İşletim Sistemi</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">Windows</span>
                          <span className="text-sm font-medium">42%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div className="bg-primary h-2.5 rounded-full" style={{ width: '42%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">Android</span>
                          <span className="text-sm font-medium">28%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div className="bg-primary h-2.5 rounded-full" style={{ width: '28%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">iOS</span>
                          <span className="text-sm font-medium">18%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div className="bg-primary h-2.5 rounded-full" style={{ width: '18%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">macOS</span>
                          <span className="text-sm font-medium">8%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div className="bg-primary h-2.5 rounded-full" style={{ width: '8%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">Linux</span>
                          <span className="text-sm font-medium">4%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div className="bg-primary h-2.5 rounded-full" style={{ width: '4%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-3">Tarayıcı</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">Chrome</span>
                          <span className="text-sm font-medium">62%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div className="bg-primary h-2.5 rounded-full" style={{ width: '62%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">Safari</span>
                          <span className="text-sm font-medium">14%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div className="bg-primary h-2.5 rounded-full" style={{ width: '14%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">Firefox</span>
                          <span className="text-sm font-medium">12%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div className="bg-primary h-2.5 rounded-full" style={{ width: '12%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">Edge</span>
                          <span className="text-sm font-medium">8%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div className="bg-primary h-2.5 rounded-full" style={{ width: '8%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">Diğer</span>
                          <span className="text-sm font-medium">4%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div className="bg-primary h-2.5 rounded-full" style={{ width: '4%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Acquisition Tab */}
          <TabsContent value="acquisition" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Trafik Kaynakları</CardTitle>
                <CardDescription>
                  Ziyaretçilerin geldiği kaynaklar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <PieChart
                    data={mockData.referrerData}
                    nameKey="name"
                    valueKey="value"
                    className="h-80"
                  />
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Kaynak Dağılımı</h3>
                    
                    {mockData.referrerData.map((source) => (
                      <div key={source.name}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center">
                            <Share2 className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-sm">{source.name}</span>
                          </div>
                          <span className="text-sm font-medium">%{source.value}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div 
                            className="bg-primary h-2.5 rounded-full" 
                            style={{ width: `${source.value}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="pt-4">
                      <h3 className="text-sm font-medium mb-2">İçgörüler</h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <span className="mr-2 text-primary">•</span>
                          Ziyaretçilerinizin %45'i arama motorlarından geliyor.
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2 text-primary">•</span>
                          Sosyal medya trafiğinde en yüksek payı Facebook oluşturuyor.
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2 text-primary">•</span>
                          Doğrudan trafiğiniz %25 ile güçlü bir marka bilinirliğini gösteriyor.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Coğrafi Dağılım</CardTitle>
                <CardDescription>
                  Ziyaretçilerin ülkelere göre dağılımı
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <BarChart
                      data={mockData.countriesData}
                      xKey="name"
                      yKey="value"
                      className="h-80"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Ülke</TableHead>
                          <TableHead className="text-right">Ziyaretçi</TableHead>
                          <TableHead className="text-right">Oran</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockData.countriesData.map((country) => (
                          <TableRow key={country.name}>
                            <TableCell>
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                                {country.name}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">{Math.round(country.value * 52.48)}</TableCell>
                            <TableCell className="text-right">%{country.value}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Behavior Tab */}
          <TabsContent value="behavior" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tüm Sayfalar</CardTitle>
                <CardDescription>
                  Tüm sayfaların performans metrikleri
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sayfa</TableHead>
                      <TableHead className="text-right">Görüntüleme</TableHead>
                      <TableHead className="text-right">Benzersiz Görüntüleme</TableHead>
                      <TableHead className="text-right">Ort. Süre</TableHead>
                      <TableHead className="text-right">Hemen Çıkma</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockData.topPagesTable.map((page) => (
                      <TableRow key={page.path}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{page.title}</div>
                            <div className="text-sm text-muted-foreground">{page.path}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{page.views.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{Math.round(page.views * 0.75).toLocaleString()}</TableCell>
                        <TableCell className="text-right">{page.avgTime}</TableCell>
                        <TableCell className="text-right">{`${Math.round(Math.random() * 60)}%`}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sayfa Yükleme Süresi</CardTitle>
                  <CardDescription>
                    Ortalama sayfa yükleme süresi (saniye)
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <LineChart
                    data={mockData.visitorData.map(item => ({
                      ...item,
                      loadTime: (Math.random() * 2 + 1).toFixed(2)
                    }))}
                    xKey="date"
                    yKey="loadTime"
                    className="h-80"
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Etkileşim Metrikleri</CardTitle>
                  <CardDescription>
                    Kullanıcı etkileşim metrikleri
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Ortalama Oturum Süresi</span>
                        <span className="text-sm font-medium">4:12</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Oturum Başına Sayfa</span>
                        <span className="text-sm font-medium">3.4</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: '68%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Hemen Çıkma Oranı</span>
                        <span className="text-sm font-medium">36%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: '36%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Geri Dönüş Oranı</span>
                        <span className="text-sm font-medium">48%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: '48%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Sayfa Başına Tıklama</span>
                        <span className="text-sm font-medium">5.7</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: '57%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
