import React from 'react';
import { Link, useLocation } from 'wouter';
import { NavigationItem } from '@/lib/types';
import { 
  TwitterIcon, 
  FacebookIcon, 
  InstagramIcon, 
  LinkedInIcon, 
  YoutubeIcon,
  AnalyticsIcon,
  SettingsIcon
} from '@/lib/icons';

export default function Sidebar() {
  const [location] = useLocation();

  const navigationItems: NavigationItem[] = [
    {
      icon: "star",
      label: "Genel Bakış",
      items: [
        {
          icon: "desktop",
          label: "Dashboard",
          path: "/",
          isActive: location === "/"
        }
      ]
    },
    {
      icon: "accounts",
      label: "Sosyal Hesaplar",
      items: [
        {
          icon: "twitter",
          label: "Twitter",
          path: "/accounts/twitter",
          isActive: location === "/accounts/twitter"
        },
        {
          icon: "facebook",
          label: "Facebook",
          path: "/accounts/facebook",
          isActive: location === "/accounts/facebook"
        },
        {
          icon: "instagram",
          label: "Instagram",
          path: "/accounts/instagram",
          isActive: location === "/accounts/instagram"
        },
        {
          icon: "linkedin",
          label: "LinkedIn",
          path: "/accounts/linkedin",
          isActive: location === "/accounts/linkedin"
        },
        {
          icon: "youtube",
          label: "YouTube",
          path: "/accounts/youtube",
          isActive: location === "/accounts/youtube"
        }
      ]
    },
    {
      icon: "posts",
      label: "İçerik Yönetimi",
      items: [
        {
          icon: "posts",
          label: "Gönderiler",
          path: "/posts",
          isActive: location === "/posts"
        },
        {
          icon: "schedule",
          label: "Zamanlama",
          path: "/schedule",
          isActive: location === "/schedule"
        },
        {
          icon: "drafts",
          label: "Taslaklar",
          path: "/drafts",
          isActive: location === "/drafts"
        }
      ]
    },
    {
      icon: "analytics",
      label: "Analitik",
      path: "/analytics",
      isActive: location === "/analytics"
    },
    {
      icon: "settings",
      label: "Ayarlar",
      path: "/settings",
      isActive: location === "/settings"
    },
    {
      icon: "admin",
      label: "Yönetim Paneli",
      path: "/admin",
      isActive: location === "/admin"
    }
  ];

  const renderIcon = (icon: string) => {
    switch (icon) {
      case "star":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-500 mr-3">
            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
          </svg>
        );
      case "desktop":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-slate-600 mr-3">
            <path fillRule="evenodd" d="M2.25 5.25a3 3 0 013-3h13.5a3 3 0 013 3V15a3 3 0 01-3 3h-3v.257c0 .597.237 1.17.659 1.591l.621.622a.75.75 0 01-.53 1.28h-9a.75.75 0 01-.53-1.28l.621-.622a2.25 2.25 0 00.659-1.59V18h-3a3 3 0 01-3-3V5.25zm1.5 0v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5z" clipRule="evenodd" />
          </svg>
        );
      case "accounts":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-slate-600 mr-3">
            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
          </svg>
        );
      case "twitter":
        return <TwitterIcon className="w-5 h-5 text-blue-400 mr-3" />;
      case "facebook":
        return <FacebookIcon className="w-5 h-5 text-blue-600 mr-3" />;
      case "instagram":
        return <InstagramIcon className="w-5 h-5 text-pink-600 mr-3" />;
      case "linkedin":
        return <LinkedInIcon className="w-5 h-5 text-blue-700 mr-3" />;
      case "youtube":
        return <YoutubeIcon className="w-5 h-5 text-red-600 mr-3" />;
      case "posts":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-slate-600 mr-3">
            <path fillRule="evenodd" d="M4.125 3C3.089 3 2.25 3.84 2.25 4.875V18a3 3 0 003 3h15a3 3 0 01-3-3V4.875C17.25 3.839 16.41 3 15.375 3H4.125zM12 9.75a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H12zm-.75-2.25a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5H12a.75.75 0 01-.75-.75zM6 12.75a.75.75 0 000 1.5h7.5a.75.75 0 000-1.5H6zm-.75 3.75a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5H6a.75.75 0 01-.75-.75zM6 6.75a.75.75 0 00-.75.75v.75c0 .414.336.75.75.75h3a.75.75 0 00.75-.75v-.75a.75.75 0 00-.75-.75H6z" clipRule="evenodd" />
            <path d="M18.75 6.75h1.875c.621 0 1.125.504 1.125 1.125V18a1.5 1.5 0 01-3 0V6.75z" />
          </svg>
        );
      case "schedule":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-slate-600 mr-3">
            <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
          </svg>
        );
      case "drafts":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-slate-600 mr-3">
            <path fillRule="evenodd" d="M5.625 1.5H9a3.75 3.75 0 013.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 013.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 01-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875zM9.75 17.25a.75.75 0 00-1.5 0V18a.75.75 0 001.5 0v-.75zm2.25-3a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3a.75.75 0 01.75-.75zm3.75-1.5a.75.75 0 00-1.5 0V18a.75.75 0 001.5 0v-5.25z" clipRule="evenodd" />
          </svg>
        );
      case "analytics":
        return <AnalyticsIcon className="w-5 h-5 text-slate-600 mr-3" />;
      case "settings":
        return <SettingsIcon className="w-5 h-5 text-slate-600 mr-3" />;
      case "admin":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-purple-600 mr-3">
            <path fillRule="evenodd" d="M11.828 2.25c-.916 0-1.699.663-1.85 1.567l-.091.549a.798.798 0 01-.517.608 7.45 7.45 0 00-.478.198.798.798 0 01-.796-.064l-.453-.324a1.875 1.875 0 00-2.416.2l-.243.243a1.875 1.875 0 00-.2 2.416l.324.453a.798.798 0 01.064.796 7.448 7.448 0 00-.198.478.798.798 0 01-.608.517l-.55.092a1.875 1.875 0 00-1.566 1.849v.344c0 .916.663 1.699 1.567 1.85l.549.091c.281.047.508.25.608.517.06.162.127.321.198.478a.798.798 0 01-.064.796l-.324.453a1.875 1.875 0 00.2 2.416l.243.243c.648.648 1.67.733 2.416.2l.453-.324a.798.798 0 01.796-.064c.157.071.316.137.478.198.267.1.47.327.517.608l.092.55c.15.903.932 1.566 1.849 1.566h.344c.916 0 1.699-.663 1.85-1.567l.091-.549a.798.798 0 01.517-.608 7.52 7.52 0 00.478-.198.798.798 0 01.796.064l.453.324a1.875 1.875 0 002.416-.2l.243-.243c.648-.648.733-1.67.2-2.416l-.324-.453a.798.798 0 01-.064-.796c.071-.157.137-.316.198-.478.1-.267.327-.47.608-.517l.55-.091a1.875 1.875 0 001.566-1.85v-.344c0-.916-.663-1.699-1.567-1.85l-.549-.091a.798.798 0 01-.608-.517 7.507 7.507 0 00-.198-.478.798.798 0 01.064-.796l.324-.453a1.875 1.875 0 00-.2-2.416l-.243-.243a1.875 1.875 0 00-2.416-.2l-.453.324a.798.798 0 01-.796.064 7.462 7.462 0 00-.478-.198.798.798 0 01-.517-.608l-.091-.55a1.875 1.875 0 00-1.85-1.566h-.344zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-slate-600 mr-3">
            <path fillRule="evenodd" d="M5.478 5.559A1.5 1.5 0 016.912 4.5H9A.75.75 0 009 3H6.912a3 3 0 00-2.868 2.118l-2.411 7.838a3 3 0 00-.133.882V18a3 3 0 003 3h15a3 3 0 003-3v-4.162c0-.299-.045-.596-.133-.882l-2.412-7.838A3 3 0 0017.088 3H15a.75.75 0 000 1.5h2.088a1.5 1.5 0 011.434 1.059l2.213 7.191H17.89a3 3 0 00-2.684 1.658l-.256.513a1.5 1.5 0 01-1.342.829h-3.218a1.5 1.5 0 01-1.342-.83l-.256-.512a3 3 0 00-2.684-1.658H3.265l2.213-7.191z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v6.44l1.72-1.72a.75.75 0 111.06 1.06l-3 3a.75.75 0 01-1.06 0l-3-3a.75.75 0 011.06-1.06l1.72 1.72V3a.75.75 0 01.75-.75z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center mr-3">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            className="w-6 h-6 text-primary"
          >
            <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75c-1.036 0-1.875-.84-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75c-1.036 0-1.875-.84-1.875-1.875v-6.75z" />
          </svg>
        </div>
        <div>
          <h2 className="font-semibold text-slate-800 text-lg">SocialMaster</h2>
          <p className="text-xs text-slate-500">Dashboard v1.0</p>
        </div>
      </div>
      
      <div className="px-3 py-4 flex-1 overflow-y-auto">
        {navigationItems.map((item, index) => (
          <div key={index} className="sidebar-section mb-6">
            <div className="sidebar-header">{item.label}</div>
            
            {item.items ? (
              <div className="space-y-1">
                {item.items.map((subItem, subIndex) => (
                  <Link key={subIndex} to={subItem.path || "#"}>
                    <div className={`sidebar-item ${subItem.isActive ? 'active' : ''}`}>
                      {renderIcon(subItem.icon)}
                      <span>{subItem.label}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <Link to={item.path || "#"}>
                <div className={`sidebar-item ${item.isActive ? 'active' : ''}`}>
                  {renderIcon(item.icon)}
                  <span>{item.label}</span>
                </div>
              </Link>
            )}
          </div>
        ))}
      </div>
      
      <div className="border-t border-slate-200 p-4">
        <div className="flex items-center p-2 rounded-md hover:bg-slate-100 transition-colors cursor-pointer">
          <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-medium mr-3">
            DK
          </div>
          <div>
            <p className="text-sm font-medium text-slate-800">Demo Kullanıcı</p>
            <p className="text-xs text-slate-500">demo@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
