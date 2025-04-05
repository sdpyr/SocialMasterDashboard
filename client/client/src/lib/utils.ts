import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { TIME_INTERVALS } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export function formatDateRelative(date: Date | string): string {
  const now = new Date();
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const diffMs = now.getTime() - dateObj.getTime();
  
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSecs < 60) {
    return 'şimdi';
  } else if (diffMins < 60) {
    return `${diffMins} dakika önce`;
  } else if (diffHours < 24) {
    return `${diffHours} saat önce`;
  } else if (diffDays < 7) {
    return `${diffDays} gün önce`;
  } else {
    return dateObj.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short'
    });
  }
}

export function formatTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleTimeString('tr-TR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

export function getDateRangeFromInterval(interval: string): { startDate: Date, endDate: Date } {
  const endDate = new Date();
  let startDate = new Date();
  
  switch (interval) {
    case 'last7days':
      startDate.setDate(endDate.getDate() - 7);
      break;
    case 'last14days':
      startDate.setDate(endDate.getDate() - 14);
      break;
    case 'last30days':
      startDate.setDate(endDate.getDate() - 30);
      break;
    case 'last90days':
      startDate.setDate(endDate.getDate() - 90);
      break;
    case 'thisMonth':
      startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
      break;
    case 'lastMonth':
      startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 1, 1);
      endDate.setDate(0);
      break;
    case 'thisYear':
      startDate = new Date(endDate.getFullYear(), 0, 1);
      break;
    default:
      startDate.setDate(endDate.getDate() - 7);
  }
  
  return { startDate, endDate };
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

export function getAvatarFallback(name: string): string {
  if (!name) return 'U';
  
  const parts = name.split(' ');
  if (parts.length === 1) {
    return name.charAt(0).toUpperCase();
  }
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function getContrastColor(hexColor: string): 'black' | 'white' {
  // Convert hex to RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return black for bright colors, white for dark ones
  return luminance > 0.5 ? 'black' : 'white';
}

export function getCurrentInterval(): string {
  return TIME_INTERVALS[0].value; // Default to 'Son 7 Gün'
}
