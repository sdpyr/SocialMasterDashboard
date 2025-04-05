import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Backup, InsertBackup, insertBackupSchema } from "@shared/schema";
import { apiRequest, queryClient, getQueryFn } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
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
  DialogTrigger,
} from "@/components/ui/dialog";
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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Loader2,
  Save,
  Upload,
  Download,
  Trash2,
  Database,
  RefreshCw,
  Calendar,
  Clock,
  Tag,
  Settings2,
  HardDrive,
} from "lucide-react";

// Create a schema for the backup form
const backupFormSchema = insertBackupSchema.extend({
  id: z.number().optional(),
});
type BackupFormValues = z.infer<typeof backupFormSchema>;

// Backup types
const backupTypes = [
  { id: "full", label: "Tam Yedek", description: "Tüm veritabanı ve medya dosyalarını yedekler" },
  { id: "database", label: "Veritabanı", description: "Sadece veritabanını yedekler" },
  { id: "media", label: "Medya", description: "Sadece medya dosyalarını yedekler" },
  { id: "settings", label: "Ayarlar", description: "Sadece site ayarlarını yedekler" },
];

export default function BackupPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [restoringBackupId, setRestoringBackupId] = useState<number | null>(null);
  const [deletingBackupId, setDeletingBackupId] = useState<number | null>(null);
  const [restoreFile, setRestoreFile] = useState<File | null>(null);
  const [backupProgress, setBackupProgress] = useState<number>(0);
  const [backupInProgress, setBackupInProgress] = useState<boolean>(false);
  
  // Fetch backups
  const { data: backups = [], isLoading } = useQuery<Backup[]>({
    queryKey: ["/api/backups"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  // Form setup
  const form = useForm<BackupFormValues>({
    resolver: zodResolver(backupFormSchema),
    defaultValues: {
      filename: `backup-${new Date().toISOString().split('T')[0]}.zip`,
      type: "full",
      size: 0,
      status: "pending",
    },
  });

  // Create backup mutation
  const createBackupMutation = useMutation({
    mutationFn: async (data: InsertBackup) => {
      setBackupInProgress(true);
      setBackupProgress(0);
      
      // Simulate backup progress
      const intervalId = setInterval(() => {
        setBackupProgress((prev) => {
          const newProgress = prev + Math.random() * 10;
          if (newProgress >= 100) {
            clearInterval(intervalId);
            return 100;
          }
          return newProgress;
        });
      }, 500);
      
      // Simulate API call
      const res = await apiRequest("POST", "/api/backups", {
        ...data,
        size: Math.floor(Math.random() * 10000000) + 1000000, // Random size between 1MB and 10MB
        createdBy: user?.id,
      });
      
      // Clear interval when done
      clearInterval(intervalId);
      setBackupProgress(100);
      
      // Wait a bit to show 100% completion
      await new Promise(resolve => setTimeout(resolve, 500));
      setBackupInProgress(false);
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/backups"] });
      setIsCreateDialogOpen(false);
      form.reset();
      toast({
        title: "Yedek Oluşturuldu",
        description: "Yedekleme işlemi başarıyla tamamlandı.",
      });
    },
    onError: (error: Error) => {
      setBackupInProgress(false);
      toast({
        title: "Hata",
        description: `Yedekleme işlemi sırasında bir hata oluştu: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Restore backup mutation
  const restoreBackupMutation = useMutation({
    mutationFn: async (id: number) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      return { success: true };
    },
    onSuccess: () => {
      setIsRestoreDialogOpen(false);
      setRestoringBackupId(null);
      toast({
        title: "Yedek Geri Yüklendi",
        description: "Yedek başarıyla geri yüklendi.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: `Yedek geri yüklenirken bir hata oluştu: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Restore from file mutation
  const restoreFromFileMutation = useMutation({
    mutationFn: async (file: File) => {
      // Simulate uploading and restoring
      await new Promise(resolve => setTimeout(resolve, 3000));
      return { success: true };
    },
    onSuccess: () => {
      setIsRestoreDialogOpen(false);
      setRestoreFile(null);
      toast({
        title: "Yedek Geri Yüklendi",
        description: "Yedek dosyası başarıyla geri yüklendi.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: `Yedek dosyasından geri yükleme sırasında bir hata oluştu: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Delete backup mutation
  const deleteBackupMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/backups/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/backups"] });
      setIsDeleteDialogOpen(false);
      setDeletingBackupId(null);
      toast({
        title: "Yedek Silindi",
        description: "Yedek başarıyla silindi.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: `Yedek silinirken bir hata oluştu: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Form submission handler
  function onSubmit(data: BackupFormValues) {
    createBackupMutation.mutate(data as InsertBackup);
  }

  // Handle restore backup
  function handleRestoreBackup(id: number) {
    setRestoringBackupId(id);
    setIsRestoreDialogOpen(true);
  }

  // Handle restore from file
  function handleRestoreFromFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      setRestoreFile(file);
    }
  }

  // Execute restore
  function executeRestore() {
    if (restoringBackupId) {
      restoreBackupMutation.mutate(restoringBackupId);
    } else if (restoreFile) {
      restoreFromFileMutation.mutate(restoreFile);
    }
  }

  // Handle delete backup
  function handleDeleteBackup(id: number) {
    setDeletingBackupId(id);
    setIsDeleteDialogOpen(true);
  }

  // Execute delete
  function executeDelete() {
    if (deletingBackupId) {
      deleteBackupMutation.mutate(deletingBackupId);
    }
  }

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

  // Format file size
  function formatFileSize(bytes: number) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  // Get backup type label
  function getBackupTypeLabel(type: string) {
    return backupTypes.find(t => t.id === type)?.label || type;
  }

  // Get backup status badge
  function getStatusBadge(status: string) {
    switch (status) {
      case "completed":
        return <Badge variant="success">Tamamlandı</Badge>;
      case "pending":
        return <Badge variant="secondary">Bekliyor</Badge>;
      case "in_progress":
        return <Badge variant="warning">Devam Ediyor</Badge>;
      case "failed":
        return <Badge variant="destructive">Başarısız</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Yedekleme Yönetimi</h2>
            <p className="text-muted-foreground">
              Sistem yedeği oluşturun, geri yükleyin ve yönetin.
            </p>
          </div>
          <div className="flex space-x-2">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Yeni Yedek Oluştur
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Yedek Oluştur</DialogTitle>
                  <DialogDescription>
                    Sisteminizin bir yedeğini oluşturun.
                  </DialogDescription>
                </DialogHeader>
                
                {backupInProgress ? (
                  <div className="py-6 space-y-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Yedekleme İşlemi Devam Ediyor</span>
                      <span className="text-sm font-medium">{Math.round(backupProgress)}%</span>
                    </div>
                    <Progress value={backupProgress} className="w-full" />
                    <p className="text-sm text-muted-foreground text-center">
                      Lütfen işlem tamamlanana kadar bekleyin...
                    </p>
                  </div>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Yedek Türü</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Yedek türünü seçin" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {backupTypes.map((type) => (
                                  <SelectItem key={type.id} value={type.id}>
                                    <div className="flex flex-col">
                                      <span>{type.label}</span>
                                      <span className="text-xs text-muted-foreground">
                                        {type.description}
                                      </span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="filename"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Dosya Adı</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>
                              Yedek dosyasının adı
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsCreateDialogOpen(false)}
                        >
                          İptal
                        </Button>
                        <Button
                          type="submit"
                          disabled={createBackupMutation.isPending}
                        >
                          {createBackupMutation.isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          Yedekleme Başlat
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                )}
              </DialogContent>
            </Dialog>
            
            <Dialog open={isRestoreDialogOpen} onOpenChange={setIsRestoreDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Yedekten Geri Yükle
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Yedekten Geri Yükle</DialogTitle>
                  <DialogDescription>
                    {restoringBackupId ? 
                      "Seçili yedeği geri yüklemek istediğinize emin misiniz?" : 
                      "Bir yedek dosyası yükleyin ve sistemi geri yükleyin."
                    }
                  </DialogDescription>
                </DialogHeader>
                
                {!restoringBackupId && (
                  <div className="space-y-4 py-4">
                    <div className="flex items-center justify-center border-2 border-dashed rounded-md p-8">
                      {restoreFile ? (
                        <div className="text-center">
                          <HardDrive className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                          <p className="font-medium">{restoreFile.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatFileSize(restoreFile.size)}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-2"
                            onClick={() => setRestoreFile(null)}
                          >
                            Değiştir
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-sm font-medium">Yedek dosyasını buraya sürükleyin</p>
                          <p className="text-xs text-muted-foreground mb-2">ya da</p>
                          <Input
                            type="file"
                            id="backup-file"
                            accept=".zip,.sql,.gz"
                            className="hidden"
                            onChange={handleRestoreFromFile}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById("backup-file")?.click()}
                          >
                            Dosya Seç
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    <div className="rounded-md bg-amber-50 p-4 text-amber-800 text-sm">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="font-medium">Dikkat</h3>
                          <p className="mt-1">
                            Geri yükleme işlemi mevcut verilerin üzerine yazacaktır. Bu işlem geri alınamaz.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {restoringBackupId && (
                  <div className="py-4">
                    <div className="rounded-md bg-amber-50 p-4 text-amber-800 text-sm mb-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="font-medium">Uyarı</h3>
                          <p className="mt-1">
                            Bu işlem tüm mevcut verilerin üzerine yazacak ve geri alınamayacaktır. 
                            Devam etmeden önce bir yedek almanız önerilir.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-muted p-4 rounded-md">
                      <h4 className="font-medium mb-2">Yedek Bilgileri</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-muted-foreground">Dosya Adı:</div>
                        <div>{backups.find(b => b.id === restoringBackupId)?.filename}</div>
                        <div className="text-muted-foreground">Oluşturulma Tarihi:</div>
                        <div>{formatDate(backups.find(b => b.id === restoringBackupId)?.createdAt || null)}</div>
                        <div className="text-muted-foreground">Boyut:</div>
                        <div>{formatFileSize(backups.find(b => b.id === restoringBackupId)?.size || 0)}</div>
                      </div>
                    </div>
                  </div>
                )}
                
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsRestoreDialogOpen(false);
                      setRestoringBackupId(null);
                      setRestoreFile(null);
                    }}
                  >
                    İptal
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={executeRestore}
                    disabled={(!restoringBackupId && !restoreFile) || 
                              restoreBackupMutation.isPending || 
                              restoreFromFileMutation.isPending}
                  >
                    {(restoreBackupMutation.isPending || restoreFromFileMutation.isPending) && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Geri Yükle
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Yedekler</CardTitle>
            <CardDescription>
              Oluşturduğunuz tüm yedekleri görüntüleyin ve yönetin.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {backups.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <Database className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">Yedek Bulunamadı</h3>
                <p className="text-muted-foreground mt-1 mb-4">
                  Henüz hiç yedek oluşturmadınız.
                </p>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Save className="mr-2 h-4 w-4" />
                      İlk Yedeği Oluştur
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Yedek Adı</TableHead>
                      <TableHead>Türü</TableHead>
                      <TableHead>Boyut</TableHead>
                      <TableHead>Tarih</TableHead>
                      <TableHead>Durum</TableHead>
                      <TableHead className="text-right">İşlemler</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {backups.map((backup) => (
                      <TableRow key={backup.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <Settings2 className="h-4 w-4 mr-2 text-muted-foreground" />
                            {backup.filename}
                          </div>
                        </TableCell>
                        <TableCell>{getBackupTypeLabel(backup.type)}</TableCell>
                        <TableCell>{formatFileSize(backup.size)}</TableCell>
                        <TableCell>{formatDate(backup.createdAt)}</TableCell>
                        <TableCell>{getStatusBadge(backup.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRestoreBackup(backup.id)}
                              disabled={backup.status !== "completed"}
                            >
                              <RefreshCw className="h-4 w-4" />
                              <span className="sr-only">Geri Yükle</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                            >
                              <Download className="h-4 w-4" />
                              <span className="sr-only">İndir</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteBackup(backup.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                              <span className="sr-only">Sil</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t bg-muted/50 px-6 py-3">
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="mr-1 h-3 w-3" />
              <span className="mr-2">Otomatik yedeklemeler:</span>
              <Badge variant="outline">Haftalık</Badge>
              <Clock className="ml-4 mr-1 h-3 w-3" />
              <span className="mr-2">Sonraki:</span>
              {formatDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))}
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Yedekleme Ayarları</CardTitle>
            <CardDescription>
              Otomatik yedekleme ayarlarını yapılandırın.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Otomatik Yedekleme</Label>
                  <p className="text-sm text-muted-foreground">
                    Belirli aralıklarla otomatik olarak yedek oluşturulur
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="backup-frequency">Yedekleme Sıklığı</Label>
                  <Select defaultValue="weekly">
                    <SelectTrigger id="backup-frequency">
                      <SelectValue placeholder="Sıklık seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Günlük</SelectItem>
                      <SelectItem value="weekly">Haftalık</SelectItem>
                      <SelectItem value="monthly">Aylık</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="backup-retention">Saklama Süresi</Label>
                  <Select defaultValue="30">
                    <SelectTrigger id="backup-retention">
                      <SelectValue placeholder="Süre seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 gün</SelectItem>
                      <SelectItem value="30">30 gün</SelectItem>
                      <SelectItem value="90">90 gün</SelectItem>
                      <SelectItem value="365">1 yıl</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="backup-time">Yedekleme Saati</Label>
                  <Select defaultValue="03:00">
                    <SelectTrigger id="backup-time">
                      <SelectValue placeholder="Saat seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="00:00">00:00</SelectItem>
                      <SelectItem value="03:00">03:00</SelectItem>
                      <SelectItem value="06:00">06:00</SelectItem>
                      <SelectItem value="12:00">12:00</SelectItem>
                      <SelectItem value="18:00">18:00</SelectItem>
                      <SelectItem value="21:00">21:00</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="backup-type">Yedek Türü</Label>
                  <Select defaultValue="full">
                    <SelectTrigger id="backup-type">
                      <SelectValue placeholder="Tür seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {backupTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-between border-t p-6">
            <div className="text-sm text-muted-foreground">
              Son güncelleme: {formatDate(new Date())}
            </div>
            <Button>
              Ayarları Kaydet
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Yedeği silmek istediğinize emin misiniz?</AlertDialogTitle>
            <AlertDialogDescription>
              Bu işlem geri alınamaz. Yedek kalıcı olarak silinecektir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={executeDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteBackupMutation.isPending}
            >
              {deleteBackupMutation.isPending && (
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
