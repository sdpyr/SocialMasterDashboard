"use client";

import React from "react";
import { PLATFORM_DATA } from "@/lib/constants";
import type { Platform } from "@shared/schema";
import { cn } from "@/lib/utils";

interface PostPreviewProps {
  content: string;
  mediaUrls: string[];
  platform: Platform;
}

export function PostPreview({ content, mediaUrls, platform }: PostPreviewProps) {
  const platformData = PLATFORM_DATA[platform];

  // Generic empty state when no content
  if (!content && mediaUrls.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border border-gray-200 rounded-lg bg-gray-50 w-full max-w-md h-[400px]">
        <i className="ri-eye-off-line text-3xl text-gray-400 mb-2"></i>
        <p className="text-gray-500 text-center">
          İçerik veya medya eklediğinizde burada önizleme göreceksiniz.
        </p>
      </div>
    );
  }

  // Instagram-like preview
  if (platform === "instagram") {
    return (
      <div className="border border-gray-200 rounded-lg w-full max-w-md bg-white overflow-hidden">
        {/* Header */}
        <div className="flex items-center p-3 border-b border-gray-200">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <i className="ri-user-line text-gray-500"></i>
          </div>
          <div className="ml-3">
            <p className="text-sm font-semibold">kullanici_adi</p>
          </div>
          <i className="ri-more-fill ml-auto text-gray-500"></i>
        </div>
        
        {/* Media */}
        {mediaUrls.length > 0 ? (
          <div className="relative w-full" style={{ aspectRatio: "1/1" }}>
            {mediaUrls[0].includes("video") ? (
              <video 
                src={mediaUrls[0]} 
                className="w-full h-full object-cover" 
                controls 
              />
            ) : (
              <img 
                src={mediaUrls[0]} 
                alt="Instagram gönderi" 
                className="w-full h-full object-cover" 
              />
            )}
            {mediaUrls.length > 1 && (
              <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                +{mediaUrls.length - 1}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gray-100 w-full" style={{ aspectRatio: "1/1" }}>
            <div className="flex items-center justify-center h-full">
              <span className="text-gray-400">Medya Yok</span>
            </div>
          </div>
        )}
        
        {/* Actions */}
        <div className="p-3">
          <div className="flex space-x-4 mb-2">
            <i className="ri-heart-line text-2xl"></i>
            <i className="ri-chat-1-line text-2xl"></i>
            <i className="ri-send-plane-line text-2xl"></i>
            <i className="ri-bookmark-line text-2xl ml-auto"></i>
          </div>
          
          {/* Content */}
          <div className="text-sm">
            <span className="font-semibold mr-2">kullanici_adi</span>
            {content}
          </div>
        </div>
      </div>
    );
  }
  
  // Twitter/X preview
  if (platform === "twitter") {
    return (
      <div className="border border-gray-200 rounded-xl w-full max-w-md bg-white overflow-hidden">
        {/* Header */}
        <div className="flex items-start p-4">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <i className="ri-user-line text-gray-500"></i>
          </div>
          <div className="ml-3 flex-1">
            <div className="flex items-center">
              <p className="font-semibold">Kullanıcı Adı</p>
              <p className="text-gray-500 ml-2 text-sm">@kullanici</p>
              <i className="ri-more-line ml-auto text-gray-500"></i>
            </div>
            
            {/* Content */}
            <p className="mt-1 text-[15px]">{content}</p>
            
            {/* Media */}
            {mediaUrls.length > 0 && (
              <div className={cn(
                "mt-3 grid gap-2 rounded-xl overflow-hidden",
                mediaUrls.length > 1 ? "grid-cols-2" : "grid-cols-1"
              )}>
                {mediaUrls.slice(0, 4).map((url, index) => (
                  <div 
                    key={index} 
                    className={cn(
                      "overflow-hidden",
                      mediaUrls.length === 3 && index === 0 ? "col-span-2" : ""
                    )}
                  >
                    {url.includes("video") ? (
                      <video 
                        src={url} 
                        className="w-full h-full object-cover rounded-lg" 
                        style={{ maxHeight: "300px" }}
                        controls 
                      />
                    ) : (
                      <img 
                        src={url} 
                        alt={`Medya ${index + 1}`} 
                        className="w-full h-full object-cover rounded-lg" 
                        style={{ maxHeight: "300px" }}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {/* Actions */}
            <div className="flex justify-between mt-3 text-gray-500">
              <div className="flex items-center space-x-1">
                <i className="ri-chat-1-line"></i>
                <span className="text-xs">0</span>
              </div>
              <div className="flex items-center space-x-1">
                <i className="ri-repeat-line"></i>
                <span className="text-xs">0</span>
              </div>
              <div className="flex items-center space-x-1">
                <i className="ri-heart-line"></i>
                <span className="text-xs">0</span>
              </div>
              <div className="flex items-center space-x-1">
                <i className="ri-bar-chart-line"></i>
                <span className="text-xs">0</span>
              </div>
              <div className="flex items-center space-x-1">
                <i className="ri-upload-line"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // LinkedIn preview
  if (platform === "linkedin") {
    return (
      <div className="border border-gray-200 rounded-lg w-full max-w-md bg-white overflow-hidden">
        {/* Header */}
        <div className="flex items-start p-4">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
            <i className="ri-user-line text-gray-500"></i>
          </div>
          <div className="ml-3">
            <p className="font-semibold">Kullanıcı Adı</p>
            <p className="text-gray-500 text-xs">Ünvan • Meslek</p>
            <p className="text-gray-400 text-xs">Şimdi</p>
          </div>
          <i className="ri-more-fill ml-auto text-gray-500"></i>
        </div>
        
        {/* Content */}
        <div className="px-4 pb-3">
          <p className="text-sm whitespace-pre-wrap">{content}</p>
        </div>
        
        {/* Media */}
        {mediaUrls.length > 0 && (
          <div className="border-t border-gray-100">
            {mediaUrls[0].includes("video") ? (
              <video 
                src={mediaUrls[0]} 
                className="w-full" 
                style={{ maxHeight: "400px", objectFit: "contain" }}
                controls 
              />
            ) : (
              <img 
                src={mediaUrls[0]} 
                alt="LinkedIn gönderi" 
                className="w-full" 
                style={{ maxHeight: "400px", objectFit: "contain" }}
              />
            )}
            {mediaUrls.length > 1 && (
              <div className="px-4 py-2 bg-gray-50 text-gray-500 text-sm">
                +{mediaUrls.length - 1} daha
              </div>
            )}
          </div>
        )}
        
        {/* Actions */}
        <div className="flex justify-between px-6 py-2 border-t border-gray-200">
          <div className="flex items-center space-x-1 text-gray-600">
            <i className="ri-thumb-up-line"></i>
            <span className="text-sm">Beğen</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-600">
            <i className="ri-chat-1-line"></i>
            <span className="text-sm">Yorum Yap</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-600">
            <i className="ri-repeat-line"></i>
            <span className="text-sm">Paylaş</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-600">
            <i className="ri-send-plane-line"></i>
            <span className="text-sm">Gönder</span>
          </div>
        </div>
      </div>
    );
  }
  
  // Facebook preview
  if (platform === "facebook") {
    return (
      <div className="border border-gray-200 rounded-lg w-full max-w-md bg-white overflow-hidden">
        {/* Header */}
        <div className="flex items-center p-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <i className="ri-user-line text-gray-500"></i>
          </div>
          <div className="ml-3">
            <p className="text-sm font-semibold">Kullanıcı Adı</p>
            <div className="flex items-center text-xs text-gray-500">
              <span>Şimdi</span>
              <i className="ri-earth-line ml-1"></i>
            </div>
          </div>
          <i className="ri-more-fill ml-auto text-gray-500"></i>
        </div>
        
        {/* Content */}
        <div className="px-3 pb-2">
          <p className="text-sm">{content}</p>
        </div>
        
        {/* Media */}
        {mediaUrls.length > 0 && (
          <div>
            {mediaUrls[0].includes("video") ? (
              <video 
                src={mediaUrls[0]} 
                className="w-full" 
                controls 
              />
            ) : (
              <img 
                src={mediaUrls[0]} 
                alt="Facebook gönderi" 
                className="w-full" 
              />
            )}
            {mediaUrls.length > 1 && (
              <div className="grid grid-cols-2 gap-1 mt-1">
                {mediaUrls.slice(1, 4).map((url, index) => (
                  <div key={index} className="relative">
                    {url.includes("video") ? (
                      <video 
                        src={url} 
                        className="w-full h-32 object-cover" 
                      />
                    ) : (
                      <img 
                        src={url} 
                        alt={`Medya ${index + 2}`} 
                        className="w-full h-32 object-cover" 
                      />
                    )}
                    {index === 2 && mediaUrls.length > 4 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-semibold">
                        +{mediaUrls.length - 4}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Actions */}
        <div className="px-3 py-2">
          <div className="flex justify-between text-xs text-gray-500 pb-2">
            <div className="flex items-center">
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-primary text-white">
                <i className="ri-thumb-up-fill text-[8px]"></i>
              </span>
              <span className="ml-1">0</span>
            </div>
            <div>
              <span>0 yorum</span>
              <span className="mx-1">•</span>
              <span>0 paylaşım</span>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-1">
            <div className="flex justify-between">
              <button className="flex-1 py-1 flex items-center justify-center text-gray-600">
                <i className="ri-thumb-up-line mr-2"></i>
                <span>Beğen</span>
              </button>
              <button className="flex-1 py-1 flex items-center justify-center text-gray-600">
                <i className="ri-chat-1-line mr-2"></i>
                <span>Yorum Yap</span>
              </button>
              <button className="flex-1 py-1 flex items-center justify-center text-gray-600">
                <i className="ri-share-forward-line mr-2"></i>
                <span>Paylaş</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Default preview for other platforms
  return (
    <div className="border border-gray-200 rounded-lg w-full max-w-md bg-white p-4">
      <div className="flex items-center mb-4">
        <i className={`${platformData.iconClass} text-2xl ${platformData.color} mr-2`}></i>
        <h3 className="font-semibold">{platformData.label} Önizleme</h3>
      </div>
      
      <div className="mb-4">
        <p className="whitespace-pre-wrap">{content}</p>
      </div>
      
      {mediaUrls.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <div className="grid grid-cols-2 gap-1">
            {mediaUrls.map((url, index) => (
              <div key={index} className={`${index === 0 && mediaUrls.length % 2 === 1 ? "col-span-2" : ""}`}>
                {url.includes("video") ? (
                  <video src={url} className="w-full h-40 object-cover" controls />
                ) : (
                  <img src={url} alt={`Medya ${index + 1}`} className="w-full h-40 object-cover" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}