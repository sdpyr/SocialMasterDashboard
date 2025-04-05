import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Media, InsertMedia, insertMediaSchema } from "@shared/schema";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import {
  Loader2,
  PlusCircle,
  Search,
  LayoutGrid,
  List,
  Filter,
  SortAsc,
  Upload,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MediaItem from "@/components/ui/media-item";

// Create a schema for the media form
const mediaFormSchema = insertMediaSchema.partial();
type MediaFormValues = z.infer<typeof mediaFormSchema>;

// Define media file types for filtering
const mediaTypes = [
  { value: "all", label: "Tüm Medya" },
  { value: "image", label: "Resimler" },
  { value: "video", label: "Videolar" },
  { value: "document", label: "Belgeler" },
];

// Define sorting options
const sortOptions = [
  { value: "newest", label: "En Yeni" },
  { value: "oldest", label: "En Eski" },
  { value: "name_asc", label: "İsim (A-Z)" },
  { value: "name_desc", label: "İsim (Z-A)" },
  { value: "size_desc", label: "Boyut (Büyük-Küçük)" },
  { value: "size_asc", label: "Boyut (Küçük-Büyük)" },
];

export default function MediaPage() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingMedia, setEditingMedia] = useState<Media | null>(null);
  const [deletingMediaId, setDeletingMediaId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [fileTypeFilter, setFileTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Fetch media
  const { data: mediaFiles = [], isLoading } = useQuery<Media[]>({
    queryKey: ["/api/media"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  // Form setup
  const form = useForm<MediaFormValues>({
    resolver: zodResolver(mediaFormSchema),
    defaultValues: {
      title: "",
      altText: "",
      description: "",
    },
  });

  // Create media mutation
  const uploadMediaMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch("/api/media", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/media"] });
      setIsDialogOpen(false);
      form.reset();
      setSelectedFile(null);
      toast({
        title: "Medya Yüklendi",
        description: "Dosya başarıyla yüklendi.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: `Dosya yüklenirken bir hata oluştu: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Update media mutation
  const updateMediaMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertMedia> }) => {
      const res = await apiRequest("PUT", `/api/media/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/media"] });
      setIsDialogOpen(false);
      setEditingMedia(null);
      form.reset();
      toast({
        title: "Medya Güncellendi",
        description: "Medya bilgileri başarıyla güncellendi.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: `Medya güncellenirken bir hata oluştu: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Delete media mutation
  const deleteMediaMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/media/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/media"] });
      setIsDeleteDialogOpen(false);
      setDeletingMediaId(null);
      toast({
        title: "Medya Silindi",
        description: "Medya dosyası başarıyla silindi.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: `Medya silinirken bir hata oluştu: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Form submission handler
  function onSubmit(data: MediaFormValues) {
    if (editingMedia) {
      updateMediaMutation.mutate({ id: editingMedia.id, data });
    } else if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("title", data.title || selectedFile.name);
      formData.append("altText", data.altText || "");
      formData.append("description", data.description || "");
      
      uploadMediaMutation.mutate(formData);
    } else {
      toast({
        title: "Dosya Seçilmedi",
        description: "Lütfen bir dosya seçin.",
        variant: "destructive",
      });
    }
  }

  // File selection handler
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      form.setValue("title", file.name);
    }
  };

  // Open dialog for editing
  function handleEdit(media: Media) {
    setEditingMedia(media);
    form.reset({
      title: media.title || media.originalFilename,
      altText: media.altText || "",
      description: media.description || "",
    });
    setIsDialogOpen(true);
  }

  // Open dialog for adding new media
  function handleAddNew() {
    setEditingMedia(null);
    form.reset({
      title: "",
      altText: "",
      description: "",
    });
    setSelectedFile(null);
    setIsDialogOpen(true);
  }

  // Handle delete confirmation
  function handleDelete(id: number) {
    setDeletingMediaId(id);
    setIsDeleteDialogOpen(true);
  }

  // Execute delete
  function executeDelete() {
    if (deletingMediaId) {
      deleteMediaMutation.mutate(deletingMediaId);
    }
  }

  // Filter and sort media files
  let filteredMedia = [...mediaFiles];
  
  // Apply search filter
  if (searchTerm) {
    filteredMedia = filteredMedia.filter(
      (media) =>
        media.originalFilename.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (media.title && media.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (media.description && media.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }
  
  // Apply file type filter
  if (fileTypeFilter !== "all") {
    filteredMedia = filteredMedia.filter((media) => {
      const type = media.fileType.toLowerCase();
      if (fileTypeFilter === "image") {
        return ["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(type);
      } else if (fileTypeFilter === "video") {
        return ["mp4", "webm", "mov", "avi"].includes(type);
      } else if (fileTypeFilter === "document") {
        return ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt"].includes(type);
      }
      return true;
    });
  }
  
  // Apply sorting
  filteredMedia.sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "name_asc":
        return a.originalFilename.localeCompare(b.originalFilename);
      case "name_desc":
        return b.originalFilename.localeCompare(a.originalFilename);
      case "size_desc":
        return b.fileSize - a.fileSize;
      case "size_asc":
        return a.fileSize - b.fileSize;
      default:
        return 0;
    }
  });

  // Format file size
  function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
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
            <CardTitle>Medya Kütüphanesi</CardTitle>
            <CardDescription>
              Tüm resim, video ve belge dosyalarınızı yönetin.
            </CardDescription>
          </div>
          <Button onClick={handleAddNew}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Yeni Dosya Yükle
          </Button>
        </CardHeader>
        
        {/* Filters */}
        <div className="px-6 py-3 bg-muted/50 border-y">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={fileTypeFilter} onValueChange={setFileTypeFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrele" />
                  </SelectTrigger>
                  <SelectContent>
                    {mediaTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <SortAsc className="h-4 w-4 text-muted-foreground" />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sırala" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Medya ara..."
                  className="pl-8 w-full sm:w-auto"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex border rounded-md overflow-hidden">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <CardContent className="p-6">
          {filteredMedia.length > 0 ? (
            <div className={`${viewMode === "grid" ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4" : "space-y-4"}`}>
              {filteredMedia.map((media) => (
                <MediaItem
                  key={media.id}
                  media={media}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-3 mb-4">
                <Upload className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">Medya Bulunamadı</h3>
              <p className="text-muted-foreground mt-1 mb-4">
                {searchTerm || fileTypeFilter !== "all"
                  ? "Arama kriterlerinize uygun medya bulunamadı."
                  : "Henüz hiç medya dosyası yüklenmemiş."}
              </p>
              <Button onClick={handleAddNew}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Dosya Yükle
              </Button>
            </div>
          )}
        </CardContent>
        
        {filteredMedia.length > 0 && (
          <div className="px-6 py-4 bg-muted/50 border-t flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              <span>Toplam {mediaFiles.length} dosya, {filteredMedia.length} gösteriliyor</span>
            </div>
          </div>
        )}
      </Card>

      {/* Upload/Edit Media Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingMedia ? "Medya Düzenle" : "Yeni Dosya Yükle"}
            </DialogTitle>
            <DialogDescription>
              {editingMedia
                ? "Medya bilgilerini düzenleyin."
                : "Bilgisayarınızdan bir dosya yükleyin."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {!editingMedia && (
                <div className="grid w-full items-center gap-1.5">
                  <FormLabel>Dosya</FormLabel>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      id="file"
                      onChange={handleFileChange}
                    />
                  </div>
                  {selectedFile && (
                    <p className="text-sm text-muted-foreground">
                      Seçilen dosya: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                    </p>
                  )}
                </div>
              )}

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Başlık</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Dosya başlığı" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="altText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alt Metin</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Alternatif metin (SEO için)" />
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
                        placeholder="Dosya açıklaması"
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
                    setEditingMedia(null);
                    setSelectedFile(null);
                  }}
                >
                  İptal
                </Button>
                <Button
                  type="submit"
                  disabled={
                    uploadMediaMutation.isPending ||
                    updateMediaMutation.isPending ||
                    (!editingMedia && !selectedFile)
                  }
                >
                  {(uploadMediaMutation.isPending ||
                    updateMediaMutation.isPending) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {editingMedia ? "Güncelle" : "Yükle"}
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
            <AlertDialogTitle>Medya dosyasını silmek istediğinize emin misiniz?</AlertDialogTitle>
            <AlertDialogDescription>
              Bu işlem geri alınamaz. Dosya kalıcı olarak silinecektir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={executeDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteMediaMutation.isPending}
            >
              {deleteMediaMutation.isPending && (
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
