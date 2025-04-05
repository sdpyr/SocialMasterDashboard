import React from 'react';
import { Link } from 'wouter';
import { 
  FileIcon, 
  ConfigIcon, 
  TwitterIcon, 
  FacebookIcon, 
  InstagramIcon, 
  LinkedInIcon, 
  YoutubeIcon 
} from '@/lib/icons';

interface FileItemProps {
  id: string;
  name: string;
  type: string;
  path?: string;
  platformIcon?: string;
}

export default function FileItem({ id, name, type, path, platformIcon }: FileItemProps) {
  const renderIcon = () => {
    if (platformIcon) {
      switch (platformIcon) {
        case 'twitter':
          return <TwitterIcon className="w-16 h-16" />;
        case 'facebook':
          return <FacebookIcon className="w-16 h-16" />;
        case 'instagram':
          return <InstagramIcon className="w-16 h-16" />;
        case 'linkedin':
          return <LinkedInIcon className="w-16 h-16" />;
        case 'youtube':
          return <YoutubeIcon className="w-16 h-16" />;
      }
    }
    
    switch (type) {
      case 'config':
        return (
          <div className="bg-primary bg-opacity-10 border border-primary rounded w-16 h-16 flex justify-center items-center mx-auto">
            <ConfigIcon className="text-primary text-2xl" />
          </div>
        );
      case 'code':
        return (
          <div className="bg-white border-2 border-neutral-300 rounded w-16 h-16 flex justify-center items-center">
            <span className="text-green-600 font-bold text-xl">$</span>
          </div>
        );
      default:
        return <FileIcon className="w-20 h-20 text-neutral-200" />;
    }
  };

  const content = (
    <div className="folder-item cursor-pointer">
      <div className="folder-icon">
        {renderIcon()}
      </div>
      <p className="folder-name">{name}</p>
    </div>
  );

  if (path) {
    return <Link to={path}>{content}</Link>;
  }

  return content;
}
