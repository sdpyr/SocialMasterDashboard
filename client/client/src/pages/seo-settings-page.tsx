import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SeoSettings, insertSeoSettingsSchema } from "@shared/schema";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

// Create a schema for the form
const seoSettingsFormSchema = insertSeoSettingsSchema.partial();
type SeoSettingsFormValues = z.infer<typeof seoSettingsFormSchema>;

export default function SeoSettingsPage() {
  const { toast } = useToast();

  // Fetch SEO settings
  const { data: seoSettings, isLoading } = useQuery<SeoSettings>({
    queryKey: ["/api/seo-settings"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  // Form setup
  const form = useForm<SeoSettingsFormValues>({
    resolver: zodResolver(seoSettingsFormSchema),
    defaultValues: {
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
      ogTitle: "",
      ogDescription: "",
      ogImage: "",
      twitterCard: "summary_large_image",
      twitterTitle: "",
      twitterDescription: "",
      twitterImage: "",
    },
  });

  // Update form values when data is loaded
  useEffect(() => {
    if (seoSettings) {
      form.reset({
        metaTitle: seoSettings.metaTitle || "",
        metaDescription: seoSettings.metaDescription || "",
        metaKeywords: seoSettings.metaKeywords || "",
        ogTitle: seoSettings.ogTitle || "",
        ogDescription: seoSettings.ogDescription || "",
        ogImage: seoSettings.ogImage || "",
        twitterCard: seoSettings.twitterCard || "summary_large_image",
        twitterTitle: seoSettings.twitterTitle || "",
        twitterDescription: seoSettings.twitterDescription || "",
        twitterImage: seoSettings.twitterImage || "",
      });
    }
  }, [seoSettings, form]);

  // Update SEO settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (data: SeoSettingsFormValues) => {
      const res = await apiRequest("PUT", "/api/seo-settings", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/seo-settings"] });
      toast({
        title: "SEO Ayarları Güncellendi",
        description: "SEO ayarları başarıyla kaydedildi.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: `SEO ayarları güncellenirken bir hata oluştu: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Form submission handler
  function onSubmit(data: SeoSettingsFormValues) {
    updateSettingsMutation.mutate(data);
  }

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
          <CardTitle>SEO Ayarları</CardTitle>
          <CardDescription>
            Sitenizin arama motorlarında nasıl görüneceğini optimize edin.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Tabs defaultValue="general">
              <CardContent>
                <TabsList className="mb-6">
                  <TabsTrigger value="general">Genel SEO</TabsTrigger>
                  <TabsTrigger value="opengraph">Open Graph</TabsTrigger>
                  <TabsTrigger value="twitter">Twitter Card</TabsTrigger>
                </TabsList>

                {/* General SEO Settings */}
                <TabsContent value="general" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="metaTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Başlık</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="SocialMasterPanel - Sosyal Medya Yönetim Paneli"
                          />
                        </FormControl>
                        <FormDescription>
                          Arama motoru sonuçlarında gösterilen başlık (60 karakter idealdir).
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="metaDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Açıklama</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Sosyal medya hesaplarınızı tek bir panelden yönetin"
                            rows={3}
                          />
                        </FormControl>
                        <FormDescription>
                          Arama motoru sonuçlarında gösterilen açıklama (160 karakter idealdir).
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="metaKeywords"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Anahtar Kelimeler</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="sosyal medya, yönetim paneli, sosyal medya yönetimi, pazarlama"
                          />
                        </FormControl>
                        <FormDescription>
                          Anahtar kelimeleri virgülle ayırın.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                {/* Open Graph Settings */}
                <TabsContent value="opengraph" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="ogTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>OG Başlık</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="SocialMasterPanel"
                          />
                        </FormControl>
                        <FormDescription>
                          Sosyal medyada paylaşıldığında gösterilen başlık.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ogDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>OG Açıklama</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Sosyal Medya Yönetim Paneli"
                            rows={3}
                          />
                        </FormControl>
                        <FormDescription>
                          Sosyal medyada paylaşıldığında gösterilen açıklama.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ogImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>OG Görsel URL</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="https://example.com/images/og-image.jpg"
                          />
                        </FormControl>
                        <FormDescription>
                          Sosyal medyada paylaşıldığında gösterilen görsel (1200x630 piksel idealdir).
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                {/* Twitter Card Settings */}
                <TabsContent value="twitter" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="twitterCard"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Twitter Kart Tipi</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={field.value}
                            onChange={field.onChange}
                          >
                            <option value="summary">Summary</option>
                            <option value="summary_large_image">Summary Large Image</option>
                            <option value="app">App</option>
                            <option value="player">Player</option>
                          </select>
                        </FormControl>
                        <FormDescription>
                          Twitter'da paylaşıldığında gösterilecek kart türü.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="twitterTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Twitter Başlık</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="SocialMasterPanel"
                          />
                        </FormControl>
                        <FormDescription>
                          Twitter'da paylaşıldığında gösterilen başlık.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="twitterDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Twitter Açıklama</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Sosyal Medya Yönetim Paneli"
                            rows={3}
                          />
                        </FormControl>
                        <FormDescription>
                          Twitter'da paylaşıldığında gösterilen açıklama.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="twitterImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Twitter Görsel URL</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="https://example.com/images/twitter-image.jpg"
                          />
                        </FormControl>
                        <FormDescription>
                          Twitter'da paylaşıldığında gösterilen görsel (1200x675 piksel idealdir).
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </CardContent>
            </Tabs>
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
