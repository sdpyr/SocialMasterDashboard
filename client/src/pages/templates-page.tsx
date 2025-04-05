import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Template, InsertTemplate, insertTemplateSchema } from "@shared/schema";
import { apiRequest, queryClient, getQueryFn } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import DashboardLayout from "@/components/dashboard/layout";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  PlusCircle,
  CheckCircle,
  Image,
  Upload,
  Palette,
  Layout,
  CheckCircle2,
  FileEdit,
  Trash2,
} from "lucide-react";

// Create a schema for the template form
const templateFormSchema = insertTemplateSchema.extend({
  id: z.number().optional(),
});
type TemplateFormValues = z.infer<typeof templateFormSchema>;

// Template preview component
const TemplatePreview = ({
  template,
  isActive,
  onSelect,
  onEdit,
  onDelete,
}: {
  template: Template;
  isActive: boolean;
  onSelect: (id: number) => void;
  onEdit: (template: Template) => void;
  onDelete: (id: number) => void;
}) => {
  return (
    <Card className={`overflow-hidden transition-all ${isActive ? 'ring-2 ring-primary' : ''}`}>
      <div className="relative">
        {isActive && (
          <div className="absolute top-2 right-2 bg-primary rounded-full p-1">
            <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
          </div>
        )}
        {template.thumbnailUrl ? (
          <img 
            src={template.thumbnailUrl} 
            alt={template.name} 
            className="h-48 w-full object-cover" 
          />
        ) : (
          <div className="h-48 w-full bg-muted flex items-center justify-center">
            <Layout className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium mb-2 flex items-center justify-between">
          {template.name}
          {template.isActive && <Badge variant="success" className="ml-2">Aktif</Badge>}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {template.description || "Bu şablon için henüz bir açıklama eklenmemiş."}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onEdit(template)}
        >
          <FileEdit className="h-4 w-4 mr-2" />
          Düzenle
        </Button>
        <div className="space-x-2">
          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => onDelete(template.id)}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Sil</span>
          </Button>
          <Button 
            variant={isActive ? "secondary" : "default"} 
            size="sm"
            onClick={() => onSelect(template.id)}
            disabled={isActive}
          >
            {isActive ? 'Aktif' : 'Aktifleştir'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default function TemplatesPage() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [deletingTemplateId, setDeletingTemplateId] = useState<number | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  // Fetch templates
  const { data: templates = [], isLoading } = useQuery<Template[]>({
    queryKey: ["/api/templates"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  // Form setup
  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: {
      name: "",
      description: "",
      thumbnailUrl: "",
      isActive: false,
      config: {},
    },
  });

  // Create template mutation
  const createTemplateMutation = useMutation({
    mutationFn: async (data: InsertTemplate) => {
      const res = await apiRequest("POST", "/api/templates", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
      setIsDialogOpen(false);
      form.reset();
      setThumbnailPreview(null);
      toast({
        title: "Şablon Oluşturuldu",
        description: "Yeni şablon başarıyla oluşturuldu.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: `Şablon oluşturulurken bir hata oluştu: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Update template mutation
  const updateTemplateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertTemplate> }) => {
      const res = await apiRequest("PUT", `/api/templates/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
      setIsDialogOpen(false);
      setEditingTemplate(null);
      form.reset();
      setThumbnailPreview(null);
      toast({
        title: "Şablon Güncellendi",
        description: "Şablon bilgileri başarıyla güncellendi.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: `Şablon güncellenirken bir hata oluştu: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Delete template mutation
  const deleteTemplateMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/templates/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
      setIsDeleteDialogOpen(false);
      setDeletingTemplateId(null);
      toast({
        title: "Şablon Silindi",
        description: "Şablon başarıyla silindi.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: `Şablon silinirken bir hata oluştu: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Set template as active mutation
  const activateTemplateMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("PUT", `/api/templates/${id}`, { isActive: true });
      
      // Set all other templates to inactive
      const promises = templates
        .filter(template => template.id !== id && template.isActive)
        .map(template => 
          apiRequest("PUT", `/api/templates/${template.id}`, { isActive: false })
        );
        
      await Promise.all(promises);
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
      toast({
        title: "Şablon Aktifleştirildi",
        description: "Şablon başarıyla aktif hale getirildi.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: `Şablon aktifleştirilirken bir hata oluştu: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Form submission handler
  function onSubmit(data: TemplateFormValues) {
    if (editingTemplate) {
      updateTemplateMutation.mutate({ id: editingTemplate.id, data });
    } else {
      createTemplateMutation.mutate(data as InsertTemplate);
    }
  }

  // Handle thumbnail change
  const handleThumbnailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real application, you would upload the file and get a URL
      // For now, create a local preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setThumbnailPreview(result);
        form.setValue("thumbnailUrl", "uploaded-thumbnail-url.jpg");
      };
      reader.readAsDataURL(file);
    }
  };

  // Open dialog for editing
  function handleEdit(template: Template) {
    setEditingTemplate(template);
    form.reset({
      name: template.name,
      description: template.description || "",
      thumbnailUrl: template.thumbnailUrl || "",
      isActive: template.isActive,
      config: template.config || {},
    });
    
    if (template.thumbnailUrl) {
      setThumbnailPreview(template.thumbnailUrl);
    } else {
      setThumbnailPreview(null);
    }
    
    setIsDialogOpen(true);
  }

  // Open dialog for adding new template
  function handleAddNew() {
    setEditingTemplate(null);
    form.reset({
      name: "",
      description: "",
      thumbnailUrl: "",
      isActive: false,
      config: {},
    });
    setThumbnailPreview(null);
    setIsDialogOpen(true);
  }

  // Handle delete confirmation
  function handleDeleteConfirm(id: number) {
    setDeletingTemplateId(id);
    setIsDeleteDialogOpen(true);
  }

  // Execute delete
  function executeDelete() {
    if (deletingTemplateId) {
      deleteTemplateMutation.mutate(deletingTemplateId);
    }
  }

  // Handle template activation
  function handleActivateTemplate(id: number) {
    activateTemplateMutation.mutate(id);
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
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <CardTitle>Şablonlar</CardTitle>
            <CardDescription>
              Sitenizin tasarım şablonlarını yönetin ve düzenleyin.
            </CardDescription>
          </div>
          <Button onClick={handleAddNew}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Yeni Şablon
          </Button>
        </CardHeader>
        <CardContent>
          {templates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <TemplatePreview
                  key={template.id}
                  template={template}
                  isActive={template.isActive}
                  onSelect={handleActivateTemplate}
                  onEdit={handleEdit}
                  onDelete={handleDeleteConfirm}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-3 mb-4">
                <Palette className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">Şablon Bulunamadı</h3>
              <p className="text-muted-foreground mt-1 mb-4">
                Henüz hiç şablon oluşturmadınız.
              </p>
              <Button onClick={handleAddNew}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Yeni Şablon Oluştur
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Template Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? "Şablonu Düzenle" : "Yeni Şablon Oluştur"}
            </DialogTitle>
            <DialogDescription>
              {editingTemplate
                ? "Şablon bilgilerini düzenleyin."
                : "Siteniz için yeni bir şablon oluşturun."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Şablon Adı</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Modern Flat UI" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Açıklama</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Şablon açıklaması..."
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Thumbnail Image */}
              <div>
                <FormLabel className="block text-sm font-medium mb-2">Önizleme Görseli</FormLabel>
                <div className="flex items-center space-x-5">
                  <div className="flex-shrink-0 h-24 w-24 bg-muted rounded-md overflow-hidden">
                    {thumbnailPreview ? (
                      <img
                        src={thumbnailPreview}
                        alt="Şablon önizleme"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                        <Image className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="relative">
                      <Input
                        type="file"
                        id="thumbnail-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("thumbnail-upload")?.click()}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        {thumbnailPreview ? "Değiştir" : "Yükle"}
                      </Button>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      PNG, JPG, GIF. En fazla 2MB.
                    </p>
                  </div>
                </div>
              </div>

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Aktif Şablon</FormLabel>
                      <FormDescription>
                        Bu şablonu sitenizde aktif olarak kullanın
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

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setEditingTemplate(null);
                  }}
                >
                  İptal
                </Button>
                <Button
                  type="submit"
                  disabled={
                    createTemplateMutation.isPending ||
                    updateTemplateMutation.isPending
                  }
                >
                  {(createTemplateMutation.isPending ||
                    updateTemplateMutation.isPending) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {editingTemplate ? "Güncelle" : "Oluştur"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Şablonu silmek istediğinize emin misiniz?</AlertDialogTitle>
            <AlertDialogDescription>
              Bu işlem geri alınamaz. Şablon kalıcı olarak silinecektir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={executeDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteTemplateMutation.isPending}
            >
              {deleteTemplateMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
