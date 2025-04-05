"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface MediaUploadProps {
  medias: {
    files: File[] | [] | null;
    mediaUrls: string[] | [] | null;
  };
  onMediaChange: (files: File[] | null, urls: string[] | null) => void;
  isUploading: boolean;
}

export function MediaUpload({
  medias,
  onMediaChange,
  isUploading
}: MediaUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };
  
  const handleFiles = (files: File[]) => {
    // Filter for image and video files
    const mediaFiles = files.filter(file => 
      file.type.startsWith("image/") || file.type.startsWith("video/")
    );
    
    if (mediaFiles.length > 0) {
      // Convert files to URLs for preview
      const urls = mediaFiles.map(file => URL.createObjectURL(file));
      onMediaChange(mediaFiles, urls);
    }
  };
  
  const removeMedia = (index: number) => {
    if (medias.files && medias.mediaUrls) {
      const newFiles = [...medias.files];
      const newUrls = [...medias.mediaUrls];
      
      // Revoke the object URL to avoid memory leaks
      URL.revokeObjectURL(newUrls[index] as string);
      
      newFiles.splice(index, 1);
      newUrls.splice(index, 1);
      
      if (newFiles.length === 0) {
        onMediaChange(null, null);
      } else {
        onMediaChange(newFiles, newUrls);
      }
    }
  };
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <div className="space-y-4">
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 transition-all text-center",
          dragActive ? "border-primary bg-primary/5" : "border-gray-200",
          medias.files && medias.files.length > 0 ? "bg-gray-50" : "bg-white"
        )}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        {!medias.files || medias.files.length === 0 ? (
          <div className="space-y-4 py-4">
            <div className="flex justify-center">
              <i className="ri-image-add-line text-4xl text-gray-400"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500">
                Medya dosyalarınızı sürükleyin veya{" "}
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="text-primary hover:underline"
                >
                  dosya seçin
                </button>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                JPG, PNG, GIF veya MP4 formatları desteklenir.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-2">
            {medias.mediaUrls?.map((url, index) => (
              <div key={index} className="relative group">
                {(medias.files?.[index] as File).type.startsWith("image/") ? (
                  <img
                    src={url as string}
                    alt={`Yüklenen medya ${index + 1}`}
                    className="w-full h-32 object-cover rounded-md"
                  />
                ) : (
                  <video
                    src={url as string}
                    className="w-full h-32 object-cover rounded-md"
                    controls
                  />
                )}
                <button
                  type="button"
                  onClick={() => removeMedia(index)}
                  className="absolute top-1 right-1 bg-white text-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <i className="ri-delete-bin-line"></i>
                </button>
              </div>
            ))}
            <div
              className="h-32 border border-gray-200 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-50"
              onClick={triggerFileInput}
            >
              <i className="ri-add-line text-2xl text-gray-400"></i>
            </div>
          </div>
        )}
        <Input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept="image/*,video/*"
          multiple
        />
      </div>
      
      {isUploading && (
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-primary"></div>
          <span>Medya yükleniyor...</span>
        </div>
      )}
    </div>
  );
}