import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatNumber } from "@/lib/utils";
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number | string;
  subtext?: string;
  change?: number;
  changeText?: string;
  className?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export function StatsCard({
  title,
  value,
  subtext,
  change,
  changeText,
  className,
  icon,
  children,
}: StatsCardProps) {
  const isPositiveChange = typeof change === "number" && change > 0;
  const isNegativeChange = typeof change === "number" && change < 0;
  
  return (
    <Card className={cn("stat-card hover:shadow-md transition-all duration-200", className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-600">{title}</span>
          {typeof change === "number" ? (
            <span className={cn(
              "flex items-center text-xs font-medium px-2 py-0.5 rounded-full",
              isPositiveChange ? "text-green-600 bg-green-50" : 
              isNegativeChange ? "text-red-600 bg-red-50" : 
              "text-gray-600 bg-gray-50"
            )}>
              {isPositiveChange && <ArrowUpIcon className="h-3 w-3 mr-1" />}
              {isNegativeChange && <ArrowDownIcon className="h-3 w-3 mr-1" />}
              {!isPositiveChange && !isNegativeChange && <MinusIcon className="h-3 w-3 mr-1" />}
              {Math.abs(change)}%
            </span>
          ) : changeText ? (
            <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">{changeText}</span>
          ) : null}
        </div>
        
        <div className="flex items-baseline">
          <h3 className="text-2xl font-bold metallic-header">
            {typeof value === "number" ? formatNumber(value) : value}
          </h3>
          {subtext && <span className="ml-2 text-sm text-gray-500">{subtext}</span>}
        </div>
        
        {children}
      </CardContent>
    </Card>
  );
}

interface StatBarValueProps {
  platform: string;
  value: number;
  label?: string;
}

export function StatsCardWithPlatformBar({
  title,
  value,
  subtext,
  change,
  changeText,
  className,
  platformValues,
}: StatsCardProps & { platformValues: StatBarValueProps[] }) {
  const total = platformValues.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <StatsCard
      title={title}
      value={value}
      subtext={subtext}
      change={change}
      changeText={changeText}
      className={className}
    >
      <div className="mt-3 flex items-center space-x-1">
        <span className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden flex">
          {platformValues.map((platform, index) => {
            const percentage = (platform.value / total) * 100;
            let bgColor = "";
            
            switch (platform.platform) {
              case "instagram":
                bgColor = "bg-[#E1306C]";
                break;
              case "youtube":
                bgColor = "bg-[#FF0000]";
                break;
              case "tiktok":
                bgColor = "bg-black";
                break;
              case "facebook":
                bgColor = "bg-[#4267B2]";
                break;
              default:
                bgColor = "bg-gray-400";
            }
            
            return <span key={index} className={`h-full ${bgColor} rounded-full`} style={{ width: `${percentage}%` }}></span>;
          })}
        </span>
      </div>
      
      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
        {platformValues.map((platform, index) => (
          <span key={index} className="flex items-center">
            {platform.platform === "instagram" && <i className="ri-instagram-line mr-1 instagram-color"></i>}
            {platform.platform === "youtube" && <i className="ri-youtube-line mr-1 youtube-color"></i>}
            {platform.platform === "tiktok" && <i className="ri-tiktok-line mr-1 tiktok-color"></i>}
            {platform.platform === "facebook" && <i className="ri-facebook-circle-line mr-1 facebook-color"></i>}
            {platform.label || formatNumber(platform.value)}
          </span>
        ))}
      </div>
    </StatsCard>
  );
}

export function StatsCardWithProgress({
  title,
  value,
  subtext,
  change,
  changeText,
  className,
  progress,
  progressMax,
  progressLabel,
}: StatsCardProps & { 
  progress: number; 
  progressMax: number;
  progressLabel?: string;
}) {
  const percentage = Math.round((progress / progressMax) * 100);
  
  return (
    <StatsCard
      title={title}
      value={value}
      subtext={subtext}
      change={change}
      changeText={changeText}
      className={className}
    >
      <div className="mt-3 w-full bg-gray-100 rounded-full h-1.5">
        <div 
          className="bg-primary h-1.5 rounded-full" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      
      <div className="mt-2 flex justify-between items-center">
        <span className="text-xs text-gray-500">
          {progressLabel || `Hedef: ${formatNumber(progressMax)}`}
        </span>
        <span className="text-xs font-medium text-primary">{percentage}%</span>
      </div>
    </StatsCard>
  );
}

export function StatsCardWithBarChart({
  title,
  value,
  subtext,
  change,
  changeText,
  className,
  data,
  labels,
}: StatsCardProps & {
  data: number[];
  labels: string[];
}) {
  const maxValue = Math.max(...data);
  
  return (
    <StatsCard
      title={title}
      value={value}
      subtext={subtext}
      change={change}
      changeText={changeText}
      className={className}
    >
      <div className="mt-3 h-10">
        <div className="flex h-full items-end space-x-1">
          {data.map((value, index) => {
            const height = (value / maxValue) * 100;
            const purpleShade = 200 + Math.round((index / data.length) * 300);
            
            return (
              <div 
                key={index} 
                className={`h-[${height}%] w-1/${data.length} bg-primary-${purpleShade} rounded-t-md`}
                style={{ height: `${height}%` }}
              ></div>
            );
          })}
        </div>
      </div>
      
      <div className="mt-2 flex justify-between text-xs text-gray-500">
        {labels.map((label, index) => (
          <span key={index}>{label}</span>
        ))}
      </div>
    </StatsCard>
  );
}
