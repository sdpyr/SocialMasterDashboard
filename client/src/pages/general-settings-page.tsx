import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SiteSettings, insertSiteSettingsSchema } from "@shared/schema";
import { apiRequest, queryClient, getQueryFn } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/dashboard/layout";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Upload } from "lucide-react";

// Create a schema for the form
const generalSettingsFormSchema = insertSiteSettingsSchema.partial();
type GeneralSettingsFormValues = z.infer<typeof generalSettingsFormSchema>;

export default function GeneralSettingsPage() {
  const { toast } = useToast();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);

  // Fetch site settings
  const { data: siteSettings, isLoading } = useQuery<SiteSettings>({
    queryKey: ["/api/site-settings"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  // Form setup
  const form = useForm<GeneralSettingsFormValues>({
    resolver: zodResolver(generalSettingsFormSchema),
    defaultValues: {
      siteTitle: "",
      siteTagline: "",
      contactEmail: "",
      contactPhone: "",
      contactAddress: "",
      logoUrl: "",
      faviconUrl: "",
      defaultLanguage: "tr",
    },
  });

  // Update form values when data is loaded
  useState(() => {
    if (siteSettings) {
      form.reset({
        siteTitle: siteSettings.siteTitle,
        siteTagline: siteSettings.siteTagline || "",
        contactEmail: siteSettings.contactEmail || "",
        contactPhone: siteSettings.contactPhone || "",
        contactAddress: siteSettings.contactAddress || "",
        logoUrl: siteSettings.logoUrl || "",
        faviconUrl: siteSettings.faviconUrl || "",
        defaultLanguage: siteSettings.defaultLanguage,
      });

      if (siteSettings.logoUrl) {
        setLogoPreview(siteSettings.logoUrl);
      }
      if (siteSettings.faviconUrl) {
        setFaviconPreview(siteSettings.faviconUrl);
      }
    }
  });

  // Update site settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (data: GeneralSettingsFormValues) => {
      const res = await apiRequest("PUT", "/api/site-settings", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/site-settings"] });
      toast({
        title: "Ayarlar Güncellendi",
        description: "Site ayarları başarıyla kaydedildi.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: `Ayarlar güncellenirken bir hata oluştu: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Form submission handler
  function onSubmit(data: GeneralSettingsFormValues) {
    updateSettingsMutation.mutate(data);
  }

  // Handle logo file change (in a real application, this would upload the file to a server)
  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real application, you would upload the file and get a URL
      // For now, create a local preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setLogoPreview(result);
        form.setValue("logoUrl", "uploaded-logo-url.jpg");
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle favicon file change
  const handleFaviconChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real application, you would upload the file and get a URL
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setFaviconPreview(result);
        form.setValue("faviconUrl", "uploaded-favicon-url.ico");
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
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
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Genel Site Bilgileri</CardTitle>
          <CardDescription>
            Sitenizin temel ayarlarını buradan yapılandırabilirsiniz.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              {/* Site Title */}
              <FormField
                control={form.control}
                name="siteTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site Başlığı</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="SocialMasterPanel" />
                    </FormControl>
                    <FormDescription>
                      Sitenizin tarayıcı sekmesinde ve arama sonuçlarında görünen başlık.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Site Tagline */}
              <FormField
                control={form.control}
                name="siteTagline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site Sloganı</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Sosyal Medya Yönetim Çözümü" />
                    </FormControl>
                    <FormDescription>
                      Sitenizi kısaca tanımlayan slogan.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Contact Information */}
              <div>
                <h4 className="text-sm font-medium mb-3">İletişim Bilgileri</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="contactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-posta Adresi</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" placeholder="info@example.com" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefon</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="+90 (212) 123 45 67" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactAddress"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Adres</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="İstanbul, Türkiye"
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Site Logo */}
              <div>
                <FormLabel className="block text-sm font-medium mb-2">Site Logosu</FormLabel>
                <div className="flex items-center space-x-5">
                  <div className="flex-shrink-0 h-16 w-16 bg-muted rounded-md overflow-hidden">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Site logo"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                        Logo
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="relative">
                      <Input
                        type="file"
                        id="logo-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleLogoChange}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("logo-upload")?.click()}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Değiştir
                      </Button>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      PNG, JPG, SVG, GIF. En fazla 2MB.
                    </p>
                  </div>
                </div>
              </div>

              {/* Favicon */}
              <div>
                <FormLabel className="block text-sm font-medium mb-2">Favicon</FormLabel>
                <div className="flex items-center space-x-5">
                  <div className="flex-shrink-0 h-10 w-10 bg-muted rounded-md overflow-hidden">
                    {faviconPreview ? (
                      <img
                        src={faviconPreview}
                        alt="Favicon"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs">
                        Icon
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="relative">
                      <Input
                        type="file"
                        id="favicon-upload"
                        className="hidden"
                        accept="image/x-icon,image/png"
                        onChange={handleFaviconChange}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("favicon-upload")?.click()}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Değiştir
                      </Button>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      ICO, PNG. En fazla 1MB.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/50 justify-end">
              <Button 
                type="submit" 
                disabled={updateSettingsMutation.isPending}
              >
                {updateSettingsMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Değişiklikleri Kaydet
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </DashboardLayout>
  );
}
