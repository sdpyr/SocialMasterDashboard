import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PLATFORM_DATA } from "@/lib/constants";
import { Analytics } from "@shared/schema";

interface ChartGrowthProps {
  data: {
    labels: string[];
    datasets: {
      platform: string;
      data: number[];
    }[];
  };
  period: "daily" | "weekly" | "monthly" | "yearly";
  onPeriodChange: (period: "daily" | "weekly" | "monthly" | "yearly") => void;
}

export function ChartGrowth({ data, period, onPeriodChange }: ChartGrowthProps) {
  const chartHeight = 200;
  const chartWidth = 400;
  const padding = { top: 10, right: 10, bottom: 20, left: 20 };
  
  // Calculate max value for y-axis scale
  const allValues = data.datasets.flatMap(ds => ds.data);
  const maxValue = Math.max(...allValues);
  
  // Calculate x and y scales
  const xScale = (chartWidth - padding.left - padding.right) / (data.labels.length - 1);
  const yScale = (chartHeight - padding.top - padding.bottom) / maxValue;
  
  // Generate paths for each dataset
  const paths = data.datasets.map(dataset => {
    const points = dataset.data.map((value, i) => ({
      x: padding.left + i * xScale,
      y: chartHeight - padding.bottom - (value * yScale)
    }));
    
    // Create SVG path
    let pathData = `M ${points[0].x},${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      // Use curve for smoother lines
      const xc = (points[i].x + points[i-1].x) / 2;
      const yc = (points[i].y + points[i-1].y) / 2;
      pathData += ` Q ${points[i-1].x},${points[i-1].y} ${xc},${yc}`;
      
      if (i === points.length - 1) {
        pathData += ` L ${points[i].x},${points[i].y}`;
      }
    }
    
    return {
      path: pathData,
      platform: dataset.platform,
      points
    };
  });
  
  return (
    <Card className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <CardHeader className="p-4 border-b border-gray-200 flex flex-row items-center justify-between">
        <CardTitle className="font-medium text-gray-800">Takipçi Artışı</CardTitle>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "p-1 text-xs font-medium rounded",
              period === "daily" ? "bg-primary-100 text-primary-700" : "text-gray-500 hover:bg-gray-100"
            )}
            onClick={() => onPeriodChange("daily")}
          >
            G
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "p-1 text-xs font-medium rounded",
              period === "weekly" ? "bg-primary-100 text-primary-700" : "text-gray-500 hover:bg-gray-100"
            )}
            onClick={() => onPeriodChange("weekly")}
          >
            H
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "p-1 text-xs font-medium rounded",
              period === "monthly" ? "bg-primary-100 text-primary-700" : "text-gray-500 hover:bg-gray-100"
            )}
            onClick={() => onPeriodChange("monthly")}
          >
            A
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "p-1 text-xs font-medium rounded",
              period === "yearly" ? "bg-primary-100 text-primary-700" : "text-gray-500 hover:bg-gray-100"
            )}
            onClick={() => onPeriodChange("yearly")}
          >
            Y
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="chart-container">
          <svg className="w-full h-full" viewBox={`0 0 ${chartWidth} ${chartHeight}`} xmlns="http://www.w3.org/2000/svg">
            {/* Grid lines */}
            {[0.2, 0.4, 0.6, 0.8].map((ratio, i) => (
              <line 
                key={i}
                x1="0" 
                y1={chartHeight - padding.bottom - (ratio * (chartHeight - padding.top - padding.bottom))} 
                x2={chartWidth} 
                y2={chartHeight - padding.bottom - (ratio * (chartHeight - padding.top - padding.bottom))} 
                stroke="#f1f1f1" 
                strokeWidth="1"
              />
            ))}
            
            {/* Draw lines for each platform */}
            {paths.map((pathData, index) => {
              const platformColor = pathData.platform === "instagram" ? "#E1306C" :
                                   pathData.platform === "youtube" ? "#FF0000" :
                                   pathData.platform === "tiktok" ? "#000000" :
                                   pathData.platform === "facebook" ? "#4267B2" : "#999999";
              
              return (
                <React.Fragment key={index}>
                  <path 
                    d={pathData.path} 
                    fill="none" 
                    stroke={platformColor} 
                    strokeWidth="2"
                  />
                  
                  {/* Draw points */}
                  {pathData.points.map((point, i) => (
                    <circle 
                      key={i}
                      cx={point.x} 
                      cy={point.y} 
                      r="3" 
                      fill={platformColor}
                    />
                  ))}
                </React.Fragment>
              );
            })}
          </svg>
          
          {/* Legend */}
          <div className="flex items-center mt-2 justify-center space-x-4 text-xs">
            {paths.map((path, index) => {
              const platformData = PLATFORM_DATA[path.platform];
              return (
                <div key={index} className="flex items-center">
                  <span className={`w-3 h-3 rounded-full mr-1 ${platformData.color === "tiktok-color" ? "bg-black" : "bg-[#" + platformData.color.replace("color", "") + "]"}`}></span>
                  <span>{platformData.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
