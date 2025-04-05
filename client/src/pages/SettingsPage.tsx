import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import TabNavigation from '@/components/layout/TabNavigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

// Platform icons
const TwitterIcon = () => (
  <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.162 5.656a8.384 8.384 0 0 1-2.402.658A4.196 4.196 0 0 0 21.6 4c-.82.488-1.719.83-2.656 1.015a4.182 4.182 0 0 0-7.126 3.814 11.874 11.874 0 0 1-8.62-4.37 4.168 4.168 0 0 0-.566 2.103c0 1.45.738 2.731 1.86 3.481a4.168 4.168 0 0 1-1.894-.523v.052a4.185 4.185 0 0 0 3.355 4.101 4.21 4.21 0 0 1-1.89.072A4.185 4.185 0 0 0 7.97 16.65a8.394 8.394 0 0 1-6.191 1.732 11.83 11.83 0 0 0 6.41 1.88c7.693 0 11.9-6.373 11.9-11.9 0-.18-.005-.362-.013-.54a8.496 8.496 0 0 0 2.087-2.165z" />
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-5 h-5 text-pink-500" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465.668.25 1.231.585 1.786 1.14.568.555.902 1.118 1.152 1.786.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.152 1.786c-.568.568-1.118.902-1.786 1.152-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.786-1.152 4.902 4.902 0 01-1.152-1.786c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.152-1.786A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg className="w-5 h-5 text-blue-700" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const YoutubeIcon = () => (
  <svg className="w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const SettingsIcon = () => (
  <svg className="w-5 h-5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [autoPost, setAutoPost] = useState(false);
  const [language, setLanguage] = useState('tr');

  // Fetch the current user
  const { data: currentUser, isLoading: isLoadingUser } = useQuery<any>({
    queryKey: ['/api/users/current'],
    select: (data) => data || {}
  });

  // Fetch social accounts
  const { data: accounts, isLoading: isLoadingAccounts } = useQuery<any[]>({
    queryKey: ['/api/accounts'],
    select: (data) => data || []
  });

  // Platform icons mapping
  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'twitter':
        return <TwitterIcon />;
      case 'facebook':
        return <FacebookIcon />;
      case 'instagram':
        return <InstagramIcon />;
      case 'linkedin':
        return <LinkedInIcon />;
      case 'youtube':
        return <YoutubeIcon />;
      default:
        return <SettingsIcon />;
    }
  };

  return (
    <div>
      <TabNavigation />
      
      <div className="page-header mb-6">
        <h1 className="page-title">Ayarlar</h1>
        <p className="page-description">Uygulama ayarlarını ve profil bilgilerinizi düzenleyin</p>
      </div>
      
      <div className="container mx-auto px-4">
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
                    <option value="flat">Flat 2.0</option>
                    <option value="minimal">Minimal</option>
                    <option value="classic">Klasik</option>
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
                    defaultValue="medium"
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
  );
}
