import { useState, useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Upload, Trash2, CheckCircle2, Info, X } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";

// Platform özellikleri ve kısıtlamalar
interface PlatformRestrictions {
  maxDuration: number;
  minDuration: number;
  maxFileSize: number;
  supportedFormats: string[];
}

interface Platform {
  id: number;
  name: string;
  accountId: string;
  username: string;
  platform: string;
  restrictions: PlatformRestrictions;
}

interface VideoUploadComponentProps {
  accounts: Platform[];
}

// Gizlilik seçenekleri
const privacyOptions = [
  { value: "PUBLIC", label: "Herkese Açık" },
  { value: "PRIVATE", label: "Yalnızca Ben" },
  { value: "UNLISTED", label: "Liste Dışı" },
];

export default function VideoUploadComponent({ accounts }: VideoUploadComponentProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [title, setTitle] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [privacyLevel, setPrivacyLevel] = useState("PUBLIC");
  const [schedulePost, setSchedulePost] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Platforma göre filtrelenmiş hesaplar 
  const instagramAccounts = accounts.filter(account => account.platform === "instagram");
  const tiktokAccounts = accounts.filter(account => account.platform === "tiktok");
  const youtubeAccounts = accounts.filter(account => account.platform === "youtube");

  // Dosya seçme işleyicisi
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Dosya boyutu ve format kontrolü
    if (file.size > 100 * 1024 * 1024) { // 100MB
      setErrorMessage("Dosya boyutu çok büyük. Maksimum 100MB yükleyebilirsiniz.");
      return;
    }
    
    const validVideoFormats = [
      "video/mp4", 
      "video/quicktime", 
      "video/x-msvideo", 
      "video/webm"
    ];
    
    if (!validVideoFormats.includes(file.type)) {
      setErrorMessage("Desteklenmeyen dosya formatı. Lütfen MP4, MOV, AVI veya WEBM formatında video yükleyin.");
      return;
    }
    
    setErrorMessage(null);
    setSelectedFile(file);
    setVideoUrl(URL.createObjectURL(file));
  };

  // Platform seçim işleyicisi
  const handlePlatformToggle = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform) 
        : [...prev, platform]
    );
  };

  // Dosya kaldırma işleyicisi  
  const handleRemoveFile = () => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    setSelectedFile(null);
    setVideoUrl(null);
    
    // Dosya inputunu sıfırla
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Gönderme işleyicisi
  const handleSubmit = async () => {
    if (!selectedFile || selectedPlatforms.length === 0) {
      setErrorMessage("Lütfen bir video ve en az bir platform seçin.");
      return;
    }
    
    if (!title.trim()) {
      setErrorMessage("Lütfen bir başlık girin.");
      return;
    }
    
    setUploading(true);
    setUploadStatus("uploading");
    setErrorMessage(null);
    
    try {
      // Formdaki verileri hazırla
      const formData = new FormData();
      formData.append("video", selectedFile);
      formData.append("title", title);
      formData.append("caption", caption);
      formData.append("hashtags", hashtags);
      formData.append("platforms", JSON.stringify(selectedPlatforms));
      formData.append("privacyLevel", privacyLevel);
      
      if (schedulePost && scheduledDate) {
        formData.append("scheduled", "true");
        formData.append("scheduledDate", scheduledDate.toISOString());
      }
      
      // API'ye yükleme isteği
      const response = await apiRequest("POST", "/api/content/upload-video", formData);
      
      // Başarılı cevap
      if (response.ok) {
        setUploadStatus("success");
        
        // Form alanlarını temizle
        setTitle("");
        setCaption("");
        setHashtags("");
        handleRemoveFile();
        setSelectedPlatforms([]);
        
        setTimeout(() => {
          setUploadStatus("idle");
        }, 3000);
      } else {
        // Hata cevabı
        const errorData = await response.json();
        throw new Error(errorData.message || "Video yüklenirken bir hata oluştu.");
      }
    } catch (error) {
      console.error("Video yükleme hatası:", error);
      setUploadStatus("error");
      setErrorMessage((error as Error).message || "Video yüklenirken bir hata oluştu.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {errorMessage && (
        <Alert variant="destructive">
          <X className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/2">
          <Card>
            <CardContent className="pt-6">
              <div className="mb-6">
                <Label htmlFor="video-upload">Video Yükle</Label>
                <div 
                  className="mt-2 border-2 border-dashed rounded-md border-gray-300 p-6 text-center hover:border-primary cursor-pointer transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {!videoUrl ? (
                    <div className="space-y-2">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="text-sm text-gray-500">
                        <span className="font-semibold text-primary">Yüklemek için tıklayın</span> veya dosyayı buraya sürükleyin
                      </div>
                      <p className="text-xs text-gray-400">
                        MP4, MOV, AVI veya WEBM (max. 100MB)
                      </p>
                    </div>
                  ) : (
                    <div className="relative">
                      <video 
                        src={videoUrl} 
                        controls 
                        className="w-full rounded-md"
                        style={{ maxHeight: "300px" }}
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        className="absolute top-2 right-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFile();
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <Input
                    id="video-upload"
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                    accept="video/mp4,video/quicktime,video/x-msvideo,video/webm"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Başlık</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1"
                    placeholder="Video başlığı"
                  />
                </div>
                
                <div>
                  <Label htmlFor="caption">Açıklama</Label>
                  <Textarea
                    id="caption"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="mt-1"
                    placeholder="Video açıklaması"
                    rows={4}
                  />
                </div>
                
                <div>
                  <Label htmlFor="hashtags">Etiketler</Label>
                  <Input
                    id="hashtags"
                    value={hashtags}
                    onChange={(e) => setHashtags(e.target.value)}
                    className="mt-1"
                    placeholder="#sosyalmedya #içerik #video"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Etiketleri boşluk veya # işareti ile ayırın
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="w-full md:w-1/2">
          <Card>
            <CardContent className="pt-6">
              <div className="mb-6">
                <Label className="text-lg font-medium">Paylaşım Ayarları</Label>
              </div>
              
              <div className="space-y-6">
                <div>
                  <Label className="block mb-2">Platformlar</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {instagramAccounts.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="instagram"
                          checked={selectedPlatforms.includes("instagram")}
                          onCheckedChange={() => handlePlatformToggle("instagram")}
                        />
                        <Label htmlFor="instagram" className="cursor-pointer">
                          Instagram (Reels)
                        </Label>
                      </div>
                    )}
                    
                    {tiktokAccounts.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="tiktok"
                          checked={selectedPlatforms.includes("tiktok")}
                          onCheckedChange={() => handlePlatformToggle("tiktok")}
                        />
                        <Label htmlFor="tiktok" className="cursor-pointer">
                          TikTok
                        </Label>
                      </div>
                    )}
                    
                    {youtubeAccounts.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="youtube"
                          checked={selectedPlatforms.includes("youtube")}
                          onCheckedChange={() => handlePlatformToggle("youtube")}
                        />
                        <Label htmlFor="youtube" className="cursor-pointer">
                          YouTube (Shorts)
                        </Label>
                      </div>
                    )}
                    
                    {instagramAccounts.length === 0 && 
                     tiktokAccounts.length === 0 && 
                     youtubeAccounts.length === 0 && (
                      <div className="col-span-2 p-4 bg-muted rounded-md text-center">
                        <Info className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Hesap bağlantısı bulunamadı. Lütfen önce sosyal medya hesaplarınızı bağlayın.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="privacy" className="block mb-2">Gizlilik</Label>
                  <Select
                    value={privacyLevel}
                    onValueChange={setPrivacyLevel}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Gizlilik seviyesi seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {privacyOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <Switch
                      id="schedule"
                      checked={schedulePost}
                      onCheckedChange={setSchedulePost}
                    />
                    <Label htmlFor="schedule" className="cursor-pointer">
                      Zamanlama
                    </Label>
                  </div>
                  
                  {schedulePost && (
                    <div className="pt-2">
                      <Label htmlFor="schedule-date" className="block mb-2">Tarih ve Saat</Label>
                      <Input
                        id="schedule-date"
                        type="datetime-local"
                        onChange={(e) => {
                          const date = e.target.value ? new Date(e.target.value) : null;
                          setScheduledDate(date);
                        }}
                        min={new Date().toISOString().slice(0, 16)}
                      />
                    </div>
                  )}
                </div>
                
                <div className="pt-4">
                  <Button
                    type="button"
                    className="w-full"
                    onClick={handleSubmit}
                    disabled={uploading || !selectedFile || selectedPlatforms.length === 0}
                  >
                    {uploadStatus === "uploading" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Yükleniyor...
                      </>
                    ) : uploadStatus === "success" ? (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Başarıyla Yüklendi
                      </>
                    ) : (
                      "Video Yükle"
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}