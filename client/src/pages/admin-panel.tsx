import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import TabNavigation from '@/components/layout/TabNavigation';
import type { SocialAccount, User } from '@shared/schema';

// OAuth Sosyal Medya Platformları
const supportedPlatforms = [
  { id: 'facebook', name: 'Facebook', color: 'bg-blue-600', textColor: 'text-white', logo: 'facebook.png' },
  { id: 'twitter', name: 'Twitter (X)', color: 'bg-black', textColor: 'text-white', logo: 'twitter.png' },
  { id: 'instagram', name: 'Instagram', color: 'bg-gradient-to-r from-pink-500 to-yellow-500', textColor: 'text-white', logo: 'instagram.png' },
  { id: 'linkedin', name: 'LinkedIn', color: 'bg-blue-700', textColor: 'text-white', logo: 'linkedin.png' },
  { id: 'youtube', name: 'YouTube', color: 'bg-red-600', textColor: 'text-white', logo: 'youtube.png' },
  { id: 'tiktok', name: 'TikTok', color: 'bg-black', textColor: 'text-white', logo: 'tiktok.png' },
  { id: 'pinterest', name: 'Pinterest', color: 'bg-red-700', textColor: 'text-white', logo: 'pinterest.png' },
];

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('users');
  const [isAdmin, setIsAdmin] = useState(true); // Geliştirme aşamasında herkese admin yetkisi verelim
  const queryClient = useQueryClient();

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

  const handleConnectPlatform = (platformId: string) => {
    // Gerçek bir uygulamada, bu burada OAuth akışını başlatır
    // Şu an için basit bir simülasyon yapıyoruz
    window.alert(`${platformId} bağlantısı başlatılıyor... Bu işlem yeni pencere açacaktır.`);
    
    // Gerçek OAuth akışı şöyle olacaktır:
    // 1. Platforma göre bir yönlendirme URL'si oluştur
    // 2. Kullanıcıyı bu URL'ye yönlendir (yeni pencere veya sekme)
    // 3. Kullanıcı platforma giriş yaptıktan sonra, callback URL'yi işle
    // 4. Token'ları alıp kaydet
    
    // Örnek:
    // window.open(`https://oauth.${platformId}.com/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code`, '_blank');
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
        <div className="card p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-10v4m5 4H7a2 2 0 01-2-2V7a2 2 0 012-2h10a2 2 0 012 2v9a2 2 0 01-2 2z" />
          </svg>
          <h2 className="mt-4 text-xl font-medium text-slate-800">Erişim Reddedildi</h2>
          <p className="mt-2 text-slate-500">Bu sayfaya erişmek için yönetici yetkileri gereklidir.</p>
        </div>
      </div>
    );
  }
  
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setUserFormData({
      username: user.username,
      password: "", // Güvenlik için boş bırakıyoruz
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      subscriptionTier: user.subscriptionTier,
    });
    setOpenUserDialog(true);
  };
  
  const handleUserSubmit = async () => {
    try {
      const userData = {
        ...userFormData,
      };
      
      let response;
      
      if (editingUser) {
        // Kullanıcıyı güncelle
        response = await apiRequest(
          "PATCH",
          `/api/users/${editingUser.id}`,
          userData
        );
        toast({
          title: "Kullanıcı Güncellendi",
          description: "Kullanıcı bilgileri başarıyla güncellendi.",
        });
      } else {
        // Yeni kullanıcı ekle
        response = await apiRequest(
          "POST", 
          "/api/users",
          userData
        );
        toast({
          title: "Kullanıcı Eklendi",
          description: "Yeni kullanıcı başarıyla eklendi.",
        });
      }
      
      // Kullanıcıları yeniden yükle
      fetchData();
      setOpenUserDialog(false);
      
    } catch (error) {
      console.error("Kullanıcı işlemi sırasında hata:", error);
      toast({
        title: "İşlem Hatası",
        description: "Kullanıcı işlemi sırasında bir hata oluştu.",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteUser = async (userId: number) => {
    if (window.confirm("Bu kullanıcıyı silmek istediğinizden emin misiniz?")) {
      try {
        await apiRequest("DELETE", `/api/users/${userId}`);
        toast({
          title: "Kullanıcı Silindi",
          description: "Kullanıcı başarıyla silindi.",
        });
        // Kullanıcıları yeniden yükle
        fetchData();
      } catch (error) {
        console.error("Kullanıcı silme sırasında hata:", error);
        toast({
          title: "Silme Hatası",
          description: "Kullanıcı silinirken bir hata oluştu.",
          variant: "destructive",
        });
      }
    }
  };

  // Admin değilse erişimi engelle
  if (!isAdmin) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Bu sayfaya erişmek için admin yetkileri gereklidir.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Paneli</h1>
      
      <Tabs defaultValue="subscription-plans">
        <TabsList className="mb-6">
          <TabsTrigger value="subscription-plans">Abonelik Planları</TabsTrigger>
          <TabsTrigger value="users">Kullanıcılar</TabsTrigger>
          <TabsTrigger value="api-keys">AI API Anahtarları</TabsTrigger>
          <TabsTrigger value="social-api-keys">Sosyal Medya API</TabsTrigger>
        </TabsList>
        
        <TabsContent value="subscription-plans">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Abonelik Planları Yönetimi</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchData}
                  disabled={loading}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Yenile
                </Button>
                <Button 
                  size="sm"
                  onClick={handleAddPlan}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Yeni Plan Ekle
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-4">
                  <RefreshCw className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Plan Adı</TableHead>
                      <TableHead>Seviye</TableHead>
                      <TableHead>Fiyat</TableHead>
                      <TableHead>Maks. Hesap</TableHead>
                      <TableHead>Maks. Gönderi</TableHead>
                      <TableHead>Durum</TableHead>
                      <TableHead>İşlemler</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscriptionPlans.map((plan) => (
                      <TableRow key={plan.id}>
                        <TableCell className="font-medium">{plan.name}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            plan.tier === "free" ? "bg-gray-100" : 
                            plan.tier === "premium" ? "bg-blue-100 text-blue-800" : 
                            "bg-purple-100 text-purple-800"
                          }`}>
                            {plan.tier === "free" ? "Ücretsiz" : 
                             plan.tier === "premium" ? "Premium" : "Ultimate"}
                          </span>
                        </TableCell>
                        <TableCell>
                          {plan.price === 0 
                            ? "Ücretsiz" 
                            : `${(plan.price / 100).toFixed(2)} ₺`}
                        </TableCell>
                        <TableCell>
                          {plan.maxAccounts === -1 ? "Sınırsız" : plan.maxAccounts}
                        </TableCell>
                        <TableCell>
                          {plan.maxPosts === -1 ? "Sınırsız" : plan.maxPosts}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            plan.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}>
                            {plan.isActive ? "Aktif" : "Pasif"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditPlan(plan)}
                            >
                              Düzenle
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDeletePlan(plan.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {subscriptionPlans.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          Abonelik planı bulunmamaktadır.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Kullanıcı Yönetimi</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchData}
                  disabled={loading}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Yenile
                </Button>
                <Button 
                  size="sm"
                  onClick={handleAddUser}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Yeni Kullanıcı Ekle
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-4">
                  <RefreshCw className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Kullanıcı Adı</TableHead>
                      <TableHead>E-posta</TableHead>
                      <TableHead>Tam Ad</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Abonelik</TableHead>
                      <TableHead>Kayıt Tarihi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.fullName}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === "admin" ? "bg-red-100 text-red-800" : "bg-gray-100"
                          }`}>
                            {user.role === "admin" ? "Admin" : "Kullanıcı"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.subscriptionTier === "free" ? "bg-gray-100" : 
                            user.subscriptionTier === "premium" ? "bg-blue-100 text-blue-800" : 
                            "bg-purple-100 text-purple-800"
                          }`}>
                            {user.subscriptionTier === "free" ? "Ücretsiz" : 
                             user.subscriptionTier === "premium" ? "Premium" : "Ultimate"}
                          </span>
                        </TableCell>
                        <TableCell>
                          {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                        </TableCell>
                      </TableRow>
                    ))}
                    {users.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          Kayıtlı kullanıcı bulunmamaktadır.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api-keys">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>AI API Anahtarları Yönetimi</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchData}
                  disabled={loading}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Yenile
                </Button>
                <Button 
                  size="sm"
                  onClick={handleAddApiKey}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Yeni API Anahtarı Ekle
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-4">
                  <RefreshCw className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>İsim</TableHead>
                      <TableHead>Servis</TableHead>
                      <TableHead>Anahtar</TableHead>
                      <TableHead>Durum</TableHead>
                      <TableHead>İşlemler</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {apiKeys.map((apiKey) => (
                      <TableRow key={apiKey.id}>
                        <TableCell className="font-medium">{apiKey.name}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            apiKey.service === "gemini" ? "bg-purple-100 text-purple-800" : 
                            apiKey.service === "openai" ? "bg-green-100 text-green-800" : 
                            apiKey.service === "stripe" ? "bg-blue-100 text-blue-800" :
                            "bg-gray-100"
                          }`}>
                            {apiKey.service === "gemini" ? "Gemini AI" : 
                             apiKey.service === "openai" ? "OpenAI" : 
                             apiKey.service === "stripe" ? "Stripe" : 
                             apiKey.service}
                          </span>
                        </TableCell>
                        <TableCell>
                          {apiKey.maskedKey || "••••••••••••••••••"}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            apiKey.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}>
                            {apiKey.isActive ? "Aktif" : "Pasif"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditApiKey(apiKey)}
                            >
                              Düzenle
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDeleteApiKey(apiKey.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {apiKeys.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          API anahtarı bulunmamaktadır.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="social-api-keys">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Sosyal Medya API Anahtarları</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchData}
                  disabled={loading}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Yenile
                </Button>
                <Button 
                  size="sm"
                  onClick={() => handleAddSocialApiKey()}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Yeni Sosyal API Ekle
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-4">
                  <RefreshCw className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Platform</TableHead>
                      <TableHead>API Anahtarı</TableHead>
                      <TableHead>API Sırrı</TableHead>
                      <TableHead>Durum</TableHead>
                      <TableHead>İşlemler</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {socialApiKeys && socialApiKeys.length > 0 ? (
                      socialApiKeys.map((apiKey) => (
                        <TableRow key={apiKey.id}>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              apiKey.platform === "instagram" ? "bg-pink-100 text-pink-800" : 
                              apiKey.platform === "facebook" ? "bg-blue-100 text-blue-800" : 
                              apiKey.platform === "twitter" ? "bg-sky-100 text-sky-800" :
                              apiKey.platform === "youtube" ? "bg-red-100 text-red-800" :
                              apiKey.platform === "tiktok" ? "bg-black text-white" :
                              apiKey.platform === "linkedin" ? "bg-blue-900 text-white" :
                              "bg-gray-100"
                            }`}>
                              {apiKey.platform === "instagram" ? "Instagram" : 
                               apiKey.platform === "facebook" ? "Facebook" : 
                               apiKey.platform === "twitter" ? "Twitter" : 
                               apiKey.platform === "youtube" ? "YouTube" :
                               apiKey.platform === "tiktok" ? "TikTok" :
                               apiKey.platform === "linkedin" ? "LinkedIn" :
                               apiKey.platform}
                            </span>
                          </TableCell>
                          <TableCell>
                            {apiKey.apiKeyMasked || "••••••••••••••••••"}
                          </TableCell>
                          <TableCell>
                            {apiKey.apiSecretMasked || "••••••••••••••••••"}
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              apiKey.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}>
                              {apiKey.isActive ? "Aktif" : "Pasif"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEditSocialApiKey(apiKey)}
                              >
                                Düzenle
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleDeleteSocialApiKey(apiKey.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          Sosyal medya API anahtarı bulunmamaktadır.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Plan ekleme/düzenleme dialog */}
      {/* Kullanıcı ekleme/düzenleme dialog */}
      <Dialog open={openUserDialog} onOpenChange={setOpenUserDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? "Kullanıcıyı Düzenle" : "Yeni Kullanıcı Ekle"}
            </DialogTitle>
            <DialogDescription>
              {editingUser 
                ? "Kullanıcı bilgilerini güncelleyin." 
                : "Yeni bir kullanıcı oluşturun."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">Kullanıcı Adı</Label>
              <Input 
                id="username" 
                name="username" 
                value={userFormData.username} 
                onChange={handleUserInputChange} 
                className="col-span-3" 
                disabled={!!editingUser}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">Şifre</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                value={userFormData.password} 
                onChange={handleUserInputChange} 
                className="col-span-3" 
                placeholder={editingUser ? "Değişmeyecekse boş bırakın" : "Şifre girin"}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">E-posta</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                value={userFormData.email} 
                onChange={handleUserInputChange} 
                className="col-span-3" 
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fullName" className="text-right">Tam Ad</Label>
              <Input 
                id="fullName" 
                name="fullName" 
                value={userFormData.fullName} 
                onChange={handleUserInputChange} 
                className="col-span-3" 
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">Rol</Label>
              <select 
                id="role" 
                name="role" 
                value={userFormData.role} 
                onChange={handleUserInputChange as any} 
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="user">Kullanıcı</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subscriptionTier" className="text-right">Abonelik</Label>
              <select 
                id="subscriptionTier" 
                name="subscriptionTier" 
                value={userFormData.subscriptionTier} 
                onChange={handleUserInputChange as any} 
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="free">Ücretsiz</option>
                <option value="premium">Premium</option>
                <option value="ultimate">Ultimate</option>
              </select>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setOpenUserDialog(false)}>
              İptal
            </Button>
            <Button type="button" onClick={handleUserSubmit}>
              {editingUser ? "Güncelle" : "Ekle"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Plan ekleme/düzenleme dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingPlan ? "Abonelik Planını Düzenle" : "Yeni Abonelik Planı Ekle"}
            </DialogTitle>
            <DialogDescription>
              {editingPlan 
                ? "Abonelik planının bilgilerini güncelleyin." 
                : "Yeni bir abonelik planı oluşturun."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Plan Adı</Label>
              <Input 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange} 
                className="col-span-3" 
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tier" className="text-right">Seviye</Label>
              <select 
                id="tier" 
                name="tier" 
                value={formData.tier} 
                onChange={handleInputChange as any} 
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="free">Ücretsiz</option>
                <option value="premium">Premium</option>
                <option value="ultimate">Ultimate</option>
              </select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">Fiyat (₺)</Label>
              <Input 
                id="price" 
                name="price" 
                type="number" 
                value={formData.price} 
                onChange={handleInputChange} 
                className="col-span-3" 
              />
              <p className="text-xs text-muted-foreground col-start-2 col-span-3">
                Fiyat kuruş cinsinden saklanır. Örn: 2999 = 29.99₺
              </p>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="maxAccounts" className="text-right">Maks. Hesap</Label>
              <Input 
                id="maxAccounts" 
                name="maxAccounts" 
                type="number" 
                value={formData.maxAccounts} 
                onChange={handleInputChange} 
                className="col-span-3" 
              />
              <p className="text-xs text-muted-foreground col-start-2 col-span-3">
                Sınırsız için -1 değerini giriniz
              </p>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="maxPosts" className="text-right">Maks. Gönderi</Label>
              <Input 
                id="maxPosts" 
                name="maxPosts" 
                type="number" 
                value={formData.maxPosts} 
                onChange={handleInputChange} 
                className="col-span-3" 
              />
              <p className="text-xs text-muted-foreground col-start-2 col-span-3">
                Sınırsız için -1 değerini giriniz
              </p>
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2">Açıklama</Label>
              <Textarea 
                id="description" 
                name="description" 
                value={formData.description} 
                onChange={handleInputChange} 
                className="col-span-3" 
              />
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="features" className="text-right pt-2">Özellikler</Label>
              <Textarea 
                id="features" 
                name="features" 
                value={formData.features} 
                onChange={handleInputChange} 
                className="col-span-3" 
              />
              <p className="text-xs text-muted-foreground col-start-2 col-span-3">
                Virgülle ayrılmış özellikler. Örn: Analitik, Çoklu hesap desteği, Yapay zeka önerileri
              </p>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isActive" className="text-right">Aktif</Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Switch 
                  id="isActive" 
                  name="isActive" 
                  checked={formData.isActive} 
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, isActive: checked }))
                  } 
                />
                <Label htmlFor="isActive" className="cursor-pointer">
                  {formData.isActive ? "Aktif" : "Pasif"}
                </Label>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setOpenDialog(false)}>
              İptal
            </Button>
            <Button type="button" onClick={handleSubmit}>
              {editingPlan ? "Güncelle" : "Ekle"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* API anahtarı ekleme/düzenleme dialog */}
      <Dialog open={openApiKeyDialog} onOpenChange={setOpenApiKeyDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingApiKey ? "API Anahtarını Düzenle" : "Yeni API Anahtarı Ekle"}
            </DialogTitle>
            <DialogDescription>
              {editingApiKey 
                ? "API anahtarının bilgilerini güncelleyin." 
                : "Yeni bir API anahtarı oluşturun."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">İsim</Label>
              <Input 
                id="name" 
                name="name" 
                value={apiKeyFormData.name} 
                onChange={handleApiKeyInputChange} 
                className="col-span-3" 
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="service" className="text-right">Servis</Label>
              <select 
                id="service" 
                name="service" 
                value={apiKeyFormData.service} 
                onChange={handleApiKeyInputChange as any} 
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="gemini">Gemini AI</option>
                <option value="openai">OpenAI</option>
                <option value="stripe">Stripe</option>
                <option value="instagram">Instagram API</option>
                <option value="instagram_secret">Instagram Secret</option>
                <option value="facebook">Facebook API</option>
                <option value="facebook_secret">Facebook Secret</option>
                <option value="twitter">Twitter API</option>
                <option value="twitter_secret">Twitter Secret</option>
                <option value="youtube">YouTube API</option>
                <option value="youtube_secret">YouTube Secret</option>
                <option value="youtube_refresh">YouTube Refresh Token</option>
                <option value="linkedin">LinkedIn API</option>
                <option value="linkedin_secret">LinkedIn Secret</option>
                <option value="tiktok">TikTok API</option>
                <option value="tiktok_secret">TikTok Secret</option>
              </select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="key" className="text-right">API Anahtarı</Label>
              <Input 
                id="key" 
                name="key" 
                type="password" 
                value={apiKeyFormData.key} 
                onChange={handleApiKeyInputChange} 
                className="col-span-3" 
                placeholder={editingApiKey ? "Değişmeyecekse boş bırakın" : "API anahtarını girin"}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isActive" className="text-right">Aktif</Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Switch 
                  id="isActive" 
                  name="isActive" 
                  checked={apiKeyFormData.isActive} 
                  onCheckedChange={(checked) => 
                    setApiKeyFormData(prev => ({ ...prev, isActive: checked }))
                  } 
                />
                <Label htmlFor="isActive" className="cursor-pointer">
                  {apiKeyFormData.isActive ? "Aktif" : "Pasif"}
                </Label>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setOpenApiKeyDialog(false)}>
              İptal
            </Button>
            <Button type="button" onClick={handleApiKeySubmit}>
              {editingApiKey ? "Güncelle" : "Ekle"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Sosyal Medya API Anahtarı Dialogu */}
      <Dialog open={openSocialApiKeyDialog} onOpenChange={setOpenSocialApiKeyDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingSocialApiKey ? "Sosyal Medya API Anahtarını Düzenle" : "Yeni Sosyal Medya API Anahtarı Ekle"}
            </DialogTitle>
            <DialogDescription>
              {editingSocialApiKey 
                ? "Sosyal medya API anahtarı bilgilerini güncelleyin." 
                : "Yeni bir sosyal medya platformu için API anahtarları oluşturun."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="platform" className="text-right">Platform</Label>
              <select 
                id="platform" 
                name="platform" 
                value={socialApiKeyFormData.platform} 
                onChange={handleSocialApiKeyInputChange as any} 
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="twitter">Twitter</option>
                <option value="youtube">YouTube</option>
                <option value="tiktok">TikTok</option>
                <option value="linkedin">LinkedIn</option>
              </select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="apiKey" className="text-right">API Anahtarı</Label>
              <Input 
                id="apiKey" 
                name="apiKey" 
                value={socialApiKeyFormData.apiKey} 
                onChange={handleSocialApiKeyInputChange as any} 
                className="col-span-3" 
                placeholder={editingSocialApiKey ? "Değişmeyecekse boş bırakın" : "API anahtarınızı girin"}
                type="password"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="apiSecret" className="text-right">API Secret</Label>
              <Input 
                id="apiSecret" 
                name="apiSecret" 
                value={socialApiKeyFormData.apiSecret} 
                onChange={handleSocialApiKeyInputChange as any} 
                className="col-span-3" 
                placeholder={editingSocialApiKey ? "Değişmeyecekse boş bırakın" : "API sır anahtarınızı girin"}
                type="password"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="socialIsActive" className="text-right">Aktif</Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Switch 
                  id="socialIsActive" 
                  name="isActive" 
                  checked={socialApiKeyFormData.isActive} 
                  onCheckedChange={(checked) => 
                    setSocialApiKeyFormData(prev => ({ ...prev, isActive: checked }))
                  } 
                />
                <Label htmlFor="socialIsActive" className="cursor-pointer">
                  {socialApiKeyFormData.isActive ? "Aktif" : "Pasif"}
                </Label>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setOpenSocialApiKeyDialog(false)}>
              İptal
            </Button>
            <Button type="button" onClick={handleSocialApiKeySubmit}>
              {editingSocialApiKey ? "Güncelle" : "Ekle"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}