import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import TabNavigation from '@/components/layout/TabNavigation';

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch social accounts for display
  const { data: accounts } = useQuery({
    queryKey: ['/api/accounts'],
    select: (data) => data || []
  });

  // Analytics data (demo)
  const analytics = {
    followers: 12458,
    engagement: 3.2,
    posts: 186,
    views: 28950
  };

  // Upcoming posts (demo)
  const upcomingPosts = [
    { 
      id: 1, 
      title: 'Yeni ürün lansmanı', 
      platform: 'twitter', 
      scheduledFor: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      image: 'https://placehold.co/80x80/3b82f6/FFFFFF?text=YL'
    },
    { 
      id: 2, 
      title: 'Haftalık özet ve değerlendirme', 
      platform: 'linkedin', 
      scheduledFor: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      image: 'https://placehold.co/80x80/0277b5/FFFFFF?text=HÖ'
    },
    { 
      id: 3, 
      title: 'Müşteri başarı hikayesi', 
      platform: 'facebook', 
      scheduledFor: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      image: 'https://placehold.co/80x80/4267B2/FFFFFF?text=MH'
    }
  ];

  // Format date for display
  const formatDate = (date: Date) => {
    const options = { day: 'numeric', month: 'short' } as const;
    return date.toLocaleDateString('tr-TR', options);
  };

  // Get platform icon
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return (
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-blue-400 fill-current">
            <path d="M22.162 5.656a8.384 8.384 0 0 1-2.402.658A4.196 4.196 0 0 0 21.6 4c-.82.488-1.719.83-2.656 1.015a4.182 4.182 0 0 0-7.126 3.814 11.874 11.874 0 0 1-8.62-4.37 4.168 4.168 0 0 0-.566 2.103c0 1.45.738 2.731 1.86 3.481a4.168 4.168 0 0 1-1.894-.523v.052a4.185 4.185 0 0 0 3.355 4.101 4.21 4.21 0 0 1-1.89.072A4.185 4.185 0 0 0 7.97 16.65a8.394 8.394 0 0 1-6.191 1.732 11.83 11.83 0 0 0 6.41 1.88c7.693 0 11.9-6.373 11.9-11.9 0-.18-.005-.362-.013-.54a8.496 8.496 0 0 0 2.087-2.165z" />
          </svg>
        );
      case 'facebook':
        return (
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-blue-600 fill-current">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        );
      case 'linkedin':
        return (
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-blue-700 fill-current">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        );
      case 'instagram':
        return (
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-pink-600 fill-current">
            <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465.668.25 1.231.585 1.786 1.14.568.555.902 1.118 1.152 1.786.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.152 1.786c-.568.568-1.118.902-1.786 1.152-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.786-1.152 4.902 4.902 0 01-1.152-1.786c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.152-1.786A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <TabNavigation />
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-description">Sosyal medya hesaplarınızın genel durumuna bakın</p>
      </div>
      
      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="stat-card">
          <div className="flex justify-between items-start mb-2">
            <h3 className="stat-title">Toplam Takipçi</h3>
            <div className="p-1.5 rounded-full bg-blue-50 text-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
            </div>
          </div>
          <div className="stat-value">{analytics.followers.toLocaleString()}</div>
          <div className="stat-change stat-change-positive">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
            </svg>
            <span>+2.5% haftalık artış</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="flex justify-between items-start mb-2">
            <h3 className="stat-title">Etkileşim Oranı</h3>
            <div className="p-1.5 rounded-full bg-green-50 text-green-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="stat-value">{analytics.engagement}%</div>
          <div className="stat-change stat-change-positive">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
            </svg>
            <span>+0.8% artış</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="flex justify-between items-start mb-2">
            <h3 className="stat-title">Toplam Gönderi</h3>
            <div className="p-1.5 rounded-full bg-indigo-50 text-indigo-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </div>
          </div>
          <div className="stat-value">{analytics.posts}</div>
          <div className="stat-change stat-change-positive">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
            </svg>
            <span>12 yeni gönderi</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="flex justify-between items-start mb-2">
            <h3 className="stat-title">Profil Görüntülenmesi</h3>
            <div className="p-1.5 rounded-full bg-orange-50 text-orange-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="stat-value">{analytics.views.toLocaleString()}</div>
          <div className="stat-change stat-change-negative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
            </svg>
            <span>-1.2% haftalık düşüş</span>
          </div>
        </div>
      </div>
      
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-slate-800">Performans Grafiği</h3>
            <div className="flex gap-2">
              <button className="btn btn-sm btn-ghost">Günlük</button>
              <button className="btn btn-sm btn-primary">Haftalık</button>
              <button className="btn btn-sm btn-ghost">Aylık</button>
            </div>
          </div>
          
          <div className="card-body">
            <div className="h-64 flex items-center justify-center">
              <p className="text-slate-500">Buraya grafik gelecek...</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-slate-800">Yaklaşan Gönderiler</h3>
            <Link to="/schedule" className="text-primary text-sm font-medium hover:underline">
              Tümünü Gör
            </Link>
          </div>
          
          <div className="card-body p-0">
            <div className="divide-y divide-slate-100">
              {upcomingPosts.map(post => (
                <div key={post.id} className="flex items-center space-x-3 p-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-md overflow-hidden">
                    <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">
                      {post.title}
                    </p>
                    <div className="flex items-center mt-1">
                      {getPlatformIcon(post.platform)}
                      <span className="text-xs text-slate-500 ml-1">
                        {formatDate(post.scheduledFor)}
                      </span>
                    </div>
                  </div>
                  
                  <button className="btn btn-ghost btn-sm p-1 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="card-footer">
            <button className="btn btn-primary w-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Yeni Gönderi Planla
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-8 grid gap-6 md:grid-cols-5">
        <div className="md:col-span-3 card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-slate-800">Son Gönderiler</h3>
            <div className="flex space-x-2">
              <button className="btn btn-outline btn-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                </svg>
                Filtrele
              </button>
              <button className="btn btn-outline btn-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
                </svg>
                Sırala
              </button>
            </div>
          </div>
          
          <div className="card-body">
            <div className="min-h-[200px] flex items-center justify-center">
              <p className="text-slate-500">Buraya gönderiler gelecek...</p>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2 card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-slate-800">Popüler Hashtagler</h3>
            <div>
              <select className="form-select text-sm py-1">
                <option>Bu hafta</option>
                <option>Bu ay</option>
                <option>Son 3 ay</option>
              </select>
            </div>
          </div>
          
          <div className="card-body">
            <div className="min-h-[200px] flex items-center justify-center">
              <p className="text-slate-500">Buraya hashtag analizi gelecek...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
