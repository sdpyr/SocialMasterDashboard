import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/layout/Header';
import AddressBar from '@/components/layout/AddressBar';
import TabNavigation from '@/components/layout/TabNavigation';
import Sidebar from '@/components/layout/Sidebar';
import StatusBar from '@/components/layout/StatusBar';
import ContentHeader from '@/components/dashboard/ContentHeader';
import FolderGrid from '@/components/dashboard/FolderGrid';
import { BreadcrumbItem, FolderItem, FileItem, SortOption } from '@/lib/types';

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSort, setCurrentSort] = useState('folder');

  // Breadcrumbs for the current location
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Belgeler', path: '/documents' },
    { label: 'Downloads', path: '/downloads' },
    { label: 'SocialMasterDashboard', path: '/downloads/socialmasterdashboard' },
    { label: 'SocialMasterDashboard', path: '/', isActive: true }
  ];

  // Sort options for the content
  const sortOptions: SortOption[] = [
    { label: 'Klasör', value: 'folder' },
    { label: 'İsim', value: 'name' },
    { label: 'Tarih', value: 'date' },
    { label: 'Boyut', value: 'size' }
  ];

  // Fetch social accounts for display
  const { data: accounts } = useQuery({
    queryKey: ['/api/accounts'],
    select: (data) => data || []
  });

  // Create folder items
  const folders: FolderItem[] = [
    { id: '1', name: 'Hesaplar', icon: 'folder', type: 'folder', path: '/accounts' },
    { id: '2', name: 'Gönderiler', icon: 'folder', type: 'folder', path: '/posts' },
    { id: '3', name: 'Takvim', icon: 'folder', type: 'folder', path: '/calendar' },
    { id: '4', name: 'Analytics', icon: 'folder', type: 'folder', path: '/analytics' },
    { id: '5', name: 'Ayarlar', icon: 'folder', type: 'folder', path: '/settings' }
  ];

  // Create file items
  const files: FileItem[] = [
    { id: '1', name: 'Profil', icon: 'file', type: 'file', path: '/profile' },
    { id: '2', name: 'config.json', icon: 'file', type: 'config' },
    { id: '3', name: 'README.md', icon: 'file', type: 'file' },
    { id: '4', name: 'stats.js', icon: 'file', type: 'code' },
    { id: '5', name: 'theme.css', icon: 'file', type: 'file' }
  ];

  // Apply sorting
  const sortedFolders = [...folders].sort((a, b) => {
    if (currentSort === 'name') {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  const sortedFiles = [...files].sort((a, b) => {
    if (currentSort === 'name') {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  // Apply filtering if search query exists
  const filteredFolders = searchQuery 
    ? sortedFolders.filter(folder => folder.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : sortedFolders;

  const filteredFiles = searchQuery
    ? sortedFiles.filter(file => file.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : sortedFiles;

  const totalItems = filteredFolders.length + filteredFiles.length;

  return (
    <div className="windows-frame">
      <Header title="SocialMasterDashboard" />
      
      <AddressBar 
        breadcrumbs={breadcrumbs} 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <TabNavigation />
      
      <div className="flex flex-1">
        <Sidebar />
        
        <div className="flex-1 p-4">
          <ContentHeader 
            title="Belgeler kitaplığı"
            subtitle="SocialMasterDashboard"
            sortOptions={sortOptions}
            currentSort={currentSort}
            onSortChange={setCurrentSort}
          />
          
          <FolderGrid 
            folders={filteredFolders} 
            files={filteredFiles} 
          />
        </div>
      </div>
      
      <StatusBar itemCount={totalItems} />
    </div>
  );
}
