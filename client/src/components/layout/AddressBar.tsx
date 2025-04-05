import React from 'react';
import { BreadcrumbItem } from '../../lib/types';

interface AddressBarProps {
  breadcrumbs: BreadcrumbItem[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export default function AddressBar({ breadcrumbs, searchQuery, onSearchChange }: AddressBarProps) {
  return (
    <div className="windows-addressbar">
      <div className="flex items-center space-x-2 mr-4">
        <button className="text-neutral-600 hover:bg-neutral-200 rounded p-1" aria-label="Back">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path
              fillRule="evenodd"
              d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <button className="text-neutral-600 hover:bg-neutral-200 rounded p-1" aria-label="Forward">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path
              fillRule="evenodd"
              d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <button className="text-neutral-600 hover:bg-neutral-200 rounded p-1" aria-label="Up">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path
              fillRule="evenodd"
              d="M11.47 7.72a.75.75 0 011.06 0l7.5 7.5a.75.75 0 11-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 01-1.06-1.06l7.5-7.5z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      <div className="flex-1 flex items-center text-sm">
        {breadcrumbs.map((item, index) => (
          <div key={index} className="flex items-center">
            {index > 0 && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="mx-1 text-neutral-400 w-3 h-3"
              >
                <path
                  fillRule="evenodd"
                  d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <span className={item.isActive ? "font-medium" : "text-neutral-500"}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center ml-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Ara: SocialMasterDashboard"
            className="border border-neutral-300 rounded px-2 py-1 w-64 text-sm"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-neutral-500"
            aria-label="Search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path
                fillRule="evenodd"
                d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
