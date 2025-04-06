import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import LanguageItem from "@/components/ui/language-item";
import DashboardLayout from "../components/layout/DashboardLayout";
import { apiRequest } from "@/lib/queryClient";

// Define language form schema
const languageFormSchema = z.object({
  name: z.string().min(2, { message: "Dil adı en az 2 karakter olmalıdır" }),
  code: z.string().min(2, { message: "Dil kodu en az 2 karakter olmalıdır" }),
  flagUrl: z.string().url({ message: "Geçerli bir URL olmalıdır" }).nullable(),
  isActive: z.boolean().default(true),
  isDefault: z.boolean().default(false),
  translationProgress: z.number().min(0).max(100).default(0),
});

type LanguageFormValues = z.infer<typeof languageFormSchema>;

type Language = {
  id: number;
  name: string;
  code: string;
  flagUrl: string | null;
  isActive: boolean;
  isDefault: boolean;
  translationProgress: number;
};

export default function LanguageSettingsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<Language | null>(null);

  // Define form
  const form = useForm<LanguageFormValues>({
    resolver: zodResolver(languageFormSchema),
    defaultValues: {
      name: "",
      code: "",
      flagUrl: "",
      isActive: true,
      isDefault: false,
      translationProgress: 0,
    },
  });

  // Reset form when dialog opens/closes or editing status changes
  useEffect(() => {
    if (open && isEditing && currentLanguage) {
      form.reset({
        name: currentLanguage.name,
        code: currentLanguage.code,
        flagUrl: currentLanguage.flagUrl || "",
        isActive: currentLanguage.isActive,
        isDefault: currentLanguage.isDefault,
        translationProgress: currentLanguage.translationProgress,
      });
    } else if (open && !isEditing) {
      form.reset({
        name: "",
        code: "",
        flagUrl: "",
        isActive: true,
        isDefault: false,
        translationProgress: 0,
      });
    }
  }, [open, isEditing, currentLanguage, form]);

  // Fetch languages
  const { data: languages, isLoading, error } = useQuery({
    queryKey: ["/api/languages"],
    retry: 1,
  });

  // Create language mutation
  const createLanguageMutation = useMutation({
    mutationFn: async (data: LanguageFormValues) => {
      return await apiRequest("/api/languages", {
        method: "POST",
        data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/languages"] });
      toast({
        title: "Başarılı!",
        description: "Yeni dil başarıyla eklendi.",
      });
      setOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Hata!",
        description: `Dil eklenemedi: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Update language mutation
  const updateLanguageMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: LanguageFormValues }) => {
      return await apiRequest(`/api/languages/${id}`, {
        method: "PUT",
        data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/languages"] });
      toast({
        title: "Başarılı!",
        description: "Dil başarıyla güncellendi.",
      });
      setOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Hata!",
        description: `Dil güncellenemedi: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Toggle active status mutation
  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      return await apiRequest(`/api/languages/${id}`, {
        method: "PUT",
        data: { isActive },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/languages"] });
      toast({
        title: "Başarılı!",
        description: "Dil durumu güncellendi.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Hata!",
        description: `Durum güncellenemedi: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Make default mutation
  const makeDefaultMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/languages/${id}`, {
        method: "PUT",
        data: { isDefault: true },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/languages"] });
      toast({
        title: "Başarılı!",
        description: "Varsayılan dil güncellendi.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Hata!",
        description: `Varsayılan dil güncellenemedi: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Form submit handler
  function onSubmit(data: LanguageFormValues) {
    if (isEditing && currentLanguage) {
      updateLanguageMutation.mutate({
        id: currentLanguage.id,
        data,
      });
    } else {
      createLanguageMutation.mutate(data);
    }
  }

  // Edit language handler
  function handleEdit(language: Language) {
    setIsEditing(true);
    setCurrentLanguage(language);
    setOpen(true);
  }

  // Add new language handler
  function handleAddNew() {
    setIsEditing(false);
    setCurrentLanguage(null);
    setOpen(true);
  }

  // Toggle active status handler
  function handleToggleActive(id: number, isActive: boolean) {
    toggleActiveMutation.mutate({ id, isActive });
  }

  // Make default handler
  function handleMakeDefault(id: number) {
    makeDefaultMutation.mutate(id);
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/settings">Ayarlar</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Dil Ayarları</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h1 className="text-3xl font-bold mt-2">Dil Ayarları</h1>
            <p className="text-muted-foreground">Sistem dillerini yönetin ve çevirileri güncelleyin.</p>
          </div>
          <Button onClick={handleAddNew}>Yeni Dil Ekle</Button>
        </div>

        <Separator className="my-6" />

        <Card>
          <CardHeader>
            <CardTitle>Diller</CardTitle>
            <CardDescription>
              Sistemde kullanılabilir tüm dilleri görüntüleyin, düzenleyin ve yönetin.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : error ? (
              <div className="bg-destructive/10 p-4 rounded-md text-destructive">
                Diller yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.
              </div>
            ) : (
              <ul className="divide-y">
                {languages && Array.isArray(languages) && languages.length > 0 ? (
                  languages.map((language: Language) => (
                    <LanguageItem
                      key={language.id}
                      language={language}
                      isDefault={language.isDefault}
                      onToggleActive={handleToggleActive}
                      onEdit={handleEdit}
                      onMakeDefault={handleMakeDefault}
                    />
                  ))
                ) : (
                  <li className="py-8 text-center text-muted-foreground">
                    Henüz dil eklenmemiş. "Yeni Dil Ekle" butonuna tıklayarak ilk dili ekleyin.
                  </li>
                )}
              </ul>
            )}
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <p className="text-xs text-muted-foreground">
              Not: Varsayılan dil silinemez veya devre dışı bırakılamaz. Çeviri ilerleme durumu çevrilen metin miktarına bağlı olarak otomatik hesaplanır.
            </p>
          </CardFooter>
        </Card>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEditing ? "Dil Düzenle" : "Yeni Dil Ekle"}</DialogTitle>
              <DialogDescription>
                {isEditing
                  ? "Mevcut dil bilgilerini düzenleyin."
                  : "Sisteme yeni bir dil ekleyin. Dil kodu ve bayrak URL'si doğru olmalıdır."}
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dil Adı</FormLabel>
                      <FormControl>
                        <Input placeholder="Türkçe" {...field} />
                      </FormControl>
                      <FormDescription>
                        Dilin tam adını girin (örn. Türkçe, English, Español).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dil Kodu</FormLabel>
                      <FormControl>
                        <Input placeholder="tr" {...field} />
                      </FormControl>
                      <FormDescription>
                        ISO dil kodunu girin (örn. tr, en, es).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="flagUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bayrak URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://flagcdn.com/tr.svg"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription>
                        Dil bayrağının URL'sini girin (isteğe bağlı).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="translationProgress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Çeviri İlerlemesi (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>
                        Çeviri tamamlanma yüzdesini girin (0-100).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col gap-4">
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Aktif</FormLabel>
                          <FormDescription>
                            Bu dil kullanıcılar tarafından seçilebilir.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isDefault"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Varsayılan Dil</FormLabel>
                          <FormDescription>
                            Bu dil, sistem varsayılan dili olarak ayarlanır.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={
                              isEditing && currentLanguage ? currentLanguage.isDefault : false
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                  >
                    İptal
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      createLanguageMutation.isPending || updateLanguageMutation.isPending
                    }
                  >
                    {(createLanguageMutation.isPending || updateLanguageMutation.isPending) && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {isEditing ? "Güncelle" : "Ekle"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}