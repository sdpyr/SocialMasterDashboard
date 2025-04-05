import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import VideoUploadComponent from "@/components/create-post/VideoUploadComponent";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import { useTranslation } from "@/i18n";

export default function CreatePost() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("video");
  const { t, currentLanguage } = useTranslation();
  
  // Kullanıcı hesaplarını getir
  const { data: accounts, isLoading, error } = useQuery({
    queryKey: ["/api/accounts"],
    async queryFn() {
      try {
        const response = await apiRequest("GET", "/api/accounts");
        const data = await response.json();
        return data;
      } catch (err) {
        console.error("Hesaplar yüklenirken hata oluştu:", err);
        throw new Error("Sosyal medya hesapları yüklenirken bir hata oluştu.");
      }
    }
  });

  // Hata durumunu kontrol et
  useEffect(() => {
    if (error) {
      toast({
        title: currentLanguage === 'tr' ? "Hesap Bilgileri Yüklenemedi" : "Account Information Could Not Be Loaded",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  }, [error, toast, currentLanguage]);

  return (
    <DashboardLayout>
      <main className="container py-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{currentLanguage === 'tr' ? 'İçerik Oluştur' : 'Create Content'}</h1>
          <p className="text-muted-foreground mb-6">
            {currentLanguage === 'tr' ? 'Birden fazla platforma içerik yükle, zamanla ve yönet' : 'Upload, schedule and manage content across multiple platforms'}
          </p>
          <Separator />
        </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="video">Video</TabsTrigger>
          <TabsTrigger value="image" disabled>Görsel/Fotoğraf</TabsTrigger>
          <TabsTrigger value="text" disabled>Metin İçeriği</TabsTrigger>
        </TabsList>

        <TabsContent value="video" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Video Paylaşımı</CardTitle>
              <CardDescription>
                Tik Tok, Instagram Reels ve YouTube Shorts için video içeriği yükleyin
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
              ) : (
                <VideoUploadComponent accounts={accounts || []} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="image">
          <Card>
            <CardHeader>
              <CardTitle>Görsel Paylaşımı</CardTitle>
              <CardDescription>
                Instagram, Facebook ve diğer platformlar için görsel içerik yükleyin (Yakında)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <p className="text-muted-foreground">
                  Bu özellik yakında kullanıma sunulacak.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="text">
          <Card>
            <CardHeader>
              <CardTitle>Metin Paylaşımı</CardTitle>
              <CardDescription>
                X (Twitter), LinkedIn ve diğer platformlar için metin içeriği oluşturun (Yakında)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <p className="text-muted-foreground">
                  Bu özellik yakında kullanıma sunulacak.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
    </DashboardLayout>
  );
}