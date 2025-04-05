import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { SiteSettings, Template } from "@shared/schema";
import { apiRequest, queryClient, getQueryFn } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/dashboard/layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Loader2, Check, Palette, Moon, Sun, Monitor } from "lucide-react";

// Define color themes
const colorThemes = [
  { id: "blue", name: "Mavi", color: "#3f51b5" },
  { id: "green", name: "Yeşil", color: "#4caf50" },
  { id: "red", name: "Kırmızı", color: "#f44336" },
  { id: "purple", name: "Mor", color: "#9c27b0" },
  { id: "orange", name: "Turuncu", color: "#ff9800" },
  { id: "teal", name: "Turkuaz", color: "#009688" },
];

// Define UI themes
const uiThemes = [
  { id: "flat", name: "Flat 2.0", description: "Düz renk ve köşeli tasarım" },
  { id: "minimal", name: "Minimal", description: "Sade ve basit tasarım" },
  { id: "grid", name: "Grid", description: "Izgara tabanlı düzen" },
  { id: "glass", name: "Glassmorphism", description: "Cam efekti tasarım" },
  { id: "neomorphism", name: "Neomorphism", description: "Yumuşak gölgeli tasarım" },
];

// Define appearance types
interface AppearanceSettings {
  colorTheme: string;
  uiTheme: string;
  darkMode: "light" | "dark" | "system";
  customColor?: string;
  borderRadius: string;
  sidebarCollapsed: boolean;
  animationsEnabled: boolean;
  fontFamily: string;
}

// Color Theme Selector component
const ColorThemeSelector = ({
  value,
  onChange,
  customColor,
  onCustomColorChange,
}: {
  value: string;
  onChange: (value: string) => void;
  customColor: string;
  onCustomColorChange: (value: string) => void;
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {colorThemes.map((theme) => (
          <Button
            key={theme.id}
            type="button"
            variant="outline"
            className={`h-12 ${value === theme.id ? 'ring-2 ring-primary' : ''}`}
            style={{ backgroundColor: theme.color }}
            onClick={() => onChange(theme.id)}
          >
            {value === theme.id && (
              <Check className="h-4 w-4 text-white" />
            )}
            <span className="sr-only">{theme.name}</span>
          </Button>
        ))}
      </div>
      
      <div className="flex space-x-2 items-center">
        <Button
          type="button"
          variant="outline"
          className={`h-12 w-12 ${value === 'custom' ? 'ring-2 ring-primary' : ''}`}
          style={{ backgroundColor: customColor }}
          onClick={() => onChange('custom')}
        >
          {value === 'custom' && (
            <Check className="h-4 w-4 text-white" />
          )}
          <span className="sr-only">Özel Renk</span>
        </Button>
        <Input
          type="color"
          value={customColor}
          onChange={(e) => {
            onCustomColorChange(e.target.value);
            if (value !== 'custom') {
              onChange('custom');
            }
          }}
          className="w-12 h-10 p-1"
        />
        <span className="ml-2 text-sm">Özel Renk</span>
      </div>
    </div>
  );
};

