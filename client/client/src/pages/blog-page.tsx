import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { BlogPost, InsertBlogPost, insertBlogPostSchema, Category } from "@shared/schema";
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
  Image,
  Upload,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Create a schema for the blog post form
const blogPostFormSchema = insertBlogPostSchema.extend({
  id: z.number().optional(),
});
type BlogPostFormValues = z.infer<typeof blogPostFormSchema>;

export default function BlogPage() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [deletingPostId, setDeletingPostId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [featuredImagePreview, setFeaturedImagePreview] = useState<string | null>(null);

  // Fetch blog posts
  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  // Fetch categories
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  // Form setup
  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      featuredImage: "",
      status: "draft",
      metaTitle: "",
      metaDescription: "",
      publishedAt: null,
    },
  });

  // Create blog post mutation
  const createPostMutation = useMutation({
    mutationFn: async (data: InsertBlogPost) => {
      const res = await apiRequest("POST", "/api/blog-posts", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] });
      setIsDialogOpen(false);
      form.reset();
      setFeaturedImagePreview(null);
      toast({
        title: "Blog Yazısı Oluşturuldu",
        description: "Yeni blog yazısı başarıyla oluşturuldu.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: `Blog yazısı oluşturulurken bir hata oluştu: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Update blog post mutation
  const updatePostMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertBlogPost> }) => {
      const res = await apiRequest("PUT", `/api/blog-posts/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] });
      setIsDialogOpen(false);
      setEditingPost(null);
      form.reset();
      setFeaturedImagePreview(null);
      toast({
        title: "Blog Yazısı Güncellendi",
        description: "Blog yazısı bilgileri başarıyla güncellendi.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: `Blog yazısı güncellenirken bir hata oluştu: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Delete blog post mutation
  const deletePostMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/blog-posts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] });
      setIsDeleteDialogOpen(false);
      setDeletingPostId(null);
      toast({
        title: "Blog Yazısı Silindi",
        description: "Blog yazısı başarıyla silindi.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: `Blog yazısı silinirken bir hata oluştu: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Form submission handler
  function onSubmit(data: BlogPostFormValues) {
    // Generate slug from title if not provided
    if (!data.slug) {
      data.slug = data.title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
    }
    
    // Set publish date if status is published
    if (data.status === "published" && !data.publishedAt) {
      data.publishedAt = new Date();
    }
    
    if (editingPost) {
      updatePostMutation.mutate({ id: editingPost.id, data });
    } else {
      createPostMutation.mutate(data as InsertBlogPost);
    }
  }

  // Open dialog for editing
  function handleEdit(post: BlogPost) {
    setEditingPost(post);
    form.reset({
      title: post.title,
      slug: post.slug,
      content: post.content || "",
      excerpt: post.excerpt || "",
      featuredImage: post.featuredImage || "",
      status: post.status || "draft",
      metaTitle: post.metaTitle || "",
      metaDescription: post.metaDescription || "",
      publishedAt: post.publishedAt ? new Date(post.publishedAt) : null,
    });
    
    if (post.featuredImage) {
      setFeaturedImagePreview(post.featuredImage);
    } else {
      setFeaturedImagePreview(null);
    }
    
    setIsDialogOpen(true);
  }

  // Open dialog for adding new post
  function handleAddNew() {
    setEditingPost(null);
    form.reset({
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      featuredImage: "",
      status: "draft",
      metaTitle: "",
      metaDescription: "",
      publishedAt: null,
    });
    setFeaturedImagePreview(null);
    setIsDialogOpen(true);
  }

  // Handle delete confirmation
  function handleDeleteConfirm(id: number) {
    setDeletingPostId(id);
    setIsDeleteDialogOpen(true);
  }

  // Execute delete
  function executeDelete() {
    if (deletingPostId) {
      deletePostMutation.mutate(deletingPostId);
    }
  }

  // Handle featured image change
  const handleFeaturedImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real application, you would upload the file and get a URL
      // For now, create a local preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setFeaturedImagePreview(result);
        form.setValue("featuredImage", "uploaded-image-url.jpg");
      };
      reader.readAsDataURL(file);
    }
  };

  // Filter posts by search term
  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
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
            <CardTitle>Blog Yazıları</CardTitle>
            <CardDescription>
              Blog yazılarınızı yönetin ve düzenleyin.
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Blog yazısı ara..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={handleAddNew}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Yeni Blog Yazısı
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filteredPosts.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Başlık</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>Yayın Tarihi</TableHead>
                    <TableHead>Son Güncelleme</TableHead>
                    <TableHead className="w-[80px]">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium">{post.title}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(post.status)}>
                          {getStatusText(post.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(post.publishedAt)}</TableCell>
                      <TableCell>{formatDate(post.updatedAt)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Açılır Menü</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(post)}>
                              <FileEdit className="mr-2 h-4 w-4" />
                              Düzenle
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteConfirm(post.id)}
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
              <h3 className="text-lg font-semibold">Blog Yazısı Bulunamadı</h3>
              <p className="text-muted-foreground mt-1 mb-4">
                {searchTerm
                  ? "Arama kriterlerinize uygun blog yazısı bulunamadı."
                  : "Henüz hiç blog yazısı oluşturmadınız."}
              </p>
              <Button onClick={handleAddNew}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Yeni Blog Yazısı Oluştur
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Blog Post Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingPost ? "Blog Yazısını Düzenle" : "Yeni Blog Yazısı Oluştur"}
            </DialogTitle>
            <DialogDescription>
              {editingPost
                ? "Blog yazısı bilgilerini düzenleyin."
                : "Siteniz için yeni bir blog yazısı oluşturun."}
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
                      <Input {...field} placeholder="Blog Yazısı Başlığı" />
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
                        placeholder="blog-yazisi-basligi"
                      />
                    </FormControl>
                    <FormDescription>
                      Boş bırakılırsa başlıktan otomatik oluşturulur
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Özet</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Blog yazısının kısa özeti..."
                        rows={3}
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
                        placeholder="Blog yazısı içeriği..."
                        rows={8}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Featured Image */}
              <div>
                <FormLabel className="block text-sm font-medium mb-2">Öne Çıkan Görsel</FormLabel>
                <div className="flex items-center space-x-5">
                  <div className="flex-shrink-0 h-24 w-24 bg-muted rounded-md overflow-hidden">
                    {featuredImagePreview ? (
                      <img
                        src={featuredImagePreview}
                        alt="Öne çıkan görsel"
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
                        id="featured-image-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFeaturedImageChange}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("featured-image-upload")?.click()}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        {featuredImagePreview ? "Değiştir" : "Yükle"}
                      </Button>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      PNG, JPG, GIF. En fazla 2MB.
                    </p>
                  </div>
                </div>
              </div>

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
                          <option value="published">Yayınla</option>
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
                    setEditingPost(null);
                  }}
                >
                  İptal
                </Button>
                <Button
                  type="submit"
                  disabled={
                    createPostMutation.isPending ||
                    updatePostMutation.isPending
                  }
                >
                  {(createPostMutation.isPending ||
                    updatePostMutation.isPending) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {editingPost ? "Güncelle" : "Oluştur"}
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
            <AlertDialogTitle>Blog yazısını silmek istediğinize emin misiniz?</AlertDialogTitle>
            <AlertDialogDescription>
              Bu işlem geri alınamaz. Blog yazısı kalıcı olarak silinecektir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={executeDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deletePostMutation.isPending}
            >
              {deletePostMutation.isPending && (
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
