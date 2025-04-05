import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Loader2, Sparkles, Copy, ThumbsUp, ThumbsDown, RefreshCw, Save, Calendar, ArrowRight, Image, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import { generateSocialMediaContent, generateCompleteContent, generateContentIdeas, generateContentCalendar } from "@/lib/ai-services";
import { PLATFORMS } from "@/lib/constants";
import { useTranslation } from "@/i18n";

export default function ContentGenerationPage() {
  const { t, currentLanguage } = useTranslation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("generate");
  const [topic, setTopic] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("instagram");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<{ text: string; imageDescription: string } | null>(null);
  const [contentIdeas, setContentIdeas] = useState<Array<{ title: string; description: string; platform: string; contentType: string; estimatedEngagement: string }>>([]);
  const [contentCalendar, setContentCalendar] = useState<Array<{ date: string; title: string; contentType: string; description: string; topics: string[]; bestTimeToPost: string }>>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [customTopic, setCustomTopic] = useState("");
  const [calendarDuration, setCalendarDuration] = useState("7");
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false);
  const [isGeneratingCalendar, setIsGeneratingCalendar] = useState(false);

  // Hesapları getir
  const { data: accounts = [] } = useQuery({
    queryKey: ["/api/accounts", 1],
    queryFn: () => apiRequest("GET", "/api/accounts/1").then(res => res.json()),
  });

  // Mevcut anahtar kelimeleri getir
  const { data: keywords = [] } = useQuery({
    queryKey: ["/api/keywords", 1],
    queryFn: () => apiRequest("GET", "/api/keywords/1").then(res => res.json()),
  });

  // İçerik kaydı
  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/content-suggestions", data).then(res => res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content-suggestions"] });
      toast({
        title: currentLanguage === 'tr' ? "İçerik kaydedildi" : "Content saved",
        description: currentLanguage === 'tr' 
          ? "İçerik önerisi başarıyla kaydedildi." 
          : "Content suggestion successfully saved.",
      });
    },
    onError: (error) => {
      toast({
        title: currentLanguage === 'tr' ? "Hata" : "Error",
        description: String(error),
        variant: "destructive",
      });
    }
  });

  // İçerik oluştur
  const handleGenerateContent = async () => {
    if (!topic) {
      toast({
        title: currentLanguage === 'tr' ? "Hata" : "Error",
        description: currentLanguage === 'tr' 
          ? "Lütfen bir konu girin." 
          : "Please enter a topic.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const content = await generateCompleteContent(topic, selectedPlatform);
      setGeneratedContent(content);
    } catch (error) {
      console.error("İçerik oluşturma hatası:", error);
      toast({
        title: currentLanguage === 'tr' ? "İçerik Oluşturma Hatası" : "Content Generation Error",
        description: String(error),
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // İçerik önerileri oluştur
  const handleGenerateIdeas = async () => {
    const topics = [...selectedTopics];
    if (customTopic) topics.push(customTopic);
    
    if (topics.length === 0) {
      toast({
        title: currentLanguage === 'tr' ? "Hata" : "Error",
        description: currentLanguage === 'tr' 
          ? "Lütfen en az bir konu seçin veya girin." 
          : "Please select or enter at least one topic.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingIdeas(true);
    try {
      const ideas = await generateContentIdeas(topics, PLATFORMS, currentLanguage);
      setContentIdeas(ideas);
    } catch (error) {
      console.error("İçerik önerileri hatası:", error);
      toast({
        title: currentLanguage === 'tr' ? "İçerik Önerileri Hatası" : "Content Ideas Error",
        description: String(error),
        variant: "destructive",
      });
    } finally {
      setIsGeneratingIdeas(false);
    }
  };

  // İçerik takvimi oluştur
  const handleGenerateCalendar = async () => {
    const topics = [...selectedTopics];
    if (customTopic) topics.push(customTopic);
    
    if (topics.length === 0) {
      toast({
        title: currentLanguage === 'tr' ? "Hata" : "Error",
        description: currentLanguage === 'tr' 
          ? "Lütfen en az bir konu seçin veya girin." 
          : "Please select or enter at least one topic.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingCalendar(true);
    try {
      const calendar = await generateContentCalendar(
        topics, 
        selectedPlatform, 
        parseInt(calendarDuration),
        currentLanguage
      );
      setContentCalendar(calendar);
    } catch (error) {
      console.error("İçerik takvimi hatası:", error);
      toast({
        title: currentLanguage === 'tr' ? "İçerik Takvimi Hatası" : "Content Calendar Error",
        description: String(error),
        variant: "destructive",
      });
    } finally {
      setIsGeneratingCalendar(false);
    }
  };

  // İçeriği kopyala
  const handleCopyContent = () => {
    if (!generatedContent) return;
    
    navigator.clipboard.writeText(generatedContent.text);
    toast({
      title: currentLanguage === 'tr' ? "Kopyalandı" : "Copied",
      description: currentLanguage === 'tr' 
        ? "İçerik panoya kopyalandı." 
        : "Content copied to clipboard.",
    });
  };

  // İçeriği kaydet
  const handleSaveContent = () => {
    if (!generatedContent) return;
    
    const socialAccountId = accounts.find(
      (account: any) => account.platform === selectedPlatform
    )?.id;

    if (!socialAccountId) {
      toast({
        title: currentLanguage === 'tr' ? "Hata" : "Error",
        description: currentLanguage === 'tr' 
          ? "Bu platform için hesap bulunamadı." 
          : "No account found for this platform.",
        variant: "destructive",
      });
      return;
    }

    saveMutation.mutate({
      userId: 1,
      socialAccountId,
      platform: selectedPlatform,
      title: topic,
      content: generatedContent.text,
      contentType: "text",
      imageDescription: generatedContent.imageDescription,
      status: "draft"
    });
  };

  // İçerik fikrini kaydet
  const handleSaveIdea = (idea: any) => {
    const socialAccountId = accounts.find(
      (account: any) => account.platform === idea.platform
    )?.id;

    if (!socialAccountId) {
      toast({
        title: currentLanguage === 'tr' ? "Hata" : "Error",
        description: currentLanguage === 'tr' 
          ? "Bu platform için hesap bulunamadı." 
          : "No account found for this platform.",
        variant: "destructive",
      });
      return;
    }

    saveMutation.mutate({
      userId: 1,
      socialAccountId,
      platform: idea.platform,
      title: idea.title,
      content: idea.description,
      contentType: idea.contentType,
      imageDescription: "",
      status: "idea"
    });
  };

  // Anahtar kelime seçimini değiştir
  const handleTopicSelection = (topic: string) => {
    setSelectedTopics(prev => 
      prev.includes(topic) 
        ? prev.filter(t => t !== topic) 
        : [...prev, topic]
    );
  };

  // Popüler anahtar kelimeler
  const popularKeywords = keywords && Array.isArray(keywords) 
    ? keywords.sort((a: any, b: any) => b.mentions - a.mentions).slice(0, 10)
    : [];

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">{t('generateContent')}</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="generate">{t('generateContent')}</TabsTrigger>
            <TabsTrigger value="ideas">{t('contentIdeas')}</TabsTrigger>
            <TabsTrigger value="calendar">{t('calendar')}</TabsTrigger>
          </TabsList>

          {/* İçerik Oluşturma Tab İçeriği */}
          <TabsContent value="generate">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* İçerik Oluşturma Formu */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('generateContent')}</CardTitle>
                  <CardDescription>
                    {currentLanguage === 'tr' 
                      ? 'Sosyal medya için içerik oluşturun'
                      : 'Generate content for social media'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="topic">{t('topic')}</Label>
                    <Textarea
                      id="topic"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder={
                        currentLanguage === 'tr'
                          ? 'İçerik konusu hakkında detaylar girin...'
                          : 'Enter details about the content topic...'
                      }
                      className="min-h-[100px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="platform">{t('platform')}</Label>
                    <Select 
                      value={selectedPlatform} 
                      onValueChange={setSelectedPlatform}
                    >
                      <SelectTrigger id="platform">
                        <SelectValue placeholder={t('selectPlatforms')} />
                      </SelectTrigger>
                      <SelectContent>
                        {PLATFORMS.map(platform => (
                          <SelectItem key={platform} value={platform}>{t(platform)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleGenerateContent} 
                    disabled={isGenerating || !topic}
                    className="w-full"
                  >
                    {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Sparkles className="mr-2 h-4 w-4" />
                    {currentLanguage === 'tr' ? 'İçerik Oluştur' : 'Generate Content'}
                  </Button>
                </CardFooter>
              </Card>

              {/* Oluşturulan İçerik */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('generatedContent')}</CardTitle>
                  <CardDescription>
                    {currentLanguage === 'tr'
                      ? 'AI tarafından oluşturulan içerik'
                      : 'AI-generated content'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isGenerating ? (
                    <div className="flex items-center justify-center p-12">
                      <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    </div>
                  ) : generatedContent ? (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-2">{t('caption')}</h3>
                        <div className="p-4 border rounded-md bg-muted/30 whitespace-pre-wrap">
                          {generatedContent.text}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">
                          {currentLanguage === 'tr' ? 'Görsel Açıklaması' : 'Image Description'}
                        </h3>
                        <div className="p-4 border rounded-md bg-muted/30">
                          {generatedContent.imageDescription}
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={handleCopyContent}>
                          <Copy className="mr-2 h-4 w-4" />
                          {currentLanguage === 'tr' ? 'Kopyala' : 'Copy'}
                        </Button>
                        
                        <Button variant="outline" onClick={handleGenerateContent}>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          {currentLanguage === 'tr' ? 'Yeniden Oluştur' : 'Regenerate'}
                        </Button>
                        
                        <Button onClick={handleSaveContent}>
                          <Save className="mr-2 h-4 w-4" />
                          {currentLanguage === 'tr' ? 'Kaydet' : 'Save'}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
                      <Sparkles className="h-12 w-12 mb-4 text-primary/40" />
                      <p>
                        {currentLanguage === 'tr'
                          ? 'Bir konu girin ve "İçerik Oluştur" butonuna tıklayın'
                          : 'Enter a topic and click "Generate Content" button'}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* İçerik Fikirleri Tab İçeriği */}
          <TabsContent value="ideas">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Fikir Oluşturma Formu */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('contentIdeas')}</CardTitle>
                  <CardDescription>
                    {currentLanguage === 'tr'
                      ? 'İçerik fikirleri için konular seçin'
                      : 'Select topics for content ideas'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">
                      {currentLanguage === 'tr' ? 'Popüler Anahtar Kelimeler' : 'Popular Keywords'}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {popularKeywords.map((keyword: any) => (
                        <div key={keyword.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`keyword-${keyword.id}`} 
                            checked={selectedTopics.includes(keyword.keyword)}
                            onCheckedChange={() => handleTopicSelection(keyword.keyword)}
                          />
                          <Label 
                            htmlFor={`keyword-${keyword.id}`}
                            className="text-sm font-normal"
                          >
                            {keyword.keyword}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="custom-topic">{currentLanguage === 'tr' ? 'Özel Konu' : 'Custom Topic'}</Label>
                    <Input
                      id="custom-topic"
                      value={customTopic}
                      onChange={(e) => setCustomTopic(e.target.value)}
                      placeholder={
                        currentLanguage === 'tr'
                          ? 'Özel bir konu girin...'
                          : 'Enter a custom topic...'
                      }
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleGenerateIdeas} 
                    disabled={isGeneratingIdeas || (selectedTopics.length === 0 && !customTopic)}
                    className="w-full"
                  >
                    {isGeneratingIdeas && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Sparkles className="mr-2 h-4 w-4" />
                    {currentLanguage === 'tr' ? 'Fikirler Oluştur' : 'Generate Ideas'}
                  </Button>
                </CardFooter>
              </Card>

              {/* Oluşturulan Fikirler */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>{currentLanguage === 'tr' ? 'İçerik Fikirleri' : 'Content Ideas'}</CardTitle>
                  <CardDescription>
                    {currentLanguage === 'tr'
                      ? 'AI tarafından oluşturulan içerik fikirleri'
                      : 'AI-generated content ideas'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isGeneratingIdeas ? (
                    <div className="flex items-center justify-center p-12">
                      <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    </div>
                  ) : contentIdeas.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {contentIdeas.map((idea, index) => (
                        <Card key={index} className="overflow-hidden">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start mb-1">
                              <Badge>{t(idea.platform)}</Badge>
                              <Badge variant="outline">{idea.contentType}</Badge>
                            </div>
                            <CardTitle className="text-base truncate">{idea.title}</CardTitle>
                          </CardHeader>
                          <CardContent className="pb-2">
                            <p className="text-sm text-muted-foreground line-clamp-3">
                              {idea.description}
                            </p>
                          </CardContent>
                          <CardFooter className="flex justify-between pt-2">
                            <Badge variant="secondary">{idea.estimatedEngagement}</Badge>
                            <Button size="sm" onClick={() => handleSaveIdea(idea)}>
                              <Save className="h-4 w-4 mr-1" />
                              {currentLanguage === 'tr' ? 'Kaydet' : 'Save'}
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
                      <Sparkles className="h-12 w-12 mb-4 text-primary/40" />
                      <p>
                        {currentLanguage === 'tr'
                          ? 'Konuları seçin ve "Fikirler Oluştur" butonuna tıklayın'
                          : 'Select topics and click "Generate Ideas" button'}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* İçerik Takvimi Tab İçeriği */}
          <TabsContent value="calendar">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Takvim Oluşturma Formu */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('calendar')}</CardTitle>
                  <CardDescription>
                    {currentLanguage === 'tr'
                      ? 'İçerik takvimi oluşturun'
                      : 'Generate a content calendar'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="platform-calendar">{t('platform')}</Label>
                    <Select 
                      value={selectedPlatform} 
                      onValueChange={setSelectedPlatform}
                    >
                      <SelectTrigger id="platform-calendar">
                        <SelectValue placeholder={t('selectPlatforms')} />
                      </SelectTrigger>
                      <SelectContent>
                        {PLATFORMS.map(platform => (
                          <SelectItem key={platform} value={platform}>{t(platform)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="duration">{currentLanguage === 'tr' ? 'Süre (Gün)' : 'Duration (Days)'}</Label>
                    <Select 
                      value={calendarDuration} 
                      onValueChange={setCalendarDuration}
                    >
                      <SelectTrigger id="duration">
                        <SelectValue/>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">7</SelectItem>
                        <SelectItem value="14">14</SelectItem>
                        <SelectItem value="30">30</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">{t('topics')}</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {popularKeywords.slice(0, 6).map((keyword: any) => (
                        <div key={keyword.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`cal-keyword-${keyword.id}`} 
                            checked={selectedTopics.includes(keyword.keyword)}
                            onCheckedChange={() => handleTopicSelection(keyword.keyword)}
                          />
                          <Label 
                            htmlFor={`cal-keyword-${keyword.id}`}
                            className="text-sm font-normal"
                          >
                            {keyword.keyword}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="custom-topic-cal">{currentLanguage === 'tr' ? 'Özel Konu' : 'Custom Topic'}</Label>
                    <Input
                      id="custom-topic-cal"
                      value={customTopic}
                      onChange={(e) => setCustomTopic(e.target.value)}
                      placeholder={
                        currentLanguage === 'tr'
                          ? 'Özel bir konu girin...'
                          : 'Enter a custom topic...'
                      }
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleGenerateCalendar} 
                    disabled={isGeneratingCalendar || (selectedTopics.length === 0 && !customTopic)}
                    className="w-full"
                  >
                    {isGeneratingCalendar && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Calendar className="mr-2 h-4 w-4" />
                    {currentLanguage === 'tr' ? 'Takvim Oluştur' : 'Generate Calendar'}
                  </Button>
                </CardFooter>
              </Card>

              {/* Oluşturulan Takvim */}
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>{currentLanguage === 'tr' ? 'İçerik Takvimi' : 'Content Calendar'}</CardTitle>
                  <CardDescription>
                    {currentLanguage === 'tr'
                      ? 'AI tarafından oluşturulan içerik takvimi'
                      : 'AI-generated content calendar'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isGeneratingCalendar ? (
                    <div className="flex items-center justify-center p-12">
                      <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    </div>
                  ) : contentCalendar.length > 0 ? (
                    <div className="space-y-4">
                      {contentCalendar.map((day, index) => (
                        <Card key={index}>
                          <CardHeader className="py-3">
                            <div className="flex justify-between items-center">
                              <CardTitle className="text-lg">
                                {new Date(day.date).toLocaleDateString(
                                  currentLanguage === 'tr' ? 'tr-TR' : 'en-US', 
                                  { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
                                )}
                              </CardTitle>
                              <Badge>{day.bestTimeToPost}</Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="py-3">
                            <div className="flex items-start">
                              <div className="bg-primary/10 p-2 rounded-md mr-4">
                                {day.contentType === 'video' || day.contentType === 'Video' ? (
                                  <FileText className="h-10 w-10 text-primary" />
                                ) : (
                                  <Image className="h-10 w-10 text-primary" />
                                )}
                              </div>
                              <div>
                                <h3 className="font-medium text-base mb-1">{day.title}</h3>
                                <p className="text-sm text-muted-foreground mb-2">{day.description}</p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {day.topics.map((topic, i) => (
                                    <Badge key={i} variant="outline">{topic}</Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="py-3">
                            <Button size="sm" variant="outline" className="ml-auto">
                              {currentLanguage === 'tr' ? 'Takvime Ekle' : 'Add to Calendar'}
                              <ArrowRight className="h-4 w-4 ml-1" />
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
                      <Calendar className="h-12 w-12 mb-4 text-primary/40" />
                      <p>
                        {currentLanguage === 'tr'
                          ? 'Sol taraftan seçenekleri belirleyin ve "Takvim Oluştur" butonuna tıklayın'
                          : 'Specify options on the left and click "Generate Calendar" button'}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}