"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { PLATFORM_DATA } from "@/lib/constants";
import { PostPreview } from "./PostPreview";
import { PlatformSelector } from "./PlatformSelector";
import { MediaUpload } from "./MediaUpload";
import { SchedulePost } from "./SchedulePost";
import { AIContentGenerator } from "./AIContentGenerator";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import type { Platform } from "@shared/schema";

export function CreatePostForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [content, setContent] = useState("");
  const [medias, setMedias] = useState<{
    files: File[] | [] | null;
    mediaUrls: string[] | [] | null;
  }>({
    files: null,
    mediaUrls: null,
  });
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduleDate, setScheduleDate] = useState<Date | null>(new Date(new Date().setHours(new Date().getHours() + 24)));
  const [scheduleTime, setScheduleTime] = useState<string>("12:00");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("edit");

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleMediaChange = (files: File[] | null, urls: string[] | null) => {
    setMedias({
      files,
      mediaUrls: urls,
    });
  };

  const createPostMutation = useMutation({
    mutationFn: async (postData: any) => {
      return apiRequest("POST", "/api/content", postData);
    },
    onSuccess: () => {
      toast({
        title: "Başarılı!",
        description: isScheduled
          ? "İçerik başarıyla zamanlandı."
          : "İçerik başarıyla paylaşıldı.",
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      
      // Reset form state
      setContent("");
      setMedias({ files: null, mediaUrls: null });
      setSelectedPlatforms([]);
      setIsScheduled(false);
      setScheduleDate(new Date(new Date().setHours(new Date().getHours() + 24)));
      setScheduleTime("12:00");
      
      // Redirect to dashboard
      setLocation("/");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Hata!",
        description: "İçerik paylaşılırken bir hata oluştu. Lütfen tekrar deneyin.",
      });
    }
  });

  const handleSubmit = () => {
    if (!content.trim() && (!medias.files || medias.files.length === 0)) {
      toast({
        variant: "destructive",
        title: "Hata!",
        description: "Lütfen içerik veya medya ekleyin.",
      });
      return;
    }

    if (selectedPlatforms.length === 0) {
      toast({
        variant: "destructive",
        title: "Hata!",
        description: "Lütfen en az bir platform seçin.",
      });
      return;
    }

    if (isScheduled && !scheduleDate) {
      toast({
        variant: "destructive",
        title: "Hata!",
        description: "Lütfen bir zamanlama tarihi seçin.",
      });
      return;
    }

    // Prepare scheduled time if needed
    let scheduledFor = null;
    if (isScheduled && scheduleDate) {
      const [hours, minutes] = scheduleTime.split(":").map(Number);
      scheduledFor = new Date(scheduleDate);
      scheduledFor.setHours(hours);
      scheduledFor.setMinutes(minutes);
      scheduledFor.setSeconds(0);
      scheduledFor.setMilliseconds(0);
    }

    // Collect data for each platform
    const postPromises = selectedPlatforms.map(platform => {
      const platformData = {
        platform,
        content,
        mediaUrls: medias.mediaUrls || [],
        scheduledFor: scheduledFor || new Date(),
        status: isScheduled ? "pending" : "published",
        // In a real application, you would need to specify the social account ID
        socialAccountId: 1 // Using a temporary default ID
      };

      return createPostMutation.mutate(platformData);
    });

    toast({
      title: "İşleniyor...",
      description: "İçeriğiniz işleniyor, lütfen bekleyin."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Yeni İçerik Oluştur</h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Left column - Post content editor */}
        <div className="xl:col-span-3 space-y-6">
          <Card>
            <Tabs defaultValue="edit" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="edit">
                  <i className="ri-edit-line mr-2"></i>
                  İçerik Düzenle
                </TabsTrigger>
                <TabsTrigger value="ai">
                  <i className="ri-ai-generate mr-2"></i>
                  AI ile Oluştur
                </TabsTrigger>
                <TabsTrigger value="preview">
                  <i className="ri-eye-line mr-2"></i>
                  Önizleme
                </TabsTrigger>
              </TabsList>
              <CardContent className="p-6">
                <TabsContent value="edit" className="space-y-6 mt-0">
                  <Textarea
                    placeholder="İçeriğinizi buraya yazın..."
                    className="min-h-[150px] font-medium text-base resize-y"
                    value={content}
                    onChange={handleContentChange}
                  />
                  
                  <MediaUpload 
                    medias={medias}
                    onMediaChange={handleMediaChange}
                    isUploading={isUploadingMedia}
                  />
                </TabsContent>
                
                <TabsContent value="ai" className="mt-0">
                  <AIContentGenerator 
                    onContentGenerated={(generatedContent) => {
                      setContent(generatedContent);
                      setActiveTab("edit");
                    }}
                    platform={selectedPlatforms[0] || "instagram"}
                  />
                </TabsContent>
                
                <TabsContent value="preview" className="mt-0">
                  <div className="flex justify-center">
                    <PostPreview 
                      content={content}
                      mediaUrls={medias.mediaUrls || []}
                      platform={selectedPlatforms[0] || "instagram"}
                    />
                  </div>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>

        {/* Right column - Settings */}
        <div className="xl:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6 space-y-6">
              <PlatformSelector 
                selectedPlatforms={selectedPlatforms}
                setSelectedPlatforms={setSelectedPlatforms}
              />
              
              <div className="border-t border-gray-200 pt-4">
                <SchedulePost 
                  isScheduled={isScheduled}
                  setIsScheduled={setIsScheduled}
                  scheduleDate={scheduleDate}
                  setScheduleDate={setScheduleDate}
                  scheduleTime={scheduleTime}
                  setScheduleTime={setScheduleTime}
                />
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleSubmit}
                  disabled={isLoading || createPostMutation.isPending}
                >
                  {createPostMutation.isPending ? (
                    <div className="flex items-center">
                      <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-white rounded-full"></div>
                      <span>İşleniyor...</span>
                    </div>
                  ) : isScheduled ? (
                    "Zamanla"
                  ) : (
                    "Şimdi Paylaş"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}