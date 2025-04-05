import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import { Keyword } from "@shared/schema";
import { formatDateRelative } from "@/lib/utils";
import { PLATFORM_DATA } from "@/lib/constants";

interface KeywordTrackingProps {
  keywords: Keyword[];
  onAddKeyword?: () => void;
  onSearchKeyword?: (term: string) => void;
  onViewDetails?: (keyword: Keyword) => void;
}

export function KeywordTracking({ 
  keywords, 
  onAddKeyword, 
  onSearchKeyword,
  onViewDetails
}: KeywordTrackingProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (onSearchKeyword) {
      onSearchKeyword(value);
    }
  };

  const columns = [
    {
      id: "keyword",
      header: "Anahtar Kelime",
      cell: (row: Keyword) => (
        <div className="text-sm font-medium text-gray-900">{row.keyword}</div>
      ),
    },
    {
      id: "platform",
      header: "Platform",
      cell: (row: Keyword) => {
        if (!row.platform) return <div className="text-sm text-gray-500">Tüm Platformlar</div>;
        
        const platformData = PLATFORM_DATA[row.platform];
        return (
          <div className="flex items-center">
            <i className={`${platformData.iconClass} text-lg ${platformData.color} mr-1`}></i>
            <span className="text-sm text-gray-500">{platformData.label}</span>
          </div>
        );
      },
    },
    {
      id: "mentions",
      header: "Bahsedilme",
      cell: (row: Keyword) => (
        <div className="text-sm text-gray-900">{row.mentions.toLocaleString()}</div>
      ),
    },
    {
      id: "change",
      header: "Değişim",
      cell: (row: Keyword) => {
        const isPositive = row.changePercentage > 0;
        const isNegative = row.changePercentage < 0;
        
        return (
          <div className={`flex items-center text-sm ${
            isPositive ? "text-green-600" : isNegative ? "text-red-600" : "text-gray-500"
          }`}>
            <i className={`${
              isPositive ? "ri-arrow-up-line" : isNegative ? "ri-arrow-down-line" : "ri-more-line"
            } mr-1`}></i>
            <span>{Math.abs(row.changePercentage)}%</span>
          </div>
        );
      },
    },
    {
      id: "sentiment",
      header: "Sentiment",
      cell: (row: Keyword) => {
        let bgColor = "bg-gray-400";
        
        if (row.sentiment >= 70) bgColor = "bg-green-400";
        else if (row.sentiment >= 50) bgColor = "bg-green-400";
        else if (row.sentiment >= 30) bgColor = "bg-yellow-400";
        else bgColor = "bg-red-400";
        
        return (
          <div className="flex items-center">
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className={`h-full ${bgColor} rounded-full`} style={{ width: `${row.sentiment}%` }}></div>
            </div>
            <span className="ml-2 text-sm text-gray-500">{row.sentiment}%</span>
          </div>
        );
      },
    },
    {
      id: "lastUpdated",
      header: "Son Güncellenme",
      cell: (row: Keyword) => (
        <div className="text-sm text-gray-500">
          {formatDateRelative(row.lastUpdated)}
        </div>
      ),
    },
    {
      id: "actions",
      header: "İşlemler",
      className: "text-right",
      cell: (row: Keyword) => (
        <Button 
          variant="link" 
          onClick={() => onViewDetails && onViewDetails(row)}
          className="text-primary hover:text-primary-800"
        >
          Detaylar
        </Button>
      ),
    },
  ];

  return (
    <Card className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <CardHeader className="p-4 border-b border-gray-200 flex flex-row items-center justify-between">
        <CardTitle className="font-medium text-gray-800">Anahtar Kelime Takibi</CardTitle>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Input
              type="text"
              placeholder="Anahtar kelime ara..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <i className="ri-search-line absolute left-2.5 top-2 text-gray-400 text-sm"></i>
          </div>
          <Button onClick={onAddKeyword} size="sm" className="p-1.5 bg-primary text-white rounded-lg hover:bg-primary-700">
            <i className="ri-add-line text-sm"></i>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <DataTable
          columns={columns}
          data={keywords}
          pagination={true}
        />
      </CardContent>
    </Card>
  );
}
