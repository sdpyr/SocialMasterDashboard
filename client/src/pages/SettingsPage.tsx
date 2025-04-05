import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/layout/Header';
import AddressBar from '@/components/layout/AddressBar';
import TabNavigation from '@/components/layout/TabNavigation';
import Sidebar from '@/components/layout/Sidebar';
import StatusBar from '@/components/layout/StatusBar';
import ContentHeader from '@/components/dashboard/ContentHeader';
import { BreadcrumbItem, SortOption } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SettingsIcon, TwitterIcon, FacebookIcon, InstagramIcon, LinkedInIcon, YoutubeIcon } from "@/lib/icons";

export default function SettingsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSort, setCurrentSort] = useState('name');
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [autoPost, setAutoPost] = useState(false);
  const [language, setLanguage] = useState('tr');

  // Breadcrumbs for the current location
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Belgeler', path: '/documents' },
    { label: 'SocialMasterDashboard', path: '/' },
    { label: 'Ayarlar', path: '/settings', isActive: true }
  ];

  // Sort options (for consistency with other pages, not used here)
  const sortOptions: SortOption[] = [
    { label: 'İsim', value: 'name' },
    { label: 'Tür', value: 'type' }
  ];

  // Fetch the current user
  const { data: currentUser, isLoading: isLoadingUser } = useQuery({
    queryKey: ['/api/users/current'],
    select: (data) => data || null
  });

  // Fetch social accounts
  const { data: accounts, isLoading: isLoadingAccounts } = useQuery({
    queryKey: ['/api/accounts'],
    select: (data) => data || []
  });

  // Platform icons mapping
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return <TwitterIcon className="w-5 h-5" />;
      case 'facebook':
        return <FacebookIcon className="w-5 h-5" />;
      case 'instagram':
        return <InstagramIcon className="w-5 h-5" />;
      case 'linkedin':
        return <LinkedInIcon className="w-5 h-5" />;
      case 'youtube':
        return <YoutubeIcon className="w-5 h-5" />;
      default:
        return <SettingsIcon className="w-5 h-5" />;
    }
  };

  return (
    <div className="windows-frame">
      <Header title="SocialMasterDashboard - Ayarlar" />
      
      <AddressBar 
        breadcrumbs={breadcrumbs} 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <TabNavigation />
      
      <div className="flex flex-1">
        <Sidebar />
        
        <div className="flex-1 p-4">
          <ContentHeader 
            title="Ayarlar"
            subtitle="Uygulama ayarlarını yönetin"
            sortOptions={sortOptions}
            currentSort={currentSort}
            onSortChange={setCurrentSort}
          />
          
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="general">Genel</TabsTrigger>
              <TabsTrigger value="accounts">Hesaplar</TabsTrigger>
              <TabsTrigger value="notifications">Bildirimler</TabsTrigger>
              <TabsTrigger value="appearance">Görünüm</TabsTrigger>
              <TabsTrigger value="about">Hakkında</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Genel Ayarlar</CardTitle>
                  <CardDescription>Temel uygulama ayarlarını düzenleyin</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Dil</Label>
                    <select 
                      id="language" 
                      className="w-full p-2 border rounded-md"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                    >
                      <option value="tr">Türkçe</option>
                      <option value="en">English</option>
                      <option value="de">Deutsch</option>
                      <option value="fr">Français</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-post">Otomatik Gönderi</Label>
                    <Switch 
                      id="auto-post" 
                      checked={autoPost}
                      onCheckedChange={setAutoPost}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="data-folder">Veri Klasörü</Label>
                    <div className="flex gap-2">
                      <Input id="data-folder" value="/users/documents/socialmasterdashboard" readOnly />
                      <Button variant="outline">Değiştir</Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Varsayılana Sıfırla</Button>
                  <Button>Kaydet</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Kullanıcı Profili</CardTitle>
                  <CardDescription>Profilinizi yönetin</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoadingUser ? (
                    <div className="h-20 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                  ) : currentUser ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="username">Kullanıcı Adı</Label>
                        <Input id="username" defaultValue={currentUser.username} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fullname">Tam İsim</Label>
                        <Input id="fullname" defaultValue={currentUser.fullName || ''} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">E-posta</Label>
                        <Input id="email" type="email" defaultValue={currentUser.email || ''} />
                      </div>
                    </>
                  ) : (
                    <div className="p-4 text-center">Kullanıcı bilgisi yüklenemedi</div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button className="ml-auto">Profili Güncelle</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="accounts" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Bağlı Hesaplar</CardTitle>
                  <CardDescription>Sosyal medya hesaplarınızı yönetin</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingAccounts ? (
                    <div className="h-20 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                  ) : accounts && accounts.length > 0 ? (
                    <div className="space-y-4">
                      {accounts.map((account: any) => (
                        <div key={account.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            {getPlatformIcon(account.platform)}
                            <div>
                              <p className="font-medium">{account.accountName}</p>
                              <p className="text-sm text-gray-500">{account.platform}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                              {account.isActive ? 'Aktif' : 'Pasif'}
                            </div>
                            <Button variant="outline" size="sm">Düzenle</Button>
                            <Button variant="destructive" size="sm">Kaldır</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center">Bağlı hesap bulunamadı</div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button className="ml-auto">Yeni Hesap Ekle</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>API Ayarları</CardTitle>
                  <CardDescription>API anahtarlarınızı yönetin</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {['Twitter', 'Facebook', 'Instagram', 'LinkedIn', 'YouTube'].map((platform) => (
                    <div key={platform} className="space-y-2">
                      <Label htmlFor={`${platform.toLowerCase()}-api`}>{platform} API Anahtarı</Label>
                      <div className="flex gap-2">
                        <Input id={`${platform.toLowerCase()}-api`} type="password" value="•••••••••••••••••" />
                        <Button variant="outline">Değiştir</Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Sıfırla</Button>
                  <Button>Kaydet</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Bildirim Ayarları</CardTitle>
                  <CardDescription>Bildirim tercihlerinizi düzenleyin</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enable-notifications">Bildirimleri Etkinleştir</Label>
                    <Switch 
                      id="enable-notifications" 
                      checked={notifications}
                      onCheckedChange={setNotifications}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="new-followers">Yeni Takipçi Bildirimleri</Label>
                    <Switch id="new-followers" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="post-engagement">Gönderi Etkileşim Bildirimleri</Label>
                    <Switch id="post-engagement" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="scheduled-posts">Zamanlanan Gönderi Hatırlatmaları</Label>
                    <Switch id="scheduled-posts" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="analytics-reports">Haftalık Analitik Raporları</Label>
                    <Switch id="analytics-reports" />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Varsayılana Sıfırla</Button>
                  <Button>Kaydet</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="appearance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Görünüm Ayarları</CardTitle>
                  <CardDescription>Arayüz görünümünü özelleştirin</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="dark-mode">Karanlık Mod</Label>
                    <Switch 
                      id="dark-mode" 
                      checked={darkMode}
                      onCheckedChange={setDarkMode}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="theme">Tema</Label>
                    <select id="theme" className="w-full p-2 border rounded-md">
                      <option value="default">Varsayılan</option>
                      <option value="windows">Windows</option>
                      <option value="mac">Mac OS</option>
                      <option value="linux">Linux</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="accent-color">Vurgu Rengi</Label>
                    <div className="flex gap-2">
                      {['#0078d7', '#107c10', '#ff8c00', '#e81123', '#5c2d91'].map((color) => (
                        <button
                          key={color}
                          className="w-8 h-8 rounded-full border border-gray-300"
                          style={{ backgroundColor: color }}
                          aria-label={`Renk: ${color}`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="font-size">Yazı Tipi Boyutu</Label>
                    <select 
                      id="font-size" 
                      className="w-full p-2 border rounded-md"
                      value="medium"
                      onChange={(e) => console.log(e.target.value)}
                    >
                      <option value="small">Küçük</option>
                      <option value="medium">Orta</option>
                      <option value="large">Büyük</option>
                    </select>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Varsayılana Sıfırla</Button>
                  <Button>Kaydet</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="about" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Uygulama Hakkında</CardTitle>
                  <CardDescription>SocialMasterDashboard bilgileri</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4">
                    <h3 className="text-xl font-bold">SocialMasterDashboard</h3>
                    <p className="text-sm text-gray-500 mt-1">Versiyon 1.0.0</p>
                    <p className="mt-4">Tüm sosyal medya hesaplarınızı tek yerden yönetin</p>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Sistem Bilgisi</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <span className="text-gray-500">İşletim Sistemi:</span>
                      <span>Windows 10</span>
                      <span className="text-gray-500">Node.js:</span>
                      <span>v18.x</span>
                      <span className="text-gray-500">React:</span>
                      <span>v18.3.1</span>
                      <span className="text-gray-500">Tarayıcı:</span>
                      <span>Chrome 120</span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Destek ve İletişim</h4>
                    <p className="text-sm mb-2">Sorun mu yaşıyorsunuz? Bize ulaşın:</p>
                    <p className="text-sm text-blue-600">support@socialmasterdashboard.com</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button variant="outline">Güncellemeleri Kontrol Et</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <StatusBar itemCount={5} />
    </div>
  );
}
