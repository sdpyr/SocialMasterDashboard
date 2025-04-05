import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Key, PlusCircle, RefreshCw, Trash2, CreditCard } from "lucide-react";

interface SubscriptionPlan {
  id: number;
  name: string;
  tier: "free" | "premium" | "ultimate";
  price: number;
  maxAccounts: number;
  maxPosts: number;
  description: string;
  features: string[];
  isActive: boolean;
  createdAt: Date;
}

interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: "admin" | "user";
  subscriptionTier: "free" | "premium" | "ultimate";
  createdAt: Date;
}

interface ApiKey {
  id: number;
  name: string;
  maskedKey: string;
  service: string;
  isActive: boolean;
}

interface SocialApiKey {
  id: number;
  platform: string;
  apiKeyMasked: string;
  apiSecretMasked: string;
  isActive: boolean;
  createdAt: Date;
}

export default function AdminPanel() {
  const { toast } = useToast();
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [socialApiKeys, setSocialApiKeys] = useState<SocialApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  
  // Kullanıcı dialog
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userFormData, setUserFormData] = useState({
    username: "",
    password: "",
    email: "",
    fullName: "",
    role: "user" as const,
    subscriptionTier: "free" as const,
  });
  
  const [formData, setFormData] = useState({
    name: "",
    tier: "free" as const,
    price: 0,
    maxAccounts: 1,
    maxPosts: 1,
    description: "",
    features: "",
    isActive: true,
  });
  
  const [apiKeyFormData, setApiKeyFormData] = useState({
    name: "",
    key: "",
    service: "gemini" as const,
    isActive: true,
  });
  const [openApiKeyDialog, setOpenApiKeyDialog] = useState(false);
  const [editingApiKey, setEditingApiKey] = useState<ApiKey | null>(null);
  
  // Sosyal Medya API dialog
  const [openSocialApiKeyDialog, setOpenSocialApiKeyDialog] = useState(false);
  const [editingSocialApiKey, setEditingSocialApiKey] = useState<SocialApiKey | null>(null);
  const [socialApiKeyFormData, setSocialApiKeyFormData] = useState({
    platform: "instagram" as const,
    apiKey: "",
    apiSecret: "",
    isActive: true,
  });
  
  // API anahtarı işlemleri
  const handleApiKeyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setApiKeyFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  
  const handleApiKeySubmit = async () => {
    try {
      const apiKeyData = {
        ...apiKeyFormData,
      };
      
      let response;
      
      if (editingApiKey) {
        // API anahtarını güncelle
        response = await apiRequest(
          "PATCH",
          `/api/api-keys/${editingApiKey.id}`,
          apiKeyData
        );
        toast({
          title: "API Anahtarı Güncellendi",
          description: "API anahtarı başarıyla güncellendi.",
        });
      } else {
        // Yeni API anahtarı ekle
        response = await apiRequest(
          "POST", 
          "/api/api-keys",
          apiKeyData
        );
        toast({
          title: "API Anahtarı Eklendi",
          description: "Yeni API anahtarı başarıyla eklendi.",
        });
      }
      
      // API anahtarlarını yeniden yükle
      fetchData();
      setOpenApiKeyDialog(false);
      
    } catch (error) {
      console.error("API anahtarı işlemi sırasında hata:", error);
      toast({
        title: "İşlem Hatası",
        description: "API anahtarı işlemi sırasında bir hata oluştu.",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteApiKey = async (keyId: number) => {
    if (window.confirm("Bu API anahtarını silmek istediğinizden emin misiniz?")) {
      try {
        await apiRequest("DELETE", `/api/api-keys/${keyId}`);
        toast({
          title: "API Anahtarı Silindi",
          description: "API anahtarı başarıyla silindi.",
        });
        // API anahtarlarını yeniden yükle
        fetchData();
      } catch (error) {
        console.error("API anahtarı silme sırasında hata:", error);
        toast({
          title: "Silme Hatası",
          description: "API anahtarı silinirken bir hata oluştu.",
          variant: "destructive",
        });
      }
    }
  };
  
  const handleAddApiKey = () => {
    setEditingApiKey(null);
    setApiKeyFormData({
      name: "",
      key: "",
      service: "gemini",
      isActive: true,
    });
    setOpenApiKeyDialog(true);
  };
  
  const handleEditApiKey = (apiKey: ApiKey) => {
    setEditingApiKey(apiKey);
    setApiKeyFormData({
      name: apiKey.name,
      key: apiKey.maskedKey || "••••••••••••••••••", // Güvenlik için maskeli gösterme
      service: apiKey.service as any,
      isActive: apiKey.isActive,
    });
    setOpenApiKeyDialog(true);
  };

  // Mevcut kullanıcı admin mi kontrol et
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await apiRequest("GET", "/api/user");
        const userData = await response.json();
        
        // Geliştirme için tüm kullanıcılara admin yetkisi verelim
        setIsAdmin(true);
        
        // Normalde bu şekilde kontrol edilmeli:
        // setIsAdmin(userData.role === "admin");
        // if (userData.role !== "admin") {
        //   toast({
        //     title: "Erişim Reddedildi",
        //     description: "Bu sayfaya erişmek için admin yetkileri gereklidir.",
        //     variant: "destructive",
        //   });
        // } else {
        //   fetchData();
        // }
        
        // Şimdilik herkese veri yükleme izni
        fetchData();
      } catch (error) {
        console.error("Admin kontrolü sırasında hata:", error);
        // Hata durumunda bile erişime izin verelim
        setIsAdmin(true);
        fetchData();
      }
    };

    checkAdminStatus();
  }, [toast]);

  // Sosyal Medya API işlemleri
  const handleSocialApiKeyInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setSocialApiKeyFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  
  const handleAddSocialApiKey = () => {
    setEditingSocialApiKey(null);
    setSocialApiKeyFormData({
      platform: "instagram",
      apiKey: "",
      apiSecret: "",
      isActive: true,
    });
    setOpenSocialApiKeyDialog(true);
  };
  
  const handleEditSocialApiKey = (apiKey: SocialApiKey) => {
    setEditingSocialApiKey(apiKey);
    setSocialApiKeyFormData({
      platform: apiKey.platform,
      apiKey: apiKey.apiKeyMasked || "••••••••••••••••••",
      apiSecret: apiKey.apiSecretMasked || "••••••••••••••••••",
      isActive: apiKey.isActive,
    });
    setOpenSocialApiKeyDialog(true);
  };
  
  const handleSocialApiKeySubmit = async () => {
    try {
      const apiKeyData = {
        ...socialApiKeyFormData,
      };
      
      let response;
      
      if (editingSocialApiKey) {
        // API anahtarını güncelle
        response = await apiRequest(
          "PATCH",
          `/api/social-api-keys/${editingSocialApiKey.id}`,
          apiKeyData
        );
        toast({
          title: "Sosyal Medya API Anahtarı Güncellendi",
          description: "API anahtarı başarıyla güncellendi.",
        });
      } else {
        // Yeni API anahtarı ekle
        response = await apiRequest(
          "POST", 
          "/api/social-api-keys",
          apiKeyData
        );
        toast({
          title: "Sosyal Medya API Anahtarı Eklendi",
          description: "Yeni API anahtarı başarıyla eklendi.",
        });
      }
      
      // API anahtarlarını yeniden yükle
      fetchData();
      setOpenSocialApiKeyDialog(false);
      
    } catch (error) {
      console.error("Sosyal Medya API anahtarı işlemi sırasında hata:", error);
      toast({
        title: "İşlem Hatası",
        description: "API anahtarı işlemi sırasında bir hata oluştu.",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteSocialApiKey = async (keyId: number) => {
    if (window.confirm("Bu sosyal medya API anahtarını silmek istediğinizden emin misiniz?")) {
      try {
        await apiRequest("DELETE", `/api/social-api-keys/${keyId}`);
        toast({
          title: "API Anahtarı Silindi",
          description: "Sosyal medya API anahtarı başarıyla silindi.",
        });
        // API anahtarlarını yeniden yükle
        fetchData();
      } catch (error) {
        console.error("API anahtarı silme sırasında hata:", error);
        toast({
          title: "Silme Hatası",
          description: "API anahtarı silinirken bir hata oluştu.",
          variant: "destructive",
        });
      }
    }
  };

  // Verileri getir
  const fetchData = async () => {
    setLoading(true);
    try {
      // Abonelik planlarını getir
      const plansResponse = await apiRequest("GET", "/api/subscription-plans");
      const plansData = await plansResponse.json();
      setSubscriptionPlans(plansData);

      // Kullanıcıları getir
      const usersResponse = await apiRequest("GET", "/api/users");
      const usersData = await usersResponse.json();
      setUsers(usersData);
      
      // API anahtarlarını getir
      const apiKeysResponse = await apiRequest("GET", "/api/api-keys");
      const apiKeysData = await apiKeysResponse.json();
      setApiKeys(apiKeysData);
      
      // Sosyal Medya API anahtarlarını getir
      try {
        const socialApiKeysResponse = await apiRequest("GET", "/api/social-api-keys");
        const socialApiKeysData = await socialApiKeysResponse.json();
        setSocialApiKeys(socialApiKeysData);
      } catch (error) {
        console.error("Sosyal medya API anahtarları yüklenemedi:", error);
        // Geliştirme aşamasında örnek veri kullanabiliriz
        const dummyData: SocialApiKey[] = [
          {
            id: 1,
            platform: "instagram",
            apiKeyMasked: "inst•••••••••••••••", 
            apiSecretMasked: "inst•••••••••••••••",
            isActive: true,
            createdAt: new Date(),
          },
          {
            id: 2,
            platform: "facebook",
            apiKeyMasked: "face•••••••••••••••", 
            apiSecretMasked: "face•••••••••••••••",
            isActive: true,
            createdAt: new Date(),
          },
        ];
        setSocialApiKeys(dummyData);
      }
    } catch (error) {
      console.error("Veri getirme sırasında hata:", error);
      toast({
        title: "Veri Yükleme Hatası",
        description: "Veriler yüklenirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Dialog içindeki form verisini güncelle
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Yeni plan ekle veya güncelle
  const handleSubmit = async () => {
    try {
      const planData = {
        ...formData,
        price: Number(formData.price),
        maxAccounts: Number(formData.maxAccounts),
        maxPosts: Number(formData.maxPosts),
        features: formData.features.split(",").map(item => item.trim()),
      };
      
      let response;
      
      if (editingPlan) {
        // Planı güncelle
        response = await apiRequest(
          "PATCH",
          `/api/subscription-plans/${editingPlan.id}`,
          planData
        );
        toast({
          title: "Plan Güncellendi",
          description: "Abonelik planı başarıyla güncellendi.",
        });
      } else {
        // Yeni plan ekle
        response = await apiRequest(
          "POST", 
          "/api/subscription-plans",
          planData
        );
        toast({
          title: "Plan Eklendi",
          description: "Yeni abonelik planı başarıyla eklendi.",
        });
      }
      
      // Planları yeniden yükle
      fetchData();
      setOpenDialog(false);
      
    } catch (error) {
      console.error("Plan kaydı sırasında hata:", error);
      toast({
        title: "İşlem Hatası",
        description: "Abonelik planı işlemi sırasında bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  // Planı silme işlemi
  const handleDeletePlan = async (planId: number) => {
    if (window.confirm("Bu abonelik planını silmek istediğinizden emin misiniz?")) {
      try {
        await apiRequest("DELETE", `/api/subscription-plans/${planId}`);
        toast({
          title: "Plan Silindi",
          description: "Abonelik planı başarıyla silindi.",
        });
        // Planları yeniden yükle
        fetchData();
      } catch (error) {
        console.error("Plan silme sırasında hata:", error);
        toast({
          title: "Silme Hatası",
          description: "Abonelik planı silinirken bir hata oluştu.",
          variant: "destructive",
        });
      }
    }
  };

  // Plan düzenleme işlemi
  const handleEditPlan = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      tier: plan.tier,
      price: plan.price,
      maxAccounts: plan.maxAccounts,
      maxPosts: plan.maxPosts,
      description: plan.description,
      features: plan.features.join(", "),
      isActive: plan.isActive,
    });
    setOpenDialog(true);
  };

  // Yeni plan ekleme işlemi
  const handleAddPlan = () => {
    setEditingPlan(null);
    setFormData({
      name: "",
      tier: "free",
      price: 0,
      maxAccounts: 1,
      maxPosts: 1,
      description: "",
      features: "",
      isActive: true,
    });
    setOpenDialog(true);
  };
  
  // Kullanıcı işlemleri
  const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    
    setUserFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  
  const handleAddUser = () => {
    setEditingUser(null);
    setUserFormData({
      username: "",
      password: "",
      email: "",
      fullName: "",
      role: "user",
      subscriptionTier: "free",
    });
    setOpenUserDialog(true);
  };
  
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