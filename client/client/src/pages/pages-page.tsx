import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Page, InsertPage, insertPageSchema } from "@shared/schema";
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
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  Loader2,
  MoreVertical,
  PlusCircle,
  Search,
  FileEdit,
  Trash2,
  Eye,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Create a schema for the page form
const pageFormSchema = insertPageSchema.extend({
  id: z.number().optional(),
});
type PageFormValues = z.infer<typeof pageFormSchema>;

export default function PagesPage() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [deletingPageId, setDeletingPageId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch pages
  const { data: pages = [], isLoading } = useQuery<Page[]>({
    queryKey: ["/api/pages"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  // Form setup
  const form = useForm<PageFormValues>({
    resolver: zodResolver(pageFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      status: "draft",
      metaTitle: "",
      metaDescription: "",
    },
  });

  // Create page mutation
  const createPageMutation = useMutation({
    mutationFn: async (data: InsertPage) => {
      const res = await apiRequest("POST", "/api/pages", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pages"] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Sayfa Oluşturuldu",
        description: "Yeni sayfa başarıyla oluşturuldu.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: `Sayfa oluşturulurken bir hata oluştu: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Update page mutation
  const updatePageMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertPage> }) => {
      const res = await apiRequest("PUT", `/api/pages/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pages"] });
      setIsDialogOpen(false);
      setEditingPage(null);
      form.reset();
      toast({
        title: "Sayfa Güncellendi",
        description: "Sayfa bilgileri başarıyla güncellendi.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: `Sayfa güncellenirken bir hata oluştu: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Delete page mutation
  const deletePageMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/pages/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pages"] });
      setIsDeleteDialogOpen(false);
      setDeletingPageId(null);
      toast({
        title: "Sayfa Silindi",
        description: "Sayfa başarıyla silindi.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: `Sayfa silinirken bir hata oluştu: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Form submission handler
  function onSubmit(data: PageFormValues) {
    // Generate slug from title if not provided
    if (!data.slug) {
      data.slug = data.title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
    }
    
    if (editingPage) {
      updatePageMutation.mutate({ id: editingPage.id, data });
    } else {
      createPageMutation.mutate(data as InsertPage);
    }
  }

  // Open dialog for editing
  function handleEdit(page: Page) {
    setEditingPage(page);
    form.reset({
      title: page.title,
      slug: page.slug,
      content: page.content || "",
      status: page.status || "draft",
      metaTitle: page.metaTitle || "",
      metaDescription: page.metaDescription || "",
    });
    setIsDialogOpen(true);
  }

  // Open dialog for adding new page
  function handleAddNew() {
    setEditingPage(null);
    form.reset({
      title: "",
      slug: "",
      content: "",
      status: "draft",
      metaTitle: "",
      metaDescription: "",
    });
    setIsDialogOpen(true);
  }

  // Handle delete confirmation
  function handleDeleteConfirm(id: number) {
    setDeletingPageId(id);
    setIsDeleteDialogOpen(true);
  }

  // Execute delete
  function executeDelete() {
    if (deletingPageId) {
      deletePageMutation.mutate(deletingPageId);
    }
  }

  // Filter pages by search term
  const filteredPages = pages.filter(
    (page) =>
      page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date
  function formatDate(date: Date | string | null) {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // Get status badge variant
  function getStatusBadgeVariant(status: string | null) {
    switch (status) {
      case "published":
        return "success";
      case "draft":
        return "secondary";
      default:
        return "outline";
    }
  }

  // Get status text
  function getStatusText(status: string | null) {
    switch (status) {
      case "published":
        return "Yayında";
      case "draft":
        return "Taslak";
      default:
        return "Bilinmeyen";
    }
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
            <CardTitle>Sayfalar</CardTitle>
            <CardDescription>
              Sitenizin sayfalarını yönetin ve düzenleyin.
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Sayfa ara..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={handleAddNew}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Yeni Sayfa
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filteredPages.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Başlık</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>Son Güncelleme</TableHead>
                    <TableHead className="w-[80px]">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPages.map((page) => (
                    <TableRow key={page.id}>
                      <TableCell className="font-medium">{page.title}</TableCell>
                      <TableCell>{page.slug}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(page.status)}>
                          {getStatusText(page.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(page.updatedAt)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Açılır Menü</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(page)}>
                              <FileEdit className="mr-2 h-4 w-4" />
                              Düzenle
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteConfirm(page.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Sil
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-3 mb-4">
                <FileEdit className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">Sayfa Bulunamadı</h3>
              <p className="text-muted-foreground mt-1 mb-4">
                {searchTerm
                  ? "Arama kriterlerinize uygun sayfa bulunamadı."
                  : "Henüz hiç sayfa oluşturmadınız."}
              </p>
              <Button onClick={handleAddNew}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Yeni Sayfa Oluştur
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Page Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingPage ? "Sayfayı Düzenle" : "Yeni Sayfa Oluştur"}
            </DialogTitle>
            <DialogDescription>
              {editingPage
                ? "Sayfa bilgilerini düzenleyin."
                : "Siteniz için yeni bir sayfa oluşturun."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Başlık</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Sayfa Başlığı" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="sayfa-basligi"
                        hint="Boş bırakılırsa başlıktan otomatik oluşturulur"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>İçerik</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Sayfa içeriği..."
                        rows={8}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Durum</FormLabel>
                      <FormControl>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={field.value}
                          onChange={field.onChange}
                        >
                          <option value="draft">Taslak</option>
                          <option value="published">Yayında</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="metaTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Başlık</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="SEO için meta başlık"
                      />
                    </FormControl>
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
                        placeholder="SEO için meta açıklama"
                        rows={3}
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
                    setEditingPage(null);
                  }}
                >
                  İptal
                </Button>
                <Button
                  type="submit"
                  disabled={
                    createPageMutation.isPending ||
                    updatePageMutation.isPending
                  }
                >
                  {(createPageMutation.isPending ||
                    updatePageMutation.isPending) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {editingPage ? "Güncelle" : "Oluştur"}
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
            <AlertDialogTitle>Sayfayı silmek istediğinize emin misiniz?</AlertDialogTitle>
            <AlertDialogDescription>
              Bu işlem geri alınamaz. Sayfa kalıcı olarak silinecektir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={executeDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deletePageMutation.isPending}
            >
              {deletePageMutation.isPending && (
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
