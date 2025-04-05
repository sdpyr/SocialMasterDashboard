import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import TabNavigation from '@/components/layout/TabNavigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AlertCircle,
  PlusCircle,
  RefreshCw,
  Trash2
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { SocialAccount, User } from '@shared/schema';

// Platform icons
const PlatformIcons = {
  twitter: (
    <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.162 5.656a8.384 8.384 0 0 1-2.402.658A4.196 4.196 0 0 0 21.6 4c-.82.488-1.719.83-2.656 1.015a4.182 4.182 0 0 0-7.126 3.814 11.874 11.874 0 0 1-8.62-4.37 4.168 4.168 0 0 0-.566 2.103c0 1.45.738 2.731 1.86 3.481a4.168 4.168 0 0 1-1.894-.523v.052a4.185 4.185 0 0 0 3.355 4.101 4.21 4.21 0 0 1-1.89.072A4.185 4.185 0 0 0 7.97 16.65a8.394 8.394 0 0 1-6.191 1.732 11.83 11.83 0 0 0 6.41 1.88c7.693 0 11.9-6.373 11.9-11.9 0-.18-.005-.362-.013-.54a8.496 8.496 0 0 0 2.087-2.165z" />
    </svg>
  ),
  facebook: (
    <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  instagram: (
    <svg className="w-5 h-5 text-pink-500" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465.668.25 1.231.585 1.786 1.14.568.555.902 1.118 1.152 1.786.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.152 1.786c-.568.568-1.118.902-1.786 1.152-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.786-1.152 4.902 4.902 0 01-1.152-1.786c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.152-1.786A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63z" />
      <path d="M12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
    </svg>
  ),
  linkedin: (
    <svg className="w-5 h-5 text-blue-700" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  youtube: (
    <svg className="w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  tiktok: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.54 6.42a2.78 2.78 0 0 1-1.94-2C20.336 3.32 20.2 2.26 20.2 2h-5.64v16.96c0 .5-.4 1.38-.92 1.7-.5.32-1.22.36-1.8.12-.58-.22-1-.76-1.12-1.34-.12-.6 0-1.24.3-1.76.32-.52.8-.88 1.38-1 .58-.12 1.16.02 1.66.36V10.9c-.66-.14-1.34-.2-2.02-.2-2.02 0-3.86.94-5.04 2.62-1.16 1.62-1.48 3.76-.8 5.76.67 1.92 2.22 3.62 4.1 4.46 1.82.84 3.9.92 5.76.22 1.84-.7 3.32-2.18 4-4.02.2-.58.3-1.18.3-1.8V11.8a8.95 8.95 0 0 0 4.9 1.42v-5.5c-1.88.26-3.66-.7-4.4-2.3z" />
    </svg>
  ),
  pinterest: (
    <svg className="w-5 h-5 text-red-700" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" />
    </svg>
  )
};

// OAuth Sosyal Medya Platformları
const supportedPlatforms = [
  { id: 'facebook', name: 'Facebook', color: 'bg-blue-600', textColor: 'text-white' },
  { id: 'twitter', name: 'Twitter (X)', color: 'bg-black', textColor: 'text-white' },
  { id: 'instagram', name: 'Instagram', color: 'bg-gradient-to-r from-pink-500 to-yellow-500', textColor: 'text-white' },
  { id: 'linkedin', name: 'LinkedIn', color: 'bg-blue-700', textColor: 'text-white' },
  { id: 'youtube', name: 'YouTube', color: 'bg-red-600', textColor: 'text-white' },
  { id: 'tiktok', name: 'TikTok', color: 'bg-black', textColor: 'text-white' },
  { id: 'pinterest', name: 'Pinterest', color: 'bg-red-700', textColor: 'text-white' },
];

export default function AdminPanel() {
  const [isAdmin, setIsAdmin] = useState(true); // Geliştirme aşamasında herkese admin yetkisi verelim
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userFormData, setUserFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    role: 'user',
    subscriptionTier: 'free'
  });

  // Kullanıcıları getir
  const { data: users, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ['/api/users'],
    select: (data) => data || [],
  });

  // Sosyal hesapları getir
  const { data: accounts, isLoading: accountsLoading } = useQuery<SocialAccount[]>({
    queryKey: ['/api/accounts'],
    select: (data) => data || [],
  });

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setUserFormData({
      username: user.username || '',
      email: user.email || '',
      fullName: user.fullName || '',
      role: user.role || 'user',
      subscriptionTier: user.subscriptionTier || 'free'
    });
    setOpenUserDialog(true);
  };

  const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUserSubmit = async () => {
    if (editingUser) {
      try {
        // API isteği burada olacak
        console.log('Updating user:', userFormData);
        // await apiRequest(`/api/users/${editingUser.id}`, 'PATCH', userFormData);
        // Başarılı mesajı
        // toast({
        //   title: "Kullanıcı güncellendi",
        //   description: "Kullanıcı bilgileri başarıyla güncellendi.",
        // });
      } catch (error) {
        console.error('Error updating user:', error);
        // toast({
        //   variant: "destructive",
        //   title: "Hata",
        //   description: "Kullanıcı güncellenirken bir hata oluştu.",
        // });
      }
    } else {
      try {
        // Yeni kullanıcı oluştur
        console.log('Creating user:', userFormData);
        // await apiRequest('/api/users', 'POST', userFormData);
        // Başarılı mesajı
        // toast({
        //   title: "Kullanıcı oluşturuldu",
        //   description: "Yeni kullanıcı başarıyla oluşturuldu.",
        // });
      } catch (error) {
        console.error('Error creating user:', error);
        // toast({
        //   variant: "destructive",
        //   title: "Hata",
        //   description: "Kullanıcı oluşturulurken bir hata oluştu.",
        // });
      }
    }

    // Kullanıcı listesini yenile
    // await fetchData();
    setOpenUserDialog(false);
  };

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
      try {
        // API isteği burada olacak
        console.log('Deleting user ID:', userId);
        // await apiRequest(`/api/users/${userId}`, 'DELETE');
        // Başarılı mesajı
        // toast({
        //   title: "Kullanıcı silindi",
        //   description: "Kullanıcı başarıyla silindi.",
        // });
        // Kullanıcı listesini yenile
        // await fetchData();
      } catch (error) {
        console.error('Error deleting user:', error);
        // toast({
        //   variant: "destructive",
        //   title: "Hata",
        //   description: "Kullanıcı silinirken bir hata oluştu.",
        // });
      }
    }
  };

  const formatDate = (dateString: string | Date | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  if (!isAdmin) {
    return (
      <div>
        <TabNavigation />
        <div className="page-header mb-8">
          <h1 className="page-title">Yönetim Paneli</h1>
          <p className="page-description">Erişim reddedildi - Bu sayfaya erişmek için yönetici yetkileri gereklidir</p>
        </div>
        <Alert variant="destructive" className="max-w-2xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Bu sayfaya erişmek için yönetici yetkileri gereklidir.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <TabNavigation />
      <div className="page-header mb-8">
        <h1 className="page-title">Yönetim Paneli</h1>
        <p className="page-description">Sistem ayarlarını yapılandırın ve içeriği yönetin</p>
      </div>
      
      <Tabs defaultValue="ui-settings">
        <TabsList className="mb-4">
          <TabsTrigger value="ui-settings">Arayüz Ayarları</TabsTrigger>
          <TabsTrigger value="users">Kullanıcı Yönetimi</TabsTrigger>
          <TabsTrigger value="social-accounts">Sosyal Medya</TabsTrigger>
          <TabsTrigger value="ads">Reklam Yönetimi</TabsTrigger>
          <TabsTrigger value="analytics">Analitik</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="plans">Ücretli Planlar</TabsTrigger>
          <TabsTrigger value="pages">Sayfalar</TabsTrigger>
        </TabsList>
        
        <TabsContent value="ui-settings">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Arayüz Ayarları</CardTitle>
              <Button variant="outline" size="sm" onClick={() => console.log('Yenileniyor...')}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Yenile
              </Button>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Header Ayarları */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Header Düzenleme</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="header-logo">Logo (SVG, PNG or JPG)</Label>
                    <div className="flex items-center space-x-2">
                      <Input id="header-logo" type="file" accept=".svg,.png,.jpg,.jpeg" />
                      <Button variant="outline" size="sm">Yükle</Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="header-title">Site Başlığı</Label>
                    <Input id="header-title" type="text" defaultValue="SocialMasterDashboard" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="header-bg-color">Header Arkaplan Rengi</Label>
                    <div className="flex gap-2 items-center">
                      <Input id="header-bg-color" type="color" defaultValue="#ffffff" className="w-12 h-10 p-1" />
                      <Input type="text" defaultValue="#ffffff" className="flex-1" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="header-text-color">Header Yazı Rengi</Label>
                    <div className="flex gap-2 items-center">
                      <Input id="header-text-color" type="color" defaultValue="#333333" className="w-12 h-10 p-1" />
                      <Input type="text" defaultValue="#333333" className="flex-1" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Header Görünürlüğü</Label>
                    <div className="flex items-center space-x-2">
                      <Switch id="header-show" defaultChecked />
                      <Label htmlFor="header-show">Header'ı göster</Label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Header Ögeleri</Label>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Switch id="show-profile" defaultChecked />
                        <Label htmlFor="show-profile">Profil fotoğrafını göster</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="show-notifications" defaultChecked />
                        <Label htmlFor="show-notifications">Bildirimleri göster</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="show-search" defaultChecked />
                        <Label htmlFor="show-search">Arama kutusunu göster</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Ayarları */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Sidebar Düzenleme</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="sidebar-bg-color">Sidebar Arkaplan Rengi</Label>
                    <div className="flex gap-2 items-center">
                      <Input id="sidebar-bg-color" type="color" defaultValue="#f8f9fa" className="w-12 h-10 p-1" />
                      <Input type="text" defaultValue="#f8f9fa" className="flex-1" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sidebar-text-color">Sidebar Yazı Rengi</Label>
                    <div className="flex gap-2 items-center">
                      <Input id="sidebar-text-color" type="color" defaultValue="#333333" className="w-12 h-10 p-1" />
                      <Input type="text" defaultValue="#333333" className="flex-1" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sidebar-active-color">Aktif Menü Öğesi Rengi</Label>
                    <div className="flex gap-2 items-center">
                      <Input id="sidebar-active-color" type="color" defaultValue="#4338ca" className="w-12 h-10 p-1" />
                      <Input type="text" defaultValue="#4338ca" className="flex-1" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Sidebar Görünürlüğü</Label>
                    <div className="flex items-center space-x-2">
                      <Switch id="sidebar-show" defaultChecked />
                      <Label htmlFor="sidebar-show">Sidebar'ı göster</Label>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sidebar-items">Sidebar Menü Öğeleri</Label>
                  <div className="border rounded-md p-4 bg-gray-50">
                    <div className="space-y-2">
                      {[
                        { id: 'dashboard', name: 'Dashboard', enabled: true },
                        { id: 'posts', name: 'Gönderiler', enabled: true },
                        { id: 'accounts', name: 'Hesaplar', enabled: true },
                        { id: 'analytics', name: 'Analitik', enabled: true },
                        { id: 'settings', name: 'Ayarlar', enabled: true },
                        { id: 'messages', name: 'Mesajlar', enabled: false }
                      ].map(item => (
                        <div key={item.id} className="flex items-center justify-between p-2 bg-white border rounded">
                          <span>{item.name}</span>
                          <div className="flex items-center gap-3">
                            <Switch id={`enable-${item.id}`} defaultChecked={item.enabled} />
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm">⬆️</Button>
                              <Button variant="ghost" size="sm">⬇️</Button>
                            </div>
                          </div>
                        </div>
                      ))}
                      <Button size="sm" className="mt-2">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Yeni Menü Öğesi Ekle
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Ayarları */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Footer Düzenleme</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="footer-text">Footer Metni</Label>
                    <Input id="footer-text" defaultValue="© 2025 SocialMasterDashboard. Tüm hakları saklıdır." />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="footer-bg-color">Footer Arkaplan Rengi</Label>
                    <div className="flex gap-2 items-center">
                      <Input id="footer-bg-color" type="color" defaultValue="#f8f9fa" className="w-12 h-10 p-1" />
                      <Input type="text" defaultValue="#f8f9fa" className="flex-1" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="footer-text-color">Footer Yazı Rengi</Label>
                    <div className="flex gap-2 items-center">
                      <Input id="footer-text-color" type="color" defaultValue="#6b7280" className="w-12 h-10 p-1" />
                      <Input type="text" defaultValue="#6b7280" className="flex-1" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Footer Görünürlüğü</Label>
                    <div className="flex items-center space-x-2">
                      <Switch id="footer-show" defaultChecked />
                      <Label htmlFor="footer-show">Footer'ı göster</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="footer-links">Footer Bağlantıları</Label>
                  <div className="border rounded-md p-4 bg-gray-50">
                    <div className="space-y-2">
                      {[
                        { id: 'terms', name: 'Kullanım Koşulları', url: '/terms' },
                        { id: 'privacy', name: 'Gizlilik Politikası', url: '/privacy' },
                        { id: 'contact', name: 'İletişim', url: '/contact' }
                      ].map(link => (
                        <div key={link.id} className="flex items-center justify-between p-2 bg-white border rounded">
                          <span>{link.name}</span>
                          <div className="flex items-center gap-2">
                            <Input className="w-40" defaultValue={link.url} />
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      <Button size="sm" className="mt-2">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Yeni Bağlantı Ekle
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Varsayılana Sıfırla</Button>
              <Button>Değişiklikleri Kaydet</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Kullanıcı Yönetimi</CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => console.log('Yenileniyor...')}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Yenile
                </Button>
                <Button size="sm" onClick={() => {
                  setEditingUser(null);
                  setUserFormData({
                    username: '',
                    email: '',
                    fullName: '',
                    role: 'user',
                    subscriptionTier: 'free'
                  });
                  setOpenUserDialog(true);
                }}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Yeni Kullanıcı
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {usersLoading ? (
                <div className="flex justify-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Kullanıcı Adı</TableHead>
                      <TableHead>Ad Soyad</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Abonelik</TableHead>
                      <TableHead>Kayıt Tarihi</TableHead>
                      <TableHead className="text-right">İşlemler</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users && users.map(user => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.id}</TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.fullName || '-'}</TableCell>
                        <TableCell>
                          {user.role === 'admin' ? (
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                              Admin
                            </span>
                          ) : user.role === 'moderator' ? (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                              Moderatör
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                              Kullanıcı
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {user.subscriptionTier === 'premium' ? (
                            <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                              Premium
                            </span>
                          ) : user.subscriptionTier === 'pro' ? (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                              Pro
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                              Ücretsiz
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{formatDate(user.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditUser(user)}
                            >
                              Düzenle
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-800 hover:bg-red-50"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!users || users.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                          Henüz kullanıcı bulunmuyor
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="social-accounts">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Sosyal Medya Hesapları</CardTitle>
              <Button variant="outline" size="sm" onClick={() => console.log('Yenileniyor...')}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Yenile
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {/* Bağlı Hesaplar */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Bağlı Hesaplar</h3>
                  
                  {accountsLoading ? (
                    <div className="flex justify-center py-8">
                      <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                  ) : accounts && accounts.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Platform</TableHead>
                          <TableHead>Hesap Adı</TableHead>
                          <TableHead>Durum</TableHead>
                          <TableHead>Bağlantı Tarihi</TableHead>
                          <TableHead>Son Senkronizasyon</TableHead>
                          <TableHead className="text-right">İşlemler</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {accounts.map(account => (
                          <TableRow key={account.id}>
                            <TableCell>
                              <div className="flex items-center">
                                {PlatformIcons[account.platform.toLowerCase() as keyof typeof PlatformIcons] || (
                                  <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                                    {account.platform.charAt(0).toUpperCase()}
                                  </div>
                                )}
                                <span className="ml-2 font-medium">{account.platform}</span>
                              </div>
                            </TableCell>
                            <TableCell>{account.accountName}</TableCell>
                            <TableCell>
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                Aktif
                              </span>
                            </TableCell>
                            <TableCell>{formatDate(account.createdAt)}</TableCell>
                            <TableCell>{formatDate(account.lastSync)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => window.alert('Hesap ayarlarını düzenle')}
                                >
                                  Düzenle
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:text-red-800 hover:bg-red-50"
                                  onClick={() => window.confirm('Bu sosyal medya hesabını kaldırmak istediğinizden emin misiniz?')}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Henüz bağlanmış sosyal medya hesabı bulunmuyor
                    </div>
                  )}
                </div>

                {/* Yeni Hesap Bağlama */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Yeni Sosyal Medya Hesabı Bağla</h3>
                  <p className="text-sm text-gray-500">
                    İçerik paylaşımı yapabileceğiniz yeni bir sosyal medya hesabı bağlayın. Hesaba bağlanmak için ilgili platforma yönlendirileceksiniz.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {supportedPlatforms.map(platform => (
                      <button
                        key={platform.id}
                        className={`flex items-center gap-3 p-4 rounded-lg transition-colors ${platform.color} ${platform.textColor}`}
                        onClick={() => window.alert(`${platform.name} bağlantısı başlatılıyor... Bu işlem yeni pencere açacaktır.`)}
                      >
                        {PlatformIcons[platform.id as keyof typeof PlatformIcons]}
                        <span className="font-medium">{platform.name} Bağla</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* API Entegrasyonu */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">API Anahtarları ve Entegrasyonlar</h3>
                  
                  <div className="space-y-4">
                    {supportedPlatforms.map(platform => (
                      <div key={platform.id} className="border p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {PlatformIcons[platform.id as keyof typeof PlatformIcons]}
                            <span className="font-medium">{platform.name} API</span>
                          </div>
                          <Button variant="outline" size="sm">Yapılandır</Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div className="space-y-2">
                            <Label htmlFor={`${platform.id}-api-key`}>API Anahtarı</Label>
                            <Input
                              id={`${platform.id}-api-key`}
                              type="password"
                              placeholder="API anahtarını girin"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`${platform.id}-api-secret`}>API Secret</Label>
                            <Input
                              id={`${platform.id}-api-secret`}
                              type="password"
                              placeholder="API secret'ını girin"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>API Ayarlarını Kaydet</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="ads">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Reklam Yönetimi</CardTitle>
              <Button variant="outline" size="sm" onClick={() => console.log('Yenileniyor...')}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Yenile
              </Button>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Aktif Reklamlar */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Aktif Reklamlar</h3>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reklam Adı</TableHead>
                      <TableHead>Pozisyon</TableHead>
                      <TableHead>Format</TableHead>
                      <TableHead>Başlangıç</TableHead>
                      <TableHead>Bitiş</TableHead>
                      <TableHead>Durum</TableHead>
                      <TableHead className="text-right">İşlemler</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { id: 1, name: 'Premium Üyelik Kampanyası', position: 'Üst Banner', format: 'Resim', startDate: '2025-03-15', endDate: '2025-04-15', status: 'active' },
                      { id: 2, name: 'Sosyal Medya Eğitimi', position: 'Sağ Sidebar', format: 'Resim', startDate: '2025-04-01', endDate: '2025-05-01', status: 'active' },
                      { id: 3, name: 'İçerik Pazarlama Webinarı', position: 'Pop-up', format: 'HTML', startDate: '2025-03-25', endDate: '2025-04-05', status: 'scheduled' }
                    ].map(ad => (
                      <TableRow key={ad.id}>
                        <TableCell className="font-medium">{ad.name}</TableCell>
                        <TableCell>{ad.position}</TableCell>
                        <TableCell>{ad.format}</TableCell>
                        <TableCell>{ad.startDate}</TableCell>
                        <TableCell>{ad.endDate}</TableCell>
                        <TableCell>
                          {ad.status === 'active' ? (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                              Aktif
                            </span>
                          ) : ad.status === 'scheduled' ? (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                              Planlandı
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                              Sona Erdi
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.alert('Reklam düzenleniyor')}
                            >
                              Düzenle
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-800 hover:bg-red-50"
                              onClick={() => window.confirm('Bu reklamı silmek istediğinizden emin misiniz?')}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                <Button className="mt-4">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Yeni Reklam Ekle
                </Button>
              </div>
              
              {/* Reklam Alanları Yönetimi */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Reklam Alanları Yönetimi</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { id: 'header-banner', name: 'Üst Banner', enabled: true, size: '728x90' },
                    { id: 'sidebar-ad', name: 'Sağ Sidebar', enabled: true, size: '300x250' },
                    { id: 'footer-banner', name: 'Alt Banner', enabled: false, size: '728x90' },
                    { id: 'popup-ad', name: 'Pop-up Reklam', enabled: false, size: '500x400' },
                    { id: 'content-ad', name: 'İçerik Arası', enabled: true, size: '640x120' },
                  ].map(zone => (
                    <Card key={zone.id} className="overflow-hidden">
                      <div className={`h-2 ${zone.enabled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">{zone.name}</h4>
                            <p className="text-sm text-gray-500">Boyut: {zone.size}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch id={`enable-${zone.id}`} checked={zone.enabled} />
                            <Label htmlFor={`enable-${zone.id}`}>
                              {zone.enabled ? 'Aktif' : 'Pasif'}
                            </Label>
                          </div>
                        </div>
                        <div className="mt-4 border border-dashed border-gray-300 rounded flex items-center justify-center bg-gray-50" style={{ height: '100px' }}>
                          <span className="text-gray-400">Reklam Önizleme Alanı</span>
                        </div>
                        <div className="mt-4 flex justify-end gap-2">
                          <Button variant="outline" size="sm">Düzenle</Button>
                          <Button variant="outline" size="sm">Önizle</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              {/* Google AdSense Entegrasyonu */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Google AdSense Entegrasyonu</h3>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="adsense-publisher-id">Publisher ID</Label>
                        <Input id="adsense-publisher-id" placeholder="pub-xxxxxxxxxxxxxxxx" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="adsense-code">AdSense Kodu</Label>
                        <Textarea
                          id="adsense-code"
                          placeholder="<script async src=&quot;https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-xxxxxxxxxxxxxxxx&quot; crossorigin=&quot;anonymous&quot;></script>"
                          rows={4}
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch id="auto-ads" />
                        <Label htmlFor="auto-ads">Otomatik reklamları etkinleştir</Label>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button>AdSense Ayarlarını Kaydet</Button>
                  </CardFooter>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Analitik Ayarları</CardTitle>
              <Button variant="outline" size="sm" onClick={() => console.log('Yenileniyor...')}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Yenile
              </Button>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Google Analytics */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Google Analytics Entegrasyonu</h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ga-tracking-id">Measurement ID</Label>
                    <Input id="ga-tracking-id" placeholder="G-XXXXXXXXXX" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ga-code">Google Analytics Kodu</Label>
                    <Textarea
                      id="ga-code"
                      placeholder="<!-- Google tag (gtag.js) --><script async src=&quot;https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX&quot;></script><script>window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-XXXXXXXXXX');</script>"
                      rows={4}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="enable-ga" defaultChecked />
                    <Label htmlFor="enable-ga">Google Analytics etkinleştir</Label>
                  </div>
                </div>
              </div>
              
              {/* Facebook Pixel */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Facebook Pixel Entegrasyonu</h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fb-pixel-id">Facebook Pixel ID</Label>
                    <Input id="fb-pixel-id" placeholder="XXXXXXXXXXXXXXXXXX" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fb-pixel-code">Facebook Pixel Kodu</Label>
                    <Textarea
                      id="fb-pixel-code"
                      placeholder="<!-- Facebook Pixel Code --><script>!function(f,b,e,v,n,t,s) {if(f.fbq)return;n=f.fbq=function(){n.callMethod? n.callMethod.apply(n,arguments):n.queue.push(arguments)}; if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0'; n.queue=[];t=b.createElement(e);t.async=!0; t.src=v;s=b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t,s)}(window, document,'script', 'https://connect.facebook.net/en_US/fbevents.js'); fbq('init', 'XXXXXXXXXXXXXXXXXX'); fbq('track', 'PageView');</script><noscript><img height=&quot;1&quot; width=&quot;1&quot; style=&quot;display:none&quot; src=&quot;https://www.facebook.com/tr?id=XXXXXXXXXXXXXXXXXX&amp;ev=PageView&amp;noscript=1&quot;/></noscript><!-- End Facebook Pixel Code -->"
                      rows={4}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="enable-fb-pixel" />
                    <Label htmlFor="enable-fb-pixel">Facebook Pixel etkinleştir</Label>
                  </div>
                </div>
              </div>
              
              {/* İçerik Analizi */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">İçerik Analizi Ayarları</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">İçerik Performans Raporları</p>
                      <p className="text-sm text-gray-500">Otomatik haftalık performans raporları</p>
                    </div>
                    <Switch id="enable-content-reports" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Kullanıcı Davranış Analizi</p>
                      <p className="text-sm text-gray-500">Kullanıcıların içeriklerle etkileşimini takip et</p>
                    </div>
                    <Switch id="enable-behavior-analysis" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">İstenmeyen İçerik Tespiti</p>
                      <p className="text-sm text-gray-500">Uygunsuz içeriklerin otomatik tespiti</p>
                    </div>
                    <Switch id="enable-content-moderation" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Analitik Ayarlarını Kaydet</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* SEO Sekmesi */}
        <TabsContent value="seo">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>SEO Ayarları</CardTitle>
              <Button variant="outline" size="sm" onClick={() => console.log('Yenileniyor...')}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Yenile
              </Button>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Genel SEO Ayarları */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Genel SEO Ayarları</h3>
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="site-title">Site Başlığı</Label>
                    <Input id="site-title" placeholder="SocialMasterDashboard - Sosyal Medya Yönetim Platformu" />
                    <p className="text-sm text-gray-500">Google arama sonuçlarında görünecek başlık</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="meta-description">Meta Açıklaması</Label>
                    <Textarea 
                      id="meta-description" 
                      placeholder="SocialMasterDashboard ile tüm sosyal medya hesaplarınızı tek bir yerden yönetin, içerik planlayın, analitikleri takip edin." 
                      className="h-20"
                    />
                    <p className="text-sm text-gray-500">Google arama sonuçlarında görünecek açıklama (max 160 karakter)</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="meta-keywords">Meta Anahtar Kelimeleri</Label>
                    <Input id="meta-keywords" placeholder="sosyal medya, sosyal medya yönetimi, içerik planlama, analitik" />
                    <p className="text-sm text-gray-500">Anahtar kelimeleri virgülle ayırın</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="robots-txt">Robots.txt İçeriği</Label>
                    <Textarea 
                      id="robots-txt" 
                      className="h-32 font-mono"
                      defaultValue={`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /settings\n\nSitemap: https://socialmaster.example.com/sitemap.xml`}
                    />
                  </div>
                </div>
              </div>

              {/* Sosyal Medya Meta Etiketleri */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Sosyal Medya Meta Etiketleri</h3>
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="og-title">Open Graph Başlığı</Label>
                    <Input id="og-title" placeholder="SocialMasterDashboard - Sosyal Medya Yönetim Platformu" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="og-description">Open Graph Açıklaması</Label>
                    <Textarea 
                      id="og-description" 
                      placeholder="SocialMasterDashboard ile tüm sosyal medya hesaplarınızı tek bir yerden yönetin." 
                      className="h-20"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="og-image">Open Graph Resmi</Label>
                    <div className="flex items-center space-x-2">
                      <Input id="og-image" type="file" accept=".png,.jpg,.jpeg" />
                      <Button variant="outline" size="sm">Yükle</Button>
                    </div>
                    <p className="text-sm text-gray-500">Önerilen boyut: 1200x630 piksel</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="twitter-card">Twitter Kart Tipi</Label>
                    <Select defaultValue="summary_large_image">
                      <SelectTrigger>
                        <SelectValue placeholder="Bir kart tipi seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="summary">Summary</SelectItem>
                        <SelectItem value="summary_large_image">Summary Large Image</SelectItem>
                        <SelectItem value="app">App</SelectItem>
                        <SelectItem value="player">Player</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Gelişmiş SEO Ayarları */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Gelişmiş SEO Ayarları</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Canonical URL</Label>
                    <div className="flex items-center space-x-2">
                      <Switch id="canonical-url" defaultChecked />
                      <Label htmlFor="canonical-url">Canonical URL'leri etkinleştir</Label>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>XML Sitemap</Label>
                    <div className="flex items-center space-x-2">
                      <Switch id="auto-sitemap" defaultChecked />
                      <Label htmlFor="auto-sitemap">Otomatik sitemap oluştur</Label>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Structured Data</Label>
                    <div className="flex items-center space-x-2">
                      <Switch id="structured-data" defaultChecked />
                      <Label htmlFor="structured-data">Schema.org markup ekle</Label>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Google Analytics</Label>
                    <div className="flex items-center space-x-2">
                      <Switch id="ga-enabled" defaultChecked />
                      <Label htmlFor="ga-enabled">Google Analytics'i etkinleştir</Label>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ga-id">Google Analytics ID</Label>
                  <Input id="ga-id" placeholder="UA-XXXXXXXXX-X veya G-XXXXXXXXXX" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gtm-id">Google Tag Manager ID</Label>
                  <Input id="gtm-id" placeholder="GTM-XXXXXXX" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="custom-head">Özel Head Kodu</Label>
                  <Textarea 
                    id="custom-head" 
                    className="h-32 font-mono"
                    placeholder="<!-- Buraya eklenecek kod <head> etiketinin içine yerleştirilecektir -->"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Varsayılana Sıfırla</Button>
              <Button>Değişiklikleri Kaydet</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Ücretli Planlar Sekmesi */}
        <TabsContent value="plans">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Ücretli Plan Yönetimi</CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => console.log('Yenileniyor...')}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Yenile
                </Button>
                <Button size="sm" onClick={() => console.log('Yeni plan ekleniyor...')}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Yeni Plan
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Mevcut Planlar Tablosu */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Plan Adı</TableHead>
                    <TableHead>Fiyat</TableHead>
                    <TableHead>Fatura Döngüsü</TableHead>
                    <TableHead>Özellikler</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { 
                      id: 1, 
                      name: 'Free', 
                      price: 0, 
                      cycle: 'monthly', 
                      features: ['5 sosyal medya hesabı', '1 kullanıcı', 'Temel analitik'], 
                      status: 'active' 
                    },
                    { 
                      id: 2, 
                      name: 'Premium', 
                      price: 9.99, 
                      cycle: 'monthly', 
                      features: ['20 sosyal medya hesabı', '3 kullanıcı', 'Gelişmiş analitik', 'İçerik planlama'], 
                      status: 'active' 
                    },
                    { 
                      id: 3, 
                      name: 'Pro', 
                      price: 19.99, 
                      cycle: 'monthly', 
                      features: ['Sınırsız sosyal medya hesabı', '10 kullanıcı', 'Tüm özellikler'], 
                      status: 'active' 
                    },
                    { 
                      id: 4, 
                      name: 'Enterprise', 
                      price: 99.99, 
                      cycle: 'monthly', 
                      features: ['Sınırsız sosyal medya hesabı', 'Sınırsız kullanıcı', 'Tüm özellikler', 'Öncelikli destek'], 
                      status: 'draft' 
                    }
                  ].map(plan => (
                    <TableRow key={plan.id}>
                      <TableCell className="font-medium">{plan.id}</TableCell>
                      <TableCell>{plan.name}</TableCell>
                      <TableCell>
                        {plan.price === 0 ? 'Ücretsiz' : `$${plan.price.toFixed(2)}`}
                      </TableCell>
                      <TableCell>
                        {plan.cycle === 'monthly' ? 'Aylık' : 
                         plan.cycle === 'yearly' ? 'Yıllık' : 
                         plan.cycle === 'quarterly' ? '3 Aylık' : plan.cycle}
                      </TableCell>
                      <TableCell>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="sm">Özellikleri Gör</Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <div className="space-y-2">
                              <h4 className="font-medium">{plan.name} Plan Özellikleri</h4>
                              <ul className="list-disc pl-5 space-y-1">
                                {plan.features.map((feature, i) => (
                                  <li key={i} className="text-sm">{feature}</li>
                                ))}
                              </ul>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                      <TableCell>
                        {plan.status === 'active' ? (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            Aktif
                          </span>
                        ) : plan.status === 'draft' ? (
                          <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                            Taslak
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                            Pasif
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => console.log('Plan düzenleniyor:', plan.id)}
                          >
                            Düzenle
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-800 hover:bg-red-100"
                            onClick={() => console.log('Plan siliniyor:', plan.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Planları Karşılaştır Tablosu */}
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Plan Karşılaştırma Tablosu</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Özellik</TableHead>
                      <TableHead>Free</TableHead>
                      <TableHead>Premium</TableHead>
                      <TableHead>Pro</TableHead>
                      <TableHead>Enterprise</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { feature: 'Sosyal Medya Hesapları', free: '5', premium: '20', pro: 'Sınırsız', enterprise: 'Sınırsız' },
                      { feature: 'Kullanıcı Sayısı', free: '1', premium: '3', pro: '10', enterprise: 'Sınırsız' },
                      { feature: 'İçerik Planlama', free: '✓', premium: '✓', pro: '✓', enterprise: '✓' },
                      { feature: 'Otomatik Yayınlama', free: '✓', premium: '✓', pro: '✓', enterprise: '✓' },
                      { feature: 'Temel Analitik', free: '✓', premium: '✓', pro: '✓', enterprise: '✓' },
                      { feature: 'Gelişmiş Analitik', free: '✗', premium: '✓', pro: '✓', enterprise: '✓' },
                      { feature: 'Rakip Analizi', free: '✗', premium: '✗', pro: '✓', enterprise: '✓' },
                      { feature: 'Özel Raporlar', free: '✗', premium: '✗', pro: '✓', enterprise: '✓' },
                      { feature: 'API Erişimi', free: '✗', premium: '✗', pro: '✓', enterprise: '✓' },
                      { feature: 'Öncelikli Destek', free: '✗', premium: '✗', pro: '✗', enterprise: '✓' },
                      { feature: 'White Label', free: '✗', premium: '✗', pro: '✗', enterprise: '✓' }
                    ].map((row, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{row.feature}</TableCell>
                        <TableCell className="text-center">{row.free}</TableCell>
                        <TableCell className="text-center">{row.premium}</TableCell>
                        <TableCell className="text-center">{row.pro}</TableCell>
                        <TableCell className="text-center">{row.enterprise}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Promosyon Kodları */}
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Promosyon Kodu Yönetimi</h3>
                <div className="flex mb-4 justify-end">
                  <Button size="sm" onClick={() => console.log('Yeni promosyon kodu ekleniyor...')}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Yeni Promosyon Kodu
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Kod</TableHead>
                      <TableHead>İndirim</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Geçerlilik</TableHead>
                      <TableHead>Kullanım</TableHead>
                      <TableHead>Durum</TableHead>
                      <TableHead className="text-right">İşlemler</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { 
                        code: 'WELCOME2025', 
                        discount: '%20', 
                        plan: 'Premium', 
                        validity: '01/05/2025 - 31/05/2025', 
                        usage: '0/50',
                        status: 'active'
                      },
                      { 
                        code: 'SUMMER25', 
                        discount: '%25', 
                        plan: 'Tümü', 
                        validity: '01/06/2025 - 31/08/2025', 
                        usage: '0/100',
                        status: 'inactive'
                      }
                    ].map((promo, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{promo.code}</TableCell>
                        <TableCell>{promo.discount}</TableCell>
                        <TableCell>{promo.plan}</TableCell>
                        <TableCell>{promo.validity}</TableCell>
                        <TableCell>{promo.usage}</TableCell>
                        <TableCell>
                          {promo.status === 'active' ? (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                              Aktif
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                              Pasif
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => console.log('Promosyon kodu düzenleniyor:', promo.code)}
                            >
                              Düzenle
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-800 hover:bg-red-100"
                              onClick={() => console.log('Promosyon kodu siliniyor:', promo.code)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Değişiklikleri Kaydet</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Sayfalar Sekmesi */}
        <TabsContent value="pages">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Sayfa Yönetimi</CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => console.log('Yenileniyor...')}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Yenile
                </Button>
                <Button size="sm" onClick={() => console.log('Yeni sayfa ekleniyor...')}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Yeni Sayfa
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Sayfalar Tablosu */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Başlık</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Tip</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>Son Güncelleme</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { 
                      title: 'Anasayfa', 
                      slug: '/', 
                      type: 'system', 
                      status: 'published',
                      updated: '12/03/2025'
                    },
                    { 
                      title: 'Hakkımızda', 
                      slug: '/about', 
                      type: 'custom', 
                      status: 'published',
                      updated: '15/03/2025'
                    },
                    { 
                      title: 'Kullanım Koşulları', 
                      slug: '/terms', 
                      type: 'legal', 
                      status: 'published',
                      updated: '10/03/2025'
                    },
                    { 
                      title: 'Gizlilik Politikası', 
                      slug: '/privacy', 
                      type: 'legal', 
                      status: 'published',
                      updated: '10/03/2025'
                    },
                    { 
                      title: 'SSS', 
                      slug: '/faq', 
                      type: 'custom', 
                      status: 'draft',
                      updated: '20/03/2025'
                    },
                    { 
                      title: 'İletişim', 
                      slug: '/contact', 
                      type: 'system', 
                      status: 'published',
                      updated: '18/03/2025'
                    }
                  ].map((page, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{page.title}</TableCell>
                      <TableCell>{page.slug}</TableCell>
                      <TableCell>
                        {page.type === 'system' ? (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            Sistem
                          </span>
                        ) : page.type === 'legal' ? (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                            Yasal
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                            Özel
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {page.status === 'published' ? (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            Yayında
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                            Taslak
                          </span>
                        )}
                      </TableCell>
                      <TableCell>{page.updated}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => console.log('Sayfa düzenleniyor:', page.title)}
                          >
                            Düzenle
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => console.log('Sayfa görüntüleniyor:', page.slug)}
                          >
                            Görüntüle
                          </Button>
                          {page.type !== 'system' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-800 hover:bg-red-100"
                              onClick={() => console.log('Sayfa siliniyor:', page.title)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Sayfa Şablonları */}
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Sayfa Şablonları</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      title: 'Standart Sayfa',
                      description: 'Başlık, içerik ve isteğe bağlı görseller olan temel sayfa düzeni',
                      img: '📄'
                    },
                    {
                      title: 'Yasal Doküman',
                      description: 'Yasal metinler için bölümlere ayrılmış, numaralandırılmış düzen',
                      img: '📜'
                    },
                    {
                      title: 'Hakkımızda',
                      description: 'Ekip üyeleri, şirket bilgileri ve misyon görünümü için düzen',
                      img: '🏢'
                    },
                    {
                      title: 'İletişim Sayfası',
                      description: 'İletişim formu, adres bilgileri ve harita içeren düzen',
                      img: '📞'
                    },
                    {
                      title: 'SSS Sayfası',
                      description: 'Akordiyon şeklinde sık sorulan sorular düzeni',
                      img: '❓'
                    },
                    {
                      title: 'Boş Sayfa',
                      description: 'Tasarımcı tarafından özelleştirilebilecek boş sayfa',
                      img: '✨'
                    }
                  ].map((template, index) => (
                    <Card key={index} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="text-4xl text-center mb-2">{template.img}</div>
                        <CardTitle className="text-center">{template.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-center text-gray-600">
                        {template.description}
                      </CardContent>
                      <CardFooter className="flex justify-center pb-4">
                        <Button variant="outline" size="sm">Bu Şablonu Kullan</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Kullanıcı Düzenleme/Ekleme Modal */}
      <Dialog open={openUserDialog} onOpenChange={setOpenUserDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingUser ? 'Kullanıcıyı Düzenle' : 'Yeni Kullanıcı Ekle'}
            </DialogTitle>
            <DialogDescription>
              {editingUser 
                ? `${editingUser.username} kullanıcısının bilgilerini düzenliyorsunuz.` 
                : 'Sisteme yeni bir kullanıcı eklemek için formu doldurun.'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="username">Kullanıcı Adı</Label>
              <Input
                id="username"
                name="username"
                value={userFormData.username}
                onChange={handleUserInputChange}
                placeholder="kullaniciadi"
                disabled={!!editingUser}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={userFormData.email}
                onChange={handleUserInputChange}
                placeholder="kullanici@ornek.com"
                disabled={!!editingUser}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fullName">Ad Soyad</Label>
              <Input
                id="fullName"
                name="fullName"
                value={userFormData.fullName}
                onChange={handleUserInputChange}
                placeholder="Ad Soyad"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Rol</Label>
              <select
                id="role"
                name="role"
                className="w-full p-2 border rounded-md"
                value={userFormData.role}
                onChange={handleUserInputChange}
              >
                <option value="user">Kullanıcı</option>
                <option value="moderator">Moderatör</option>
                <option value="admin">Yönetici</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subscriptionTier">Abonelik</Label>
              <select
                id="subscriptionTier"
                name="subscriptionTier"
                className="w-full p-2 border rounded-md"
                value={userFormData.subscriptionTier}
                onChange={handleUserInputChange}
              >
                <option value="free">Ücretsiz</option>
                <option value="pro">Pro</option>
                <option value="premium">Premium</option>
              </select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenUserDialog(false)}>
              İptal
            </Button>
            <Button onClick={handleUserSubmit}>
              {editingUser ? 'Kaydet' : 'Kullanıcı Ekle'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}