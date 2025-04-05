import React from 'react';
import FolderItem from './FolderItem';
import FileItem from './FileItem';
import { FolderItem as FolderItemType, FileItem as FileItemType } from '@/lib/types';

interface FolderGridProps {
  folders: FolderItemType[];
  files: FileItemType[];
}

export default function FolderGrid({ folders, files }: FolderGridProps) {
  return (
    <div>
      {folders.length > 0 && (
        <div className="folder-grid">
          {folders.map((folder) => (
            <FolderItem
              key={folder.id}
              id={folder.id}
              name={folder.name}
              path={folder.path || `/folder/${folder.id}`}
            />
          ))}
        </div>
      )}

      {files.length > 0 && (
        <div className="folder-grid folder-section">
          {files.map((file) => (
            <FileItem
              key={file.id}
              id={file.id}
              name={file.name}
              type={file.type}
              path={file.path}
            />
          ))}
        </div>
      )}
    </div>
  );
}
