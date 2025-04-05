"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { generateCompleteContent } from "@/lib/gemini-service";
import { cn } from "@/lib/utils";
import type { Platform } from "@shared/schema";

interface AIContentGeneratorProps {
  onContentGenerated: (content: string) => void;
  onImageDescriptionGenerated?: (description: string) => void;
  platform: Platform;
}

export function AIContentGenerator({
  onContentGenerated,
  onImageDescriptionGenerated,
  platform
}: AIContentGeneratorProps) {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [imageDescription, setImageDescription] = useState("");
  const [activeTab, setActiveTab] = useState<"content" | "image">("content");

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Lütfen bir açıklama girin."
      });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateCompleteContent(prompt, platform);
      
      setGeneratedContent(result.text);
      setImageDescription(result.imageDescription);
      
      toast({
        title: "İçerik Oluşturuldu",
        description: "AI tarafından içerik başarıyla oluşturuldu."
      });
    } catch (error: any) {
      console.error("İçerik oluşturma hatası:", error);
      toast({
        variant: "destructive",
        title: "İçerik Oluşturma Hatası",
        description: error.message || "İçerik oluşturulurken bir hata oluştu. Lütfen API anahtarının doğru olduğunu kontrol edin."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseContent = () => {
    onContentGenerated(generatedContent);
    toast({
      title: "İçerik Uygulandı",
      description: "Oluşturulan içerik editöre eklendi."
    });
  };

  const handleUseImageDescription = () => {
    if (onImageDescriptionGenerated) {
      onImageDescriptionGenerated(imageDescription);
      toast({
        title: "Görsel Açıklaması Uygulandı",
        description: "Oluşturulan görsel açıklaması editöre eklendi."
      });
    }
  };

  return (
    <div className="space-y-6">
      <Alert variant="default" className="bg-primary/10 border-primary/50">
        <div className="flex items-center gap-2">
          <i className="ri-ai-generate text-xl text-primary"></i>
          <AlertTitle>AI ile İçerik Oluştur</AlertTitle>
        </div>
        <AlertDescription className="mt-2">
          İstediğiniz içeriği kısaca açıklayın, yapay zeka sizin için platform uyumlu bir içerik oluştursun.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="prompt">İçerik Açıklaması</Label>
          <Textarea
            id="prompt"
            placeholder="Ne tür bir içerik oluşturmak istediğinizi açıklayın... Örn: 'Yeni ürünümüz hakkında heyecanlı bir duyuru yazısı' veya 'Kahve dükkânımızın sonbahar menüsü için tanıtım'"
            value={prompt}
            onChange={handlePromptChange}
            className="min-h-[120px] resize-y"
          />
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Oluşturuluyor...</span>
              </>
            ) : (
              <>
                <i className="ri-magic-line"></i>
                <span>İçerik Oluştur</span>
              </>
            )}
          </Button>
        </div>

        {(generatedContent || imageDescription) && (
          <Card className="mt-6">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "content" | "image")}>
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="content">
                  <i className="ri-text-spacing mr-2"></i>
                  İçerik
                </TabsTrigger>
                <TabsTrigger value="image">
                  <i className="ri-image-line mr-2"></i>
                  Görsel Açıklaması
                </TabsTrigger>
              </TabsList>

              <CardContent className="p-4">
                <TabsContent value="content" className="mt-2 space-y-4">
                  <div className="relative border rounded-md p-3 bg-background">
                    <div className="whitespace-pre-wrap text-sm">{generatedContent}</div>
                  </div>
                  <Button onClick={handleUseContent} className="w-full">
                    <i className="ri-check-line mr-2"></i>
                    İçeriği Kullan
                  </Button>
                </TabsContent>

                <TabsContent value="image" className="mt-2 space-y-4">
                  <div className="relative border rounded-md p-3 bg-background">
                    <div className="whitespace-pre-wrap text-sm">{imageDescription}</div>
                  </div>
                  <div className="text-sm text-gray-500 italic mb-2">
                    Not: Bu açıklama, görselin nasıl olması gerektiğini tarif eder. 
                    Şu an AI ile doğrudan görsel oluşturma desteklenmemektedir.
                  </div>
                  {onImageDescriptionGenerated && (
                    <Button 
                      onClick={handleUseImageDescription} 
                      variant="outline"
                      className="w-full"
                    >
                      <i className="ri-image-add-line mr-2"></i>
                      Görsel Açıklamasını Kullan
                    </Button>
                  )}
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        )}
      </div>
    </div>
  );
}