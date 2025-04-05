import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import Sidebar from "@/components/dashboard/sidebar";
import { DEMO_USER_ID, PLATFORM_DATA } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { ScheduledContent } from "@shared/schema";
import { formatDateRelative, getAvatarFallback } from "@/lib/utils";
import useAccounts from "@/hooks/use-accounts";

const contentFormSchema = z.object({
  socialAccountId: z.number(),
  platform: z.string(),
  content: z.string().min(1, { message: "İçerik boş olamaz" }),
  mediaUrls: z.array(z.string()).optional(),
  scheduledFor: z.date({ required_error: "Tarih seçmelisiniz" })
});

type ContentFormValues = z.infer<typeof contentFormSchema>;

export default function ContentCalendar() {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<ScheduledContent | null>(null);
  const [activeMonth, setActiveMonth] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState("upcoming");

  const { accounts, isLoading: isLoadingAccounts, activeAccount, setActiveAccount } = useAccounts();

  // Fetch scheduled content
  const { data: scheduledContent, isLoading: isLoadingContent } = useQuery({
    queryKey: [activeAccount ? `/api/content/${activeAccount.id}` : null],
    enabled: !!activeAccount
  });

  // Calculate unread message counts (would be from actual API in production)
  const unreadMessageCounts: Record<string, number> = {};

  // Add scheduled content mutation
  const addContentMutation = useMutation({
    mutationFn: async (contentData: ContentFormValues) => {
      return apiRequest("POST", "/api/content", contentData);
    },
    onSuccess: () => {
      toast({
        title: "İçerik planlandı",
        description: "Yeni içerik başarıyla planlandı."
      });
      queryClient.invalidateQueries({ queryKey: [activeAccount ? `/api/content/${activeAccount.id}` : null] });
      setIsAddDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "İçerik planlanırken bir hata oluştu."
      });
    }
  });

  // Delete scheduled content mutation
  const deleteContentMutation = useMutation({
    mutationFn: async (contentId: number) => {
      return apiRequest("DELETE", `/api/content/${contentId}`, null);
    },
    onSuccess: () => {
      toast({
        title: "İçerik silindi",
        description: "Planlanmış içerik başarıyla silindi."
      });
      queryClient.invalidateQueries({ queryKey: [activeAccount ? `/api/content/${activeAccount.id}` : null] });
      setIsDetailsDialogOpen(false);
      setSelectedContent(null);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "İçerik silinirken bir hata oluştu."
      });
    }
  });

  // Setup form
  const form = useForm<ContentFormValues>({
    resolver: zodResolver(contentFormSchema),
    defaultValues: {
      content: "",
      mediaUrls: [],
      socialAccountId: activeAccount?.id || 0,
      platform: activeAccount?.platform || "instagram",
      scheduledFor: new Date(new Date().setHours(new Date().getHours() + 24)) // Tomorrow
    }
  });

  // When active account changes, update form default values
  React.useEffect(() => {
    if (activeAccount) {
      form.setValue("socialAccountId", activeAccount.id);
      form.setValue("platform", activeAccount.platform);
    }
  }, [activeAccount, form]);

  // Handle form submission
  const onSubmit = (values: ContentFormValues) => {
    addContentMutation.mutate(values);
  };

  // Handle view content details
  const handleViewContentDetails = (content: ScheduledContent) => {
    setSelectedContent(content);
    setIsDetailsDialogOpen(true);
  };

  // Handle delete content
  const handleDeleteContent = () => {
    if (selectedContent) {
      deleteContentMutation.mutate(selectedContent.id);
    }
  };

  // Group content by date
  const groupedContent = React.useMemo(() => {
    if (!scheduledContent) return {};

    const grouped: Record<string, ScheduledContent[]> = {};
    
    scheduledContent.forEach(content => {
      const dateKey = new Date(content.scheduledFor).toDateString();
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(content);
    });

    return grouped;
  }, [scheduledContent]);

  // Calculate dates with content
  const datesWithContent = React.useMemo(() => {
    return Object.keys(groupedContent).map(dateStr => new Date(dateStr));
  }, [groupedContent]);

  // Filter content based on active tab
  const filteredContent = React.useMemo(() => {
    if (!scheduledContent) return [];

    const now = new Date();
    
    if (activeTab === "upcoming") {
      return scheduledContent.filter(content => new Date(content.scheduledFor) > now);
    } else if (activeTab === "published") {
      return scheduledContent.filter(content => 
        content.status === "published" || 
        (new Date(content.scheduledFor) <= now && content.status !== "failed")
      );
    } else if (activeTab === "failed") {
      return scheduledContent.filter(content => content.status === "failed");
    }
    
    return scheduledContent;
  }, [scheduledContent, activeTab]);

  const isLoading = isLoadingAccounts || isLoadingContent;

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
              <p className="text-gray-600">İçerik planlaması yükleniyor...</p>
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
            <h1 className="text-xl font-semibold text-gray-800">İçerik Takvimi</h1>
            <p className="text-sm text-gray-500">Sosyal medya içeriklerinizi planlayın ve yönetin</p>
          </div>
          
          {/* Actions */}
          <div className="flex items-center space-x-3">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <i className="ri-add-line mr-2"></i>
                  Yeni İçerik Planla
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Yeni İçerik Planla</DialogTitle>
                  <DialogDescription>
                    İçeriğinizi oluşturun ve paylaşım zamanını planlayın
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="socialAccountId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hesap</FormLabel>
                          <Select
                            value={field.value.toString()}
                            onValueChange={(value) => {
                              const account = accounts?.find(a => a.id === parseInt(value));
                              if (account) {
                                field.onChange(parseInt(value));
                                form.setValue("platform", account.platform);
                              }
                            }}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Hesap seçin" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {accounts?.map(account => (
                                <SelectItem key={account.id} value={account.id.toString()}>
                                  {account.name} ({PLATFORM_DATA[account.platform].label})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>İçerik</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="İçerik metninizi buraya yazın..." 
                              className="min-h-[120px] resize-y"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="scheduledFor"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Paylaşım Zamanı</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start text-left font-normal"
                                >
                                  <i className="ri-calendar-line mr-2 h-4 w-4"></i>
                                  {field.value ? (
                                    format(field.value, "PPP 'saat' HH:mm", { locale: tr })
                                  ) : (
                                    <span>Tarih ve saat seçin</span>
                                  )}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(date) => {
                                  if (date) {
                                    const newDate = new Date(date);
                                    // Keep the current time
                                    newDate.setHours(field.value.getHours());
                                    newDate.setMinutes(field.value.getMinutes());
                                    field.onChange(newDate);
                                  }
                                }}
                                initialFocus
                              />
                              <div className="border-t border-gray-200 p-3">
                                <div className="flex justify-between items-center">
                                  <FormLabel>Saat:</FormLabel>
                                  <div className="flex space-x-2">
                                    <Select
                                      value={field.value.getHours().toString().padStart(2, '0')}
                                      onValueChange={(value) => {
                                        const newDate = new Date(field.value);
                                        newDate.setHours(parseInt(value));
                                        field.onChange(newDate);
                                      }}
                                    >
                                      <SelectTrigger className="w-[70px]">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {Array.from({ length: 24 }, (_, i) => (
                                          <SelectItem key={i} value={i.toString().padStart(2, '0')}>
                                            {i.toString().padStart(2, '0')}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <span className="mt-2">:</span>
                                    <Select
                                      value={field.value.getMinutes().toString().padStart(2, '0')}
                                      onValueChange={(value) => {
                                        const newDate = new Date(field.value);
                                        newDate.setMinutes(parseInt(value));
                                        field.onChange(newDate);
                                      }}
                                    >
                                      <SelectTrigger className="w-[70px]">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {Array.from({ length: 60, step: 5 }, (_, i) => (
                                          <SelectItem key={i} value={i.toString().padStart(2, '0')}>
                                            {i.toString().padStart(2, '0')}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            İçeriğinizin paylaşılacağı tarih ve saati seçin
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <DialogFooter>
                      <Button 
                        type="submit" 
                        disabled={addContentMutation.isPending}
                      >
                        {addContentMutation.isPending && (
                          <i className="ri-loader-4-line animate-spin mr-2"></i>
                        )}
                        İçeriği Planla
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Takvim</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={undefined}
                  month={activeMonth}
                  onMonthChange={setActiveMonth}
                  className="rounded-md border w-full"
                  modifiers={{
                    withContent: datesWithContent
                  }}
                  modifiersStyles={{
                    withContent: { 
                      backgroundColor: "rgba(139, 92, 246, 0.1)",
                      fontWeight: "bold",
                      color: "#7C3AED" 
                    }
                  }}
                  onDayClick={(day) => {
                    // Scroll to the content for this day if it exists
                    const dateKey = day.toDateString();
                    const element = document.getElementById(`date-${dateKey}`);
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                />
                
                <div className="mt-4">
                  <div className="flex items-center mb-2">
                    <div className="w-4 h-4 rounded-full bg-purple-100 mr-2"></div>
                    <span className="text-sm">Planlanmış İçerik</span>
                  </div>
                  
                  <div className="text-sm text-gray-500 mt-4">
                    <p>Toplam {scheduledContent?.length || 0} içerik planlandı:</p>
                    <ul className="mt-2 space-y-1">
                      <li className="flex justify-between">
                        <span>Bekleyen:</span>
                        <span className="font-medium">
                          {scheduledContent?.filter(c => c.status === "pending").length || 0}
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span>Yayınlanan:</span>
                        <span className="font-medium">
                          {scheduledContent?.filter(c => c.status === "published").length || 0}
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span>Başarısız:</span>
                        <span className="font-medium">
                          {scheduledContent?.filter(c => c.status === "failed").length || 0}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Content list */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-0">
                <CardTitle>İçerikler</CardTitle>
              </CardHeader>
              <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab} className="p-4">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="upcoming">Bekleyen</TabsTrigger>
                  <TabsTrigger value="published">Yayınlanan</TabsTrigger>
                  <TabsTrigger value="failed">Başarısız</TabsTrigger>
                </TabsList>
                
                <TabsContent value="upcoming" className="pt-4">
                  {filteredContent.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
                        <i className="ri-calendar-line text-primary text-2xl"></i>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">Henüz planlanmış içerik yok</h3>
                      <p className="text-gray-500 mb-4">İçerik planlamak için yukarıdaki butona tıklayın</p>
                      <Button onClick={() => setIsAddDialogOpen(true)}>
                        <i className="ri-add-line mr-2"></i>
                        Yeni İçerik Planla
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {Object.entries(groupedContent)
                        .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
                        .filter(([dateStr]) => new Date(dateStr) > new Date())
                        .map(([dateStr, contents]) => (
                          <div key={dateStr} id={`date-${dateStr}`}>
                            <h3 className="text-sm font-medium text-gray-500 mb-2">
                              {new Date(dateStr).toLocaleDateString('tr-TR', { 
                                weekday: 'long', 
                                day: 'numeric', 
                                month: 'long' 
                              })}
                            </h3>
                            <div className="space-y-3">
                              {contents.map((content) => (
                                <div 
                                  key={content.id}
                                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                                  onClick={() => handleViewContentDetails(content)}
                                >
                                  <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center">
                                      <i className={`${PLATFORM_DATA[content.platform].iconClass} mr-2 text-lg ${PLATFORM_DATA[content.platform].color}`}></i>
                                      <span className="font-medium">{PLATFORM_DATA[content.platform].label}</span>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {new Date(content.scheduledFor).toLocaleTimeString('tr-TR', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </div>
                                  </div>
                                  <p className="text-sm text-gray-700 line-clamp-2 mb-2">{content.content}</p>
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500">
                                      <i className="ri-time-line mr-1"></i>
                                      {formatDateRelative(content.scheduledFor)}
                                    </span>
                                    <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-primary">
                                      {content.status === "pending" ? "Bekliyor" : 
                                       content.status === "published" ? "Yayınlandı" : "Başarısız"}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="published" className="pt-4">
                  {filteredContent.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                        <i className="ri-check-line text-green-600 text-2xl"></i>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">Henüz yayınlanmış içerik yok</h3>
                      <p className="text-gray-500">Yayınlanan içerikler burada görüntülenecek</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredContent.map((content) => (
                        <div 
                          key={content.id}
                          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => handleViewContentDetails(content)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center">
                              <i className={`${PLATFORM_DATA[content.platform].iconClass} mr-2 text-lg ${PLATFORM_DATA[content.platform].color}`}></i>
                              <span className="font-medium">{PLATFORM_DATA[content.platform].label}</span>
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(content.scheduledFor).toLocaleDateString('tr-TR', {
                                day: 'numeric',
                                month: 'short'
                              })}
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 line-clamp-2 mb-2">{content.content}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">
                              <i className="ri-time-line mr-1"></i>
                              {formatDateRelative(content.scheduledFor)}
                            </span>
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                              Yayınlandı
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="failed" className="pt-4">
                  {filteredContent.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                        <i className="ri-error-warning-line text-red-600 text-2xl"></i>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">Başarısız içerik yok</h3>
                      <p className="text-gray-500">Tüm içerikleriniz başarıyla yayınlandı</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredContent.map((content) => (
                        <div 
                          key={content.id}
                          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => handleViewContentDetails(content)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center">
                              <i className={`${PLATFORM_DATA[content.platform].iconClass} mr-2 text-lg ${PLATFORM_DATA[content.platform].color}`}></i>
                              <span className="font-medium">{PLATFORM_DATA[content.platform].label}</span>
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(content.scheduledFor).toLocaleDateString('tr-TR', {
                                day: 'numeric',
                                month: 'short'
                              })}
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 line-clamp-2 mb-2">{content.content}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">
                              <i className="ri-time-line mr-1"></i>
                              {formatDateRelative(content.scheduledFor)}
                            </span>
                            <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">
                              Başarısız
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </main>
      
      {/* Content details dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>İçerik Detayları</DialogTitle>
          </DialogHeader>
          
          {selectedContent && (
            <div className="space-y-4">
              <div className="flex items-center">
                <i className={`${PLATFORM_DATA[selectedContent.platform].iconClass} mr-2 text-xl ${PLATFORM_DATA[selectedContent.platform].color}`}></i>
                <span className="text-lg font-medium">{PLATFORM_DATA[selectedContent.platform].label}</span>
                <span className={`ml-auto px-2 py-1 text-xs rounded-full 
                  ${selectedContent.status === "pending" ? "bg-purple-100 text-primary" : 
                    selectedContent.status === "published" ? "bg-green-100 text-green-700" : 
                    "bg-red-100 text-red-700"}`}>
                  {selectedContent.status === "pending" ? "Bekliyor" : 
                   selectedContent.status === "published" ? "Yayınlandı" : "Başarısız"}
                </span>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Paylaşım Zamanı</h3>
                <p className="text-base">
                  {new Date(selectedContent.scheduledFor).toLocaleDateString('tr-TR', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">İçerik</h3>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm whitespace-pre-wrap">{selectedContent.content}</p>
                </div>
              </div>
              
              {selectedContent.mediaUrls && selectedContent.mediaUrls.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Medya</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedContent.mediaUrls.map((url, index) => (
                      <div key={index} className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                        <i className="ri-image-line text-gray-400 text-2xl"></i>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Hesap</h3>
                <div className="flex items-center">
                  {accounts?.find(a => a.id === selectedContent.socialAccountId)?.avatarUrl ? (
                    <Avatar className="w-8 h-8 mr-2">
                      <AvatarImage 
                        src={accounts?.find(a => a.id === selectedContent.socialAccountId)?.avatarUrl || ""} 
                        alt="Account Avatar" 
                      />
                      <AvatarFallback>
                        {getAvatarFallback(accounts?.find(a => a.id === selectedContent.socialAccountId)?.name || "")}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary-100 text-primary mr-2 flex items-center justify-center">
                      <i className={PLATFORM_DATA[selectedContent.platform].iconClass}></i>
                    </div>
                  )}
                  <span>
                    {accounts?.find(a => a.id === selectedContent.socialAccountId)?.name || "Hesap"}
                  </span>
                </div>
              </div>
              
              <DialogFooter className="flex justify-between">
                {selectedContent.status === "pending" && (
                  <Button variant="destructive" onClick={handleDeleteContent}>
                    <i className="ri-delete-bin-line mr-2"></i>
                    İçeriği Sil
                  </Button>
                )}
                <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
                  Kapat
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
