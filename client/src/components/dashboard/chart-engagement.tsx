import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PLATFORM_DATA } from "@/lib/constants";
import { formatNumber } from "@/lib/utils";

interface ChartEngagementProps {
  data: {
    platform: string;
    value: number;
    percentage: number;
  }[];
  totalEngagement: number;
  selectedPlatform: string;
  onPlatformChange: (platform: string) => void;
}

export function ChartEngagement({ 
  data, 
  totalEngagement, 
  selectedPlatform, 
  onPlatformChange 
}: ChartEngagementProps) {
  // Calculate cumulative stroke-dasharray and stroke-dashoffset values
  let cumulativeDashOffset = 0;
  const chartItems = data.map(item => {
    const dashArray = item.percentage * 2.83; // 283 is close to circumference of a circle with r=45
    const currentOffset = cumulativeDashOffset;
    cumulativeDashOffset += dashArray;
    
    return {
      ...item,
      dashArray,
      dashOffset: currentOffset
    };
  });
  
  return (
    <Card className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <CardHeader className="p-4 border-b border-gray-200 flex flex-row items-center justify-between">
        <CardTitle className="font-medium text-gray-800">Etkileşim Dağılımı</CardTitle>
        <div className="flex items-center space-x-2">
          <Select value={selectedPlatform} onValueChange={onPlatformChange}>
            <SelectTrigger className="text-xs border border-gray-300 rounded px-2 py-1 w-[150px]">
              <SelectValue placeholder="Tüm Platformlar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Platformlar</SelectItem>
              {Object.entries(PLATFORM_DATA).map(([key, platform]) => (
                <SelectItem key={key} value={key}>{platform.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="chart-container flex items-center justify-center">
          {/* Donut chart using SVG */}
          <svg width="200" height="200" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="transparent" stroke="#f3f4f6" strokeWidth="10" />
            
            {/* Sections of the donut */}
            {chartItems.map((item, i) => {
              // Determine color based on platform
              const platformColor = item.platform === "instagram" ? "#E1306C" :
                                  item.platform === "youtube" ? "#FF0000" :
                                  item.platform === "tiktok" ? "#000000" :
                                  item.platform === "facebook" ? "#4267B2" : "#999999";
              
              return (
                <circle 
                  key={i}
                  cx="50" 
                  cy="50" 
                  r="45" 
                  fill="transparent" 
                  stroke={platformColor} 
                  strokeWidth="10" 
                  strokeDasharray={`${item.dashArray} ${283 - item.dashArray}`} 
                  strokeDashoffset={-item.dashOffset}
                  transform="rotate(-90 50 50)"
                />
              );
            })}
            
            {/* Center text */}
            <text x="50" y="45" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#1f2937">
              {formatNumber(totalEngagement)}
            </text>
            <text x="50" y="58" textAnchor="middle" fontSize="6" fill="#6b7280">
              Toplam Etkileşim
            </text>
          </svg>
          
          {/* Legend */}
          <div className="ml-8 space-y-3">
            {data.map((item, i) => {
              const platformData = PLATFORM_DATA[item.platform];
              return (
                <div key={i} className="flex items-center">
                  <span className={`w-3 h-3 rounded-full mr-2 ${platformData.color === "tiktok-color" ? "bg-black" : `bg-[#${platformData.color.replace("color", "")}]`}`}></span>
                  <span className="text-sm">{platformData.label}</span>
                  <span className="ml-auto text-sm font-medium">{item.percentage}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
