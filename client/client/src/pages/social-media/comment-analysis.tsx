import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie } from "recharts";
import { Loader2, MessageSquare, ThumbsUp, ThumbsDown, Lightbulb, AlertTriangle, Info } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import { analyzeComments, generateAutoResponses } from "@/lib/ai-services";
import { PLATFORMS } from "@/lib/constants";
import { useTranslation } from "@/i18n";

// Renk paleti
const COLORS = ['#8b5cf6', '#ec4899', '#10b981', '#3b82f6', '#f97316'];
const SENTIMENT_COLORS = {
  positive: '#10b981',
  negative: '#ef4444',
  neutral: '#6b7280'
};

interface CommentData {
  id: number;
  platform: string;
  socialAccountId: number;
  commentId: string;
  authorName: string;
  authorId: string;
  content: string;
  timestamp: Date;
  likes: number;
  replyCount: number;
  parentCommentId: string | null;
  sentiment: 'positive' | 'negative' | 'neutral';
  isReplied: boolean;
}

export default function CommentAnalysisPage() {
  const { t, currentLanguage } = useTranslation();
  const { toast } = useToast();
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const [selectedSocialAccountId, setSelectedSocialAccountId] = useState<number | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>("analysis");
  const [commentForResponse, setCommentForResponse] = useState<CommentData | null>(null);
  const [selectedComments, setSelectedComments] = useState<string[]>([]);
  const [aiInsights, setAiInsights] = useState<{
    sentiment: { positive: number, negative: number, neutral: number };
    topTopics: string[];
    recommendedActions: string[];
    summary: string;
  } | null>(null);
  const [autoResponses, setAutoResponses] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingResponses, setIsGeneratingResponses] = useState(false);

  // Hesapları getir
  const { data: accounts = [] } = useQuery({
    queryKey: ["/api/accounts", 1],
    queryFn: () => apiRequest("GET", "/api/accounts/1").then(res => res.json()),
  });

  // Yorumları getir
  const { data: comments = [], isLoading, error } = useQuery({
    queryKey: ["/api/comments", selectedPlatform, selectedSocialAccountId],
    queryFn: () => {
      const url = selectedSocialAccountId
        ? `/api/comments?socialAccountId=${selectedSocialAccountId}`
        : selectedPlatform !== "all"
          ? `/api/comments?platform=${selectedPlatform}`
          : "/api/comments";
      return apiRequest("GET", url).then(res => res.json());
    },
  });

  // Yorum analizlerini getir
  const { data: existingAnalyses = [] } = useQuery({
    queryKey: ["/api/comment-analyses"],
    queryFn: () => apiRequest("GET", "/api/comment-analyses").then(res => res.json()),
  });

  // Yorum analizi yap
  const analyzeMutation = useMutation({
    mutationFn: async (data: {
      socialAccountId: number;
      platform: string;
      comments: string[];
      results: any;
    }) => {
      return apiRequest("POST", "/api/comment-analyses", data).then(res => res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/comment-analyses"] });
      toast({
        title: currentLanguage === 'tr' ? "Analiz kaydedildi" : "Analysis saved",
        description: currentLanguage === 'tr' 
          ? "Yorum analizi başarıyla kaydedildi." 
          : "Comment analysis successfully saved.",
      });
    },
  });

  // Yapay zeka ile yorum analizi yap
  const handleAnalyzeWithAI = async () => {
    if (selectedComments.length === 0) {
      toast({
        title: currentLanguage === 'tr' ? "Hata" : "Error",
        description: currentLanguage === 'tr' 
          ? "Lütfen analiz edilecek yorumları seçin." 
          : "Please select comments to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const insights = await analyzeComments(
        selectedComments.map(id => {
          const comment = comments.find((c: CommentData) => c.id.toString() === id);
          return comment ? comment.content : "";
        }).filter(Boolean),
        currentLanguage
      );
      
      setAiInsights(insights);
      
      // Veri tabanına kaydet
      if (insights && selectedSocialAccountId) {
        analyzeMutation.mutate({
          socialAccountId: selectedSocialAccountId,
          platform: selectedPlatform !== 'all' ? selectedPlatform : 
            (accounts.find((a: any) => a.id === selectedSocialAccountId)?.platform || ''),
          comments: selectedComments,
          results: insights
        });
      }
    } catch (error) {
      console.error("AI analizi hatası:", error);
      toast({
        title: currentLanguage === 'tr' ? "AI Analizi Hatası" : "AI Analysis Error",
        description: String(error),
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Otomatik yanıt oluştur
  const handleGenerateResponse = async (comment: CommentData) => {
    setCommentForResponse(comment);
    setIsGeneratingResponses(true);
    try {
      const responses = await generateAutoResponses(
        comment.content,
        "friendly",
        currentLanguage
      );
      setAutoResponses(responses);
    } catch (error) {
      console.error("Yanıt oluşturma hatası:", error);
      toast({
        title: currentLanguage === 'tr' ? "Yanıt Oluşturma Hatası" : "Response Generation Error",
        description: String(error),
        variant: "destructive",
      });
    } finally {
      setIsGeneratingResponses(false);
    }
  };

  // Yorum seçimi
  const handleCommentSelection = (id: string) => {
    setSelectedComments(prev => 
      prev.includes(id) 
        ? prev.filter(commentId => commentId !== id) 
        : [...prev, id]
    );
  };

  // Filtrelenmiş yorumlar
  const filteredComments = comments && Array.isArray(comments) 
    ? comments.filter((comment: CommentData) => {
        if (selectedPlatform !== "all" && comment.platform !== selectedPlatform) return false;
        if (selectedSocialAccountId && comment.socialAccountId !== selectedSocialAccountId) return false;
        return true;
      })
    : [];

  // Duygu analizi için veri hazırlama
  const sentimentData = filteredComments.length > 0 
    ? [
        { name: t('positive'), value: filteredComments.filter((c: CommentData) => c.sentiment === 'positive').length, color: SENTIMENT_COLORS.positive },
        { name: t('negative'), value: filteredComments.filter((c: CommentData) => c.sentiment === 'negative').length, color: SENTIMENT_COLORS.negative },
        { name: t('neutral'), value: filteredComments.filter((c: CommentData) => c.sentiment === 'neutral').length, color: SENTIMENT_COLORS.neutral },
      ]
    : [];

  // AI Insights duygu analizi verileri
  const aiSentimentData = aiInsights 
    ? [
        { name: t('positive'), value: aiInsights.sentiment.positive, color: SENTIMENT_COLORS.positive },
        { name: t('negative'), value: aiInsights.sentiment.negative, color: SENTIMENT_COLORS.negative },
        { name: t('neutral'), value: aiInsights.sentiment.neutral, color: SENTIMENT_COLORS.neutral },
      ]
    : [];

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">{t('analyzeComments')}</h1>

        {/* Filtreler */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Label>{t('selectPlatforms')}</Label>
            <Select 
              value={selectedPlatform} 
              onValueChange={setSelectedPlatform}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('all')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('all')}</SelectItem>
                {PLATFORMS.map(platform => (
                  <SelectItem key={platform} value={platform}>{t(platform)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <Label>{t('selectPlatforms')}</Label>
            <Select 
              value={selectedSocialAccountId?.toString() || ""} 
              onValueChange={(value) => setSelectedSocialAccountId(value ? parseInt(value) : null)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('all')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t('all')}</SelectItem>
                {accounts && accounts.map((account: any) => (
                  <SelectItem key={account.id} value={account.id.toString()}>
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tab seçenekleri */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="analysis">{t('analyzeComments')}</TabsTrigger>
            <TabsTrigger value="responses">{t('smartResponses')}</TabsTrigger>
          </TabsList>

          {/* Yorum Analizi Tab İçeriği */}
          <TabsContent value="analysis">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Yorum Seçim Listesi */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>{t('comments')}</CardTitle>
                  <CardDescription>
                    {currentLanguage === 'tr' 
                      ? 'Analiz edilecek yorumları seçin'
                      : 'Select comments to analyze'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center p-6">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : error ? (
                    <div className="p-6 text-center text-destructive">
                      <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                      <p>{error.toString()}</p>
                    </div>
                  ) : filteredComments.length === 0 ? (
                    <div className="p-6 text-center text-muted-foreground">
                      <MessageSquare className="h-8 w-8 mx-auto mb-2" />
                      <p>{currentLanguage === 'tr' ? 'Henüz yorum bulunmuyor' : 'No comments found'}</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[500px] overflow-y-auto">
                      {filteredComments.map((comment: CommentData) => (
                        <div 
                          key={comment.id} 
                          className={`p-4 border rounded-md transition-colors ${
                            selectedComments.includes(comment.id.toString())
                              ? 'border-primary bg-primary/5'
                              : 'border-border'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="font-medium">{comment.authorName}</div>
                              <div className="text-sm text-muted-foreground">
                                {new Date(comment.timestamp).toLocaleDateString()} - {t(comment.platform)}
                              </div>
                            </div>
                            <div className="space-x-2">
                              <Badge variant={
                                comment.sentiment === 'positive' 
                                  ? 'success' 
                                  : comment.sentiment === 'negative' 
                                    ? 'destructive' 
                                    : 'secondary'
                              }>
                                {t(comment.sentiment)}
                              </Badge>
                              <Switch 
                                checked={selectedComments.includes(comment.id.toString())} 
                                onCheckedChange={() => handleCommentSelection(comment.id.toString())}
                              />
                            </div>
                          </div>
                          <p className="mt-2">{comment.content}</p>
                          <div className="flex items-center mt-2 text-sm text-muted-foreground">
                            <ThumbsUp className="h-4 w-4 mr-1" /> {comment.likes}
                            <MessageSquare className="h-4 w-4 ml-4 mr-1" /> {comment.replyCount}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setSelectedComments([])}>
                    {currentLanguage === 'tr' ? 'Seçimleri Temizle' : 'Clear Selection'}
                  </Button>
                  <Button 
                    onClick={handleAnalyzeWithAI} 
                    disabled={isAnalyzing || selectedComments.length === 0}
                  >
                    {isAnalyzing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {currentLanguage === 'tr' ? 'AI ile Analiz Et' : 'Analyze with AI'}
                  </Button>
                </CardFooter>
              </Card>

              {/* Analiz Sonuçları */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('sentiment')}</CardTitle>
                  <CardDescription>
                    {currentLanguage === 'tr'
                      ? 'Seçilen yorumların duygu analizi'
                      : 'Sentiment analysis of selected comments'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {aiInsights ? (
                    <div className="space-y-6">
                      {/* Duygu Analizi */}
                      <div className="mt-4">
                        <h3 className="text-lg font-medium mb-2">{t('sentiment')}</h3>
                        <div className="h-[200px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={aiSentimentData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, value }) => `${name}: ${value}%`}
                              >
                                {aiSentimentData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* En Çok Bahsedilen Konular */}
                      <div>
                        <h3 className="text-lg font-medium mb-2">
                          {currentLanguage === 'tr' ? 'En Çok Bahsedilen Konular' : 'Top Topics'}
                        </h3>
                        <div className="space-y-2">
                          {aiInsights.topTopics.map((topic, index) => (
                            <Badge key={index} className="mr-2 mb-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}>
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Önerilen Aksiyonlar */}
                      <div>
                        <h3 className="text-lg font-medium mb-2">
                          {currentLanguage === 'tr' ? 'Önerilen Aksiyonlar' : 'Recommended Actions'}
                        </h3>
                        <ul className="space-y-2 list-disc pl-5">
                          {aiInsights.recommendedActions.map((action, index) => (
                            <li key={index}>{action}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Özet */}
                      <div>
                        <h3 className="text-lg font-medium mb-2">{t('summary')}</h3>
                        <p className="text-sm text-muted-foreground">{aiInsights.summary}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
                      <Lightbulb className="h-12 w-12 mb-4 text-primary/40" />
                      <p>
                        {currentLanguage === 'tr'
                          ? 'Yorum seçin ve "AI ile Analiz Et" butonuna tıklayın'
                          : 'Select comments and click "Analyze with AI" button'}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Akıllı Yanıtlar Tab İçeriği */}
          <TabsContent value="responses">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Yorum Listesi */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>{t('comments')}</CardTitle>
                  <CardDescription>
                    {currentLanguage === 'tr' 
                      ? 'Yanıtlamak istediğiniz yorumu seçin'
                      : 'Select a comment to respond to'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center p-6">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : error ? (
                    <div className="p-6 text-center text-destructive">
                      <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                      <p>{error.toString()}</p>
                    </div>
                  ) : filteredComments.length === 0 ? (
                    <div className="p-6 text-center text-muted-foreground">
                      <MessageSquare className="h-8 w-8 mx-auto mb-2" />
                      <p>{currentLanguage === 'tr' ? 'Henüz yorum bulunmuyor' : 'No comments found'}</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[500px] overflow-y-auto">
                      {filteredComments.map((comment: CommentData) => (
                        <div 
                          key={comment.id} 
                          className={`p-4 border rounded-md transition-colors cursor-pointer ${
                            commentForResponse?.id === comment.id
                              ? 'border-primary bg-primary/5'
                              : 'border-border'
                          }`}
                          onClick={() => handleGenerateResponse(comment)}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="font-medium">{comment.authorName}</div>
                              <div className="text-sm text-muted-foreground">
                                {new Date(comment.timestamp).toLocaleDateString()} - {t(comment.platform)}
                              </div>
                            </div>
                            <Badge variant={
                              comment.sentiment === 'positive' 
                                ? 'success' 
                                : comment.sentiment === 'negative' 
                                  ? 'destructive' 
                                  : 'secondary'
                            }>
                              {t(comment.sentiment)}
                            </Badge>
                          </div>
                          <p className="mt-2">{comment.content}</p>
                          <div className="flex items-center mt-2 text-sm text-muted-foreground">
                            <ThumbsUp className="h-4 w-4 mr-1" /> {comment.likes}
                            <MessageSquare className="h-4 w-4 ml-4 mr-1" /> {comment.replyCount}
                            {comment.isReplied && (
                              <Badge variant="outline" className="ml-4">
                                {currentLanguage === 'tr' ? 'Yanıtlandı' : 'Replied'}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Yanıt Önerileri */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('smartResponses')}</CardTitle>
                  <CardDescription>
                    {currentLanguage === 'tr'
                      ? 'AI tarafından oluşturulan yanıt önerileri'
                      : 'AI-generated response suggestions'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isGeneratingResponses ? (
                    <div className="flex items-center justify-center p-6">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : commentForResponse ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-muted rounded-md">
                        <div className="font-medium">{commentForResponse.authorName}</div>
                        <p className="mt-1">{commentForResponse.content}</p>
                      </div>
                      
                      <h3 className="font-medium text-lg">
                        {currentLanguage === 'tr' ? 'Önerilen Yanıtlar' : 'Suggested Responses'}
                      </h3>
                      
                      {autoResponses.length > 0 ? (
                        <div className="space-y-3">
                          {autoResponses.map((response, index) => (
                            <div key={index} className="p-3 border rounded-md group relative">
                              <p>{response}</p>
                              <div className="mt-2 flex justify-end">
                                <Button size="sm" variant="outline" className="text-xs">
                                  {currentLanguage === 'tr' ? 'Kullan' : 'Use'}
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-muted-foreground border rounded-md">
                          <Info className="h-8 w-8 mx-auto mb-2" />
                          <p>
                            {currentLanguage === 'tr'
                              ? 'Sol taraftan bir yorum seçerek yanıt önerileri alabilirsiniz'
                              : 'Select a comment from the left to get response suggestions'}
                          </p>
                        </div>
                      )}
                      
                      <div className="mt-4">
                        <Label htmlFor="custom-response">
                          {currentLanguage === 'tr' ? 'Özel Yanıt' : 'Custom Response'}
                        </Label>
                        <Textarea
                          id="custom-response"
                          placeholder={
                            currentLanguage === 'tr'
                              ? 'Kendi yanıtınızı yazın...'
                              : 'Write your own response...'
                          }
                          className="mt-1"
                        />
                        <Button className="w-full mt-2">
                          {currentLanguage === 'tr' ? 'Yanıtı Gönder' : 'Send Response'}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
                      <MessageSquare className="h-12 w-12 mb-4 text-primary/40" />
                      <p>
                        {currentLanguage === 'tr'
                          ? 'Yanıtlamak için sol taraftan bir yorum seçin'
                          : 'Select a comment from the left to respond'}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Kaydedilmiş Analizler */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{currentLanguage === 'tr' ? 'Kaydedilmiş Analizler' : 'Saved Analyses'}</CardTitle>
            <CardDescription>
              {currentLanguage === 'tr'
                ? 'Daha önce kaydedilmiş yorum analizleri'
                : 'Previously saved comment analyses'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {existingAnalyses.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                <Info className="h-8 w-8 mx-auto mb-2" />
                <p>
                  {currentLanguage === 'tr'
                    ? 'Henüz kaydedilmiş analiz bulunmuyor'
                    : 'No saved analyses yet'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {existingAnalyses.map((analysis: any) => (
                  <Card key={analysis.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{t(analysis.platform)}</CardTitle>
                          <CardDescription>
                            {new Date(analysis.createdAt).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <Badge>
                          {currentLanguage === 'tr' 
                            ? `${analysis.comments.length} yorum` 
                            : `${analysis.comments.length} comments`}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {analysis.results.topTopics.map((topic: string, index: number) => (
                          <Badge key={index} className="mr-1" style={{ backgroundColor: COLORS[index % COLORS.length] }}>
                            {topic}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {analysis.results.summary}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}