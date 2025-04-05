import React from 'react';
import { Link } from 'wouter';
import { FolderIcon } from '@/lib/icons';

interface FolderItemProps {
  id: string;
  name: string;
  path: string;
}

export default function FolderItem({ id, name, path }: FolderItemProps) {
  return (
    <Link to={path}>
      <div className="folder-item cursor-pointer">
        <div className="folder-icon">
          <FolderIcon className="w-20 h-20 text-yellow-400" />
        </div>
        <p className="folder-name">{name}</p>
      </div>
    </Link>
  );
}
