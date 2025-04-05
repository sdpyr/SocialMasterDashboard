import React from 'react';
import { SortOption } from '@/lib/types';

interface ContentHeaderProps {
  title: string;
  subtitle?: string;
  sortOptions: SortOption[];
  currentSort: string;
  onSortChange: (value: string) => void;
}

export default function ContentHeader({ 
  title, 
  subtitle, 
  sortOptions, 
  currentSort, 
  onSortChange 
}: ContentHeaderProps) {
  return (
    <div className="mb-4">
      <h1 className="text-xl font-medium">{title}</h1>
      {subtitle && <div className="text-sm text-neutral-500">{subtitle}</div>}
      
      <div className="flex justify-between items-center mt-2">
        <div>
          <span className="text-sm">Düzenleme ölçütü:</span>
          <select 
            className="text-sm border rounded ml-2 px-2 py-1"
            value={currentSort}
            onChange={(e) => onSortChange(e.target.value)}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
