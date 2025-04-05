import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Activity } from "@shared/schema";
import { formatDateRelative, getAvatarFallback } from "@/lib/utils";
import { PLATFORM_DATA } from "@/lib/constants";

interface ActivityFeedProps {
  activities: Activity[];
  onViewAll?: () => void;
}

export function ActivityFeed({ activities, onViewAll }: ActivityFeedProps) {
  return (
    <Card className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <CardHeader className="p-4 border-b border-gray-200 flex flex-row items-center justify-between">
        <CardTitle className="font-medium text-gray-800">Son Etkinlikler</CardTitle>
        <Button variant="link" onClick={onViewAll} className="text-primary hover:text-primary-800 text-sm">
          Tümünü Gör
        </Button>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-sm text-gray-500">Henüz etkinlik yok</p>
            </div>
          ) : (
            activities.map((activity) => {
              const platformData = PLATFORM_DATA[activity.platform];
              const bgColor = platformData.bgColor.replace("bg-", "");
              
              return (
                <div key={activity.id} className="flex items-start">
                  <div className={`w-8 h-8 rounded-full ${bgColor} flex items-center justify-center flex-shrink-0 mr-3`}>
                    <i className={`${platformData.iconClass} ${platformData.color}`}></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-800">
                      {activity.actorName && (
                        <span className="font-medium">{activity.actorName} </span>
                      )}
                      {activity.content}
                    </p>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-gray-500">{formatDateRelative(activity.timestamp)}</span>
                      {activity.targetUrl && (
                        <>
                          <span className="mx-1 text-gray-300">•</span>
                          <a href={activity.targetUrl} className="text-xs text-primary hover:underline">Görüntüle</a>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