export default function AppearancePage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("colors");
  const [settings, setSettings] = useState<AppearanceSettings>({
    colorTheme: "blue",
    uiTheme: "flat",
    darkMode: "light",
    customColor: "#ff5722",
    borderRadius: "medium",
    sidebarCollapsed: false,
    animationsEnabled: true,
    fontFamily: "Inter",
  });
  const [isChanged, setIsChanged] = useState(false);

  // Fetch site settings
  const { data: siteSettings, isLoading: isLoadingSiteSettings } = useQuery<SiteSettings>({
    queryKey: ["/api/site-settings"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  // Fetch templates
  const { data: templates = [], isLoading: isLoadingTemplates } = useQuery<Template[]>({
    queryKey: ["/api/templates"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  // Initialize settings from site settings
  useEffect(() => {
    if (siteSettings) {
      // In a real application, appearance settings would be part of site settings
      // For now, we'll use default values
      setSettings({
        colorTheme: "blue",
        uiTheme: "flat",
        darkMode: "light",
        customColor: "#ff5722",
        borderRadius: "medium",
        sidebarCollapsed: false,
        animationsEnabled: true,
        fontFamily: "Inter",
      });
    }
  }, [siteSettings]);

  // Save appearance settings
  const saveAppearanceMutation = useMutation({
    mutationFn: async (data: AppearanceSettings) => {
      // In a real application, you would save to API
      // For now, simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return data;
    },
    onSuccess: () => {
      setIsChanged(false);
      toast({
        title: "Görünüm Ayarları Kaydedildi",
        description: "Değişiklikler başarıyla kaydedildi.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: `Ayarlar kaydedilirken bir hata oluştu: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Handle setting changes
  const handleSettingChange = <K extends keyof AppearanceSettings>(
    key: K,
    value: AppearanceSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setIsChanged(true);
  };

  // Handle save
  const handleSave = () => {
    saveAppearanceMutation.mutate(settings);
  };

  // Active template
  const activeTemplate = templates.find(t => t.isActive);

  if (isLoadingSiteSettings || isLoadingTemplates) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Card>
        <CardHeader>
          <CardTitle>Görünüm Ayarları</CardTitle>
          <CardDescription>
            Site görünümünüzü özelleştirin ve şablonunuzu yapılandırın.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="colors">Renkler & Tema</TabsTrigger>
              <TabsTrigger value="layout">Düzen & Arayüz</TabsTrigger>
              <TabsTrigger value="typography">Tipografi</TabsTrigger>
            </TabsList>

            {/* Colors & Theme Tab */}
            <TabsContent value="colors" className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Renk Şeması</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Sitenizin ana rengini seçerek arayüzün renk şemasını değiştirin.
                </p>
                
                <ColorThemeSelector
                  value={settings.colorTheme}
                  onChange={(value) => handleSettingChange("colorTheme", value)}
                  customColor={settings.customColor || "#ff5722"}
                  onCustomColorChange={(value) => handleSettingChange("customColor", value)}
                />
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-4">Görünüm Modu</h3>
                <RadioGroup
                  value={settings.darkMode}
                  onValueChange={(value: "light" | "dark" | "system") => 
                    handleSettingChange("darkMode", value)
                  }
                  className="grid grid-cols-3 gap-4"
                >
                  <div>
                    <RadioGroupItem value="light" id="light" className="sr-only" />
                    <Label
                      htmlFor="light"
                      className={`flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground ${
                        settings.darkMode === "light" ? "border-primary" : ""
                      }`}
                    >
                      <Sun className="mb-2 h-6 w-6" />
                      <span className="text-center">Açık Mod</span>
                    </Label>
                  </div>
                  
                  <div>
                    <RadioGroupItem value="dark" id="dark" className="sr-only" />
                    <Label
                      htmlFor="dark"
                      className={`flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground ${
                        settings.darkMode === "dark" ? "border-primary" : ""
                      }`}
                    >
                      <Moon className="mb-2 h-6 w-6" />
                      <span className="text-center">Koyu Mod</span>
                    </Label>
                  </div>
                  
                  <div>
                    <RadioGroupItem value="system" id="system" className="sr-only" />
                    <Label
                      htmlFor="system"
                      className={`flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground ${
                        settings.darkMode === "system" ? "border-primary" : ""
                      }`}
                    >
                      <Monitor className="mb-2 h-6 w-6" />
                      <span className="text-center">Sistem</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-4">Şablon</h3>
                <div className="rounded-md border mb-4">
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{activeTemplate?.name || "Varsayılan Şablon"}</h4>
                      <p className="text-sm text-muted-foreground">
                        {activeTemplate?.description || "Şu anda aktif olan şablon"}
                      </p>
                    </div>
                    <Button variant="outline" onClick={() => window.location.href = "/templates"}>
                      <Palette className="mr-2 h-4 w-4" />
                      Şablonları Yönet
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Köşe Yuvarlaklığı</h4>
                  <RadioGroup
                    value={settings.borderRadius}
                    onValueChange={(value) => handleSettingChange("borderRadius", value)}
                    className="grid grid-cols-3 gap-4"
                  >
                    <div>
                      <RadioGroupItem value="none" id="none" className="sr-only" />
                      <Label
                        htmlFor="none"
                        className={`flex items-center justify-center rounded-none border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground ${
                          settings.borderRadius === "none" ? "border-primary" : ""
                        }`}
                      >
                        Hiç
                      </Label>
                    </div>
                    
                    <div>
                      <RadioGroupItem value="medium" id="medium" className="sr-only" />
                      <Label
                        htmlFor="medium"
                        className={`flex items-center justify-center rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground ${
                          settings.borderRadius === "medium" ? "border-primary" : ""
                        }`}
                      >
                        Orta
                      </Label>
                    </div>
                    
                    <div>
                      <RadioGroupItem value="large" id="large" className="sr-only" />
                      <Label
                        htmlFor="large"
                        className={`flex items-center justify-center rounded-xl border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground ${
                          settings.borderRadius === "large" ? "border-primary" : ""
                        }`}
                      >
                        Büyük
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </TabsContent>

            {/* Layout & Interface Tab */}
            <TabsContent value="layout" className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Kullanıcı Arayüzü Teması</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {uiThemes.map((theme) => (
                    <div key={theme.id}>
                      <RadioGroupItem 
                        value={theme.id} 
                        id={theme.id} 
                        className="sr-only" 
                        checked={settings.uiTheme === theme.id}
                        onClick={() => handleSettingChange("uiTheme", theme.id)}
                      />
                      <Label
                        htmlFor={theme.id}
                        className={`flex flex-col h-full rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground ${
                          settings.uiTheme === theme.id ? "border-primary" : ""
                        }`}
                      >
                        <div className="font-medium mb-1">{theme.name}</div>
                        <div className="text-sm text-muted-foreground">{theme.description}</div>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-4">Arayüz Seçenekleri</h3>
                <Accordion type="multiple" className="w-full">
                  <AccordionItem value="sidebar">
                    <AccordionTrigger>Kenar Çubuğu</AccordionTrigger>
                    <AccordionContent>
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <h4 className="font-medium">Varsayılan olarak daraltılmış kenar çubuğu</h4>
                          <p className="text-sm text-muted-foreground">
                            Sayfa yüklendiğinde kenar çubuğunu daraltılmış olarak göster
                          </p>
                        </div>
                        <Switch
                          checked={settings.sidebarCollapsed}
                          onCheckedChange={(checked) => 
                            handleSettingChange("sidebarCollapsed", checked)
                          }
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="animations">
                    <AccordionTrigger>Animasyonlar</AccordionTrigger>
                    <AccordionContent>
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <h4 className="font-medium">Animasyonları etkinleştir</h4>
                          <p className="text-sm text-muted-foreground">
                            Arayüz geçişlerinde animasyonları etkinleştir/devre dışı bırak
                          </p>
                        </div>
                        <Switch
                          checked={settings.animationsEnabled}
                          onCheckedChange={(checked) => 
                            handleSettingChange("animationsEnabled", checked)
                          }
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </TabsContent>

            {/* Typography Tab */}
            <TabsContent value="typography" className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Yazı Tipi</h3>
                <RadioGroup
                  value={settings.fontFamily}
                  onValueChange={(value) => handleSettingChange("fontFamily", value)}
                  className="grid grid-cols-1 gap-4"
                >
                  <div>
                    <RadioGroupItem value="Inter" id="Inter" className="sr-only" />
                    <Label
                      htmlFor="Inter"
                      className={`flex items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground ${
                        settings.fontFamily === "Inter" ? "border-primary" : ""
                      }`}
                    >
                      <div className="font-['Inter']">
                        <span className="text-lg font-medium">Inter</span>
                        <p className="text-sm text-muted-foreground">Modern, temiz ve okunaklı bir yazı tipi</p>
                      </div>
                      <span className="font-['Inter'] text-2xl">Aa</span>
                    </Label>
                  </div>
                  
                  <div>
                    <RadioGroupItem value="Roboto" id="Roboto" className="sr-only" />
                    <Label
                      htmlFor="Roboto"
                      className={`flex items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground ${
                        settings.fontFamily === "Roboto" ? "border-primary" : ""
                      }`}
                    >
                      <div className="font-['Roboto']">
                        <span className="text-lg font-medium">Roboto</span>
                        <p className="text-sm text-muted-foreground">Google'ın yaygın kullanılan yazı tipi</p>
                      </div>
                      <span className="font-['Roboto'] text-2xl">Aa</span>
                    </Label>
                  </div>
                  
                  <div>
                    <RadioGroupItem value="OpenSans" id="OpenSans" className="sr-only" />
                    <Label
                      htmlFor="OpenSans"
                      className={`flex items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground ${
                        settings.fontFamily === "OpenSans" ? "border-primary" : ""
                      }`}
                    >
                      <div className="font-['Open_Sans']">
                        <span className="text-lg font-medium">Open Sans</span>
                        <p className="text-sm text-muted-foreground">Arkadaş canlısı ve okunması kolay bir yazı tipi</p>
                      </div>
                      <span className="font-['Open_Sans'] text-2xl">Aa</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="justify-between border-t p-6">
          <div className="text-sm text-muted-foreground">
            Değişikliklerinizi kaydetmek için "Kaydet" düğmesine tıklayın.
          </div>
          <Button 
            onClick={handleSave} 
            disabled={!isChanged || saveAppearanceMutation.isPending}
          >
            {saveAppearanceMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Değişiklikleri Kaydet
          </Button>
        </CardFooter>
      </Card>
    </DashboardLayout>
  );
}
