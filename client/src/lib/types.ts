export interface BreadcrumbItem {
  label: string;
  path: string;
  isActive?: boolean;
}

export interface NavigationItem {
  icon: string;
  label: string;
  path?: string;
  isActive?: boolean;
  items?: NavigationItem[];
}

export interface FolderItem {
  id: string;
  name: string;
  icon: string;
  type: 'folder';
  path?: string;
}

export interface FileItem {
  id: string;
  name: string;
  icon: string;
  type: 'file';
  extension?: string;
  path?: string;
}

export type ExplorerItem = FolderItem | FileItem;

export interface SocialPlatform {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export enum PostStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  PUBLISHED = 'published',
  FAILED = 'failed'
}

export interface SortOption {
  label: string;
  value: string;
}

export interface ViewMode {
  label: string;
  value: string;
  icon: string;
}
