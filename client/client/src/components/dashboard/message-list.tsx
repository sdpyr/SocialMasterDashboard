import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Message } from "@shared/schema";
import { formatDateRelative, formatTime, getAvatarFallback, truncateText } from "@/lib/utils";
import { Link } from "wouter";

interface MessageListProps {
  messages: Message[];
  onMessageClick?: (message: Message) => void;
  onNewMessage?: () => void;
  onViewAll?: () => void;
}

export function MessageList({ messages, onMessageClick, onNewMessage, onViewAll }: MessageListProps) {
  return (
    <Card className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <CardHeader className="p-4 border-b border-gray-200 flex flex-row items-center justify-between">
        <CardTitle className="font-medium text-gray-800">Son Mesajlar</CardTitle>
        <Button variant="link" onClick={onViewAll} className="text-primary hover:text-primary-800 text-sm">
          Tümünü Gör
        </Button>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {messages.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-sm text-gray-500">Henüz mesaj yok</p>
            </div>
          ) : (
            messages.map((message) => (
              <div 
                key={message.id} 
                className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                onClick={() => onMessageClick && onMessageClick(message)}
              >
                <div className="relative mr-3">
                  <Avatar>
                    <AvatarImage src={message.senderAvatar || ""} alt={message.senderName} />
                    <AvatarFallback>{getAvatarFallback(message.senderName)}</AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${message.isRead ? 'bg-gray-300' : 'bg-primary'} border-2 border-white rounded-full`}></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{message.senderName}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {truncateText(message.content, 40)}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                  {!message.isRead && (
                    <span className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white text-xs mt-1">1</span>
                  )}
                </div>
              </div>
            ))
          )}
          
          <Button 
            onClick={onNewMessage}
            className="w-full mt-3 p-2 text-sm text-primary hover:bg-primary-50 rounded-lg flex items-center justify-center"
          >
            <i className="ri-message-3-line mr-2"></i>
            <span>Yeni Mesaj</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
