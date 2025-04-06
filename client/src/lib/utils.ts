import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getAvatarFallback(name: string): string {
  if (!name) return "SM";
  
  const nameParts = name.split(" ");
  if (nameParts.length === 1) {
    return name.substring(0, 2).toUpperCase();
  }
  
  return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`.toUpperCase();
}
