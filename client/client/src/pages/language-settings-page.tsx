import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Language, insertLanguageSchema } from "@shared/schema";
import { apiRequest, queryClient, getQueryFn } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/dashboard/layout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LanguageItem from "@/components/ui/language-item";
import { Separator } from "@/components/ui/separator";
import { Loader2, PlusCircle } from "lucide-react";

// Create a schema for the language form
const languageFormSchema = insertLanguageSchema.extend({
  id: z.number().optional(),
}).omit({ isDefault: true });
type LanguageFormValues = z.infer<typeof languageFormSchema>;

export default function LanguageSettingsPage() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLanguage, setEditingLanguage] = useState<Language | null>(null);

  // Fetch languages
  const { data: languages = [], isLoading } = useQuery<Language[]>({
    queryKey: ["/api/languages"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  // Form setup
  const form = useForm<LanguageFormValues>({
    resolver: zodResolver(languageFormSchema),
    defaultValues: {
      name: "",
      code: "",
      flagUrl: "",
      isActive: true,
      translationProgress: 0,
    },
  });

  // Create language mutation
  const createLanguageMutation = useMutation({
    mutationFn: async (data: LanguageFormValues) => {
      const res = await apiRequest("POST", "/api/languages", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/languages"] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Dil Eklendi",
        description: "Yeni dil başarıyla eklendi.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: `Dil eklenirken bir hata oluştu: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Update language mutation
  const updateLanguageMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: LanguageFormValues }) => {
      const res = await apiRequest("PUT", `/api/languages/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/languages"] });
      setIsDialogOpen(false);
      setEditingLanguage(null);
      form.reset();
      toast({
        title: "Dil Güncellendi",
        description: "Dil bilgileri başarıyla güncellendi.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: `Dil güncellenirken bir hata oluştu: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Toggle language active state mutation
  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      const res = await apiRequest("PUT", `/api/languages/${id}`, { isActive });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/languages"] });
      toast({
        title: "Durum Güncellendi",
        description: "Dil durumu başarıyla güncellendi.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: `Dil durumu güncellenirken bir hata oluştu: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Make language default mutation
  const makeDefaultMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("PUT", `/api/languages/${id}`, { isDefault: true });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/languages"] });
      toast({
        title: "Varsayılan Dil Güncellendi",
        description: "Varsayılan dil başarıyla değiştirildi.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: `Varsayılan dil güncellenirken bir hata oluştu: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Form submission handler
  function onSubmit(data: LanguageFormValues) {
    if (editingLanguage) {
      updateLanguageMutation.mutate({ id: editingLanguage.id, data });
    } else {
      createLanguageMutation.mutate(data);
    }
  }

  // Open dialog for editing
  function handleEdit(language: Language) {
    setEditingLanguage(language);
    form.reset({
      name: language.name,
      code: language.code,
      flagUrl: language.flagUrl || "",
      isActive: language.isActive,
      translationProgress: language.translationProgress,
    });
    setIsDialogOpen(true);
  }

  // Open dialog for adding new language
  function handleAddNew() {
    setEditingLanguage(null);
    form.reset({
      name: "",
      code: "",
      flagUrl: "",
      isActive: true,
      translationProgress: 0,
    });
    setIsDialogOpen(true);
  }

  // Handle toggle active
  function handleToggleActive(id: number, isActive: boolean) {
    toggleActiveMutation.mutate({ id, isActive });
  }

  // Handle make default
  function handleMakeDefault(id: number) {
    makeDefaultMutation.mutate(id);
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

  // Get default language
  const defaultLanguage = languages.find((lang) => lang.isDefault);

  return (
    <DashboardLayout>
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Dil Ayarları</CardTitle>
            <CardDescription>
              Site için desteklenen dilleri ve varsayılan dil ayarlarını yönetin.
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddNew}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Yeni Dil Ekle
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingLanguage ? "Dil Düzenle" : "Yeni Dil Ekle"}
                </DialogTitle>
                <DialogDescription>
                  {editingLanguage
                    ? "Dil bilgilerini düzenleyin."
                    : "Siteye yeni bir dil ekleyin."}
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
                          <Input {...field} placeholder="Türkçe" />
                        </FormControl>
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
                          <Input {...field} placeholder="tr" />
                        </FormControl>
                        <FormDescription>
                          ISO 639-1 iki harfli dil kodu (tr, en, es, de)
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
                            {...field}
                            placeholder="https://example.com/flags/tr.png"
                          />
                        </FormControl>
                        <FormDescription>
                          İsteğe bağlı - Dil seçiminde gösterilecek bayrak görseli URL'i
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Aktif</FormLabel>
                          <FormDescription>
                            Bu dil sitede kullanılabilir olacak
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
                    name="translationProgress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Çeviri Tamamlanma Yüzdesi (%)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            min="0"
                            max="100"
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsDialogOpen(false);
                        setEditingLanguage(null);
                      }}
                    >
                      İptal
                    </Button>
                    <Button
                      type="submit"
                      disabled={
                        createLanguageMutation.isPending ||
                        updateLanguageMutation.isPending
                      }
                    >
                      {(createLanguageMutation.isPending ||
                        updateLanguageMutation.isPending) && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {editingLanguage ? "Güncelle" : "Ekle"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Default Language Setting */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between p-4 bg-muted/50 rounded-lg">
            <div className="mb-4 md:mb-0">
              <h4 className="text-sm font-medium">Varsayılan Dil</h4>
              <p className="mt-1 text-xs text-muted-foreground">
                Sitenizde varsayılan olarak kullanılacak dil
              </p>
            </div>
            <div className="md:w-1/3">
              <select
                className="w-full p-2 rounded-md border border-border bg-background"
                value={defaultLanguage?.id}
                disabled={true}
              >
                {languages.map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-muted-foreground">
                Varsayılan dili değiştirmek için aşağıdaki listeden bir dili "Varsayılan Yap" olarak işaretleyin.
              </p>
            </div>
          </div>

          <Separator />

          {/* Available Languages */}
          <div>
            <h4 className="text-sm font-medium mb-4">Desteklenen Diller</h4>
            {languages.length > 0 ? (
              <ul className="divide-y">
                {languages.map((language) => (
                  <LanguageItem
                    key={language.id}
                    language={language}
                    isDefault={language.isDefault}
                    onToggleActive={handleToggleActive}
                    onEdit={handleEdit}
                    onMakeDefault={handleMakeDefault}
                  />
                ))}
              </ul>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                Henüz hiç dil eklenmemiş. "Yeni Dil Ekle" butonunu kullanarak dil ekleyebilirsiniz.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
