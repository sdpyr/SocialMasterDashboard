import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/dashboard/layout";
import StatCard from "@/components/dashboard/stat-card";
import ActivityItem from "@/components/dashboard/activity-item";
import QuickActionButton from "@/components/dashboard/quick-action-button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ActivityLog, BlogPost, Media } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Edit, PlusCircle, FileUp, Save, BarChart3, Image, FilePlus, Plus } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  
  // Fetch analytics summary
  const { data: analyticsSummary, isLoading: isLoadingAnalytics } = useQuery({
    queryKey: ["/api/analytics/summary"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });
  
  // Fetch activity logs
  const { data: activityLogs = [], isLoading: isLoadingLogs } = useQuery<ActivityLog[]>({
    queryKey: ["/api/activity-logs"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });
  
  // Fetch blog posts
  const { data: blogPosts = [], isLoading: isLoadingBlogPosts } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });
  
  // Helper function to format relative time
  const getRelativeTime = (timestamp: Date | string | null) => {
    if (!timestamp) return '';
    
    const now = new Date();
    const date = new Date(timestamp);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'Az önce';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} dakika önce`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} saat önce`;
    const days = Math.floor(hours / 24);
    return `${days} gün önce`;
  };
  
  // Get the appropriate icon for activity log
  const getActivityIcon = (action: string) => {
    switch (action) {
      case 'create':
        return PlusCircle;
      case 'update':
        return Edit;
      case 'upload':
        return FileUp;
      case 'delete':
        return Image;
      default:
        return Edit;
    }
  };
  
  // Get the appropriate color for activity log
  const getActivityColor = (action: string) => {
    switch (action) {
      case 'create':
        return 'text-green-600';
      case 'update':
        return 'text-primary';
      case 'upload':
        return 'text-blue-600';
      case 'delete':
        return 'text-red-600';
      default:
        return 'text-primary';
    }
  };
  
  // Transform the recent activity logs for display
  const recentActivities = activityLogs
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Ziyaretçiler"
            value={isLoadingAnalytics ? "Yükleniyor..." : analyticsSummary?.totalVisitors || 0}
            icon={BarChart3}
            iconColor="text-primary"
            iconBgColor="bg-primary/10"
            footerText="Detaylı Rapor"
            footerLink="/analytics"
          />
          
          <StatCard
            title="Sayfa Görüntüleme"
            value={isLoadingAnalytics ? "Yükleniyor..." : analyticsSummary?.totalPageViews || 0}
            icon={BarChart3}
            iconColor="text-green-600"
            iconBgColor="bg-green-100"
            footerText="Detaylı Rapor"
            footerLink="/analytics"
          />
          
          <StatCard
            title="Blog Yazıları"
            value={isLoadingBlogPosts ? "Yükleniyor..." : blogPosts.length}
            icon={FilePlus}
            iconColor="text-blue-600"
            iconBgColor="bg-blue-100"
            footerText="Yönet"
            footerLink="/blog"
          />
          
          <StatCard
            title="Medya Dosyaları"
            value={isLoadingAnalytics ? "Yükleniyor..." : analyticsSummary?.mediaCount || 0}
            icon={Image}
            iconColor="text-yellow-600"
            iconBgColor="bg-yellow-100"
            footerText="Medya Kütüphanesi"
            footerLink="/media"
          />
        </div>
        
        {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle>Son Aktiviteler</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingLogs ? (
                <div className="py-8 text-center text-muted-foreground">
                  Aktiviteler yükleniyor...
                </div>
              ) : recentActivities.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  Henüz aktivite kaydı bulunmamaktadır.
                </div>
              ) : (
                <ul className="divide-y">
                  {recentActivities.map((activity) => (
                    <ActivityItem 
                      key={activity.id}
                      icon={getActivityIcon(activity.action)}
                      iconColor={getActivityColor(activity.action)}
                      title={
                        activity.action === 'create' ? 'Yeni içerik oluşturuldu' :
                        activity.action === 'update' ? 'İçerik güncellendi' :
                        activity.action === 'upload' ? 'Dosya yüklendi' :
                        activity.action === 'delete' ? 'İçerik silindi' :
                        'İşlem gerçekleştirildi'
                      }
                      description={activity.details}
                      timestamp={getRelativeTime(activity.createdAt)}
                    />
                  ))}
                </ul>
              )}
            </CardContent>
            <CardFooter className="bg-muted/50 py-3">
              <a href="/api/activity-logs" className="text-sm font-medium text-primary hover:text-primary/80">
                Tüm aktiviteleri görüntüle
              </a>
            </CardFooter>
          </Card>
          
          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Hızlı İşlemler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <QuickActionButton
                  icon={Plus}
                  text="Yeni Blog Yazısı"
                  href="/blog"
                  iconColor="text-primary"
                />
                
                <QuickActionButton
                  icon={FilePlus}
                  text="Yeni Sayfa"
                  href="/pages"
                  iconColor="text-primary"
                />
                
                <QuickActionButton
                  icon={FileUp}
                  text="Medya Yükle"
                  href="/media"
                  iconColor="text-primary"
                />
                
                <QuickActionButton
                  icon={Save}
                  text="Yedek Al"
                  href="/backup"
                  iconColor="text-primary"
                />
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Son Blog Yorumları</h4>
                {blogPosts.length > 0 ? (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium">Henüz yorum bulunmamaktadır</p>
                    <p className="text-xs text-muted-foreground">
                      Yeni yorumlar burada görüntülenecektir.
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium">Henüz blog yazısı bulunmamaktadır</p>
                    <p className="text-xs text-muted-foreground">
                      Blog yazısı oluşturmak için "Yeni Blog Yazısı" butonunu kullanabilirsiniz.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

// Import required function from queryClient.ts
import { getQueryFn } from "@/lib/queryClient";
