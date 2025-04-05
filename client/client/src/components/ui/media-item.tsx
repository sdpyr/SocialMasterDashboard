import { useState } from "react";
import { 
  Card, 
  CardContent,
  CardFooter 
} from "@/components/ui/card";
import { Media } from "@shared/schema";
import { 
  Edit, 
  Download, 
  Trash, 
  File, 
  Play, 
  Image as ImageIcon 
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type MediaItemProps = {
  media: Media;
  onEdit: (media: Media) => void;
  onDelete: (id: number) => void;
};

export default function MediaItem({ media, onEdit, onDelete }: MediaItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  const getMediaIcon = () => {
    const type = media.fileType.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(type)) {
      return null; // Will show image preview
    } else if (['mp4', 'webm', 'mov', 'avi'].includes(type)) {
      return <Play className="h-12 w-12 text-white bg-black/50 rounded-full p-2" />;
    } else {
      return <File className="h-16 w-16 text-muted-foreground" />;
    }
  };
  
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(media.fileType.toLowerCase());
  const isVideo = ['mp4', 'webm', 'mov', 'avi'].includes(media.fileType.toLowerCase());
  
  return (
    <Card 
      className="group relative overflow-hidden shadow-sm hover:shadow-md transition-shadow"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-square w-full overflow-hidden bg-muted flex items-center justify-center">
        {isImage ? (
          <img 
            src={media.filePath} 
            alt={media.altText || media.originalFilename} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted/50">
            {getMediaIcon()}
          </div>
        )}
      </div>
      
      {/* Overlay controls */}
      <div 
        className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  className="p-1 bg-white rounded-full hover:bg-gray-100"
                  onClick={() => onEdit(media)}
                >
                  <Edit className="h-4 w-4 text-gray-700" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Düzenle</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  className="p-1 bg-white rounded-full hover:bg-gray-100"
                  onClick={() => window.open(media.filePath, '_blank')}
                >
                  <Download className="h-4 w-4 text-gray-700" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>İndir</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="p-1 bg-white rounded-full hover:bg-gray-100">
                      <Trash className="h-4 w-4 text-red-600" />
                    </button>
                  </AlertDialogTrigger>
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
                        onClick={() => onDelete(media.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Sil
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TooltipTrigger>
              <TooltipContent>
                <p>Sil</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      <CardFooter className="p-2 text-xs flex flex-col items-start">
        <p className="font-medium truncate w-full" title={media.originalFilename}>
          {media.originalFilename}
        </p>
        <p className="text-muted-foreground">{formatFileSize(media.fileSize)}</p>
      </CardFooter>
    </Card>
  );
}
