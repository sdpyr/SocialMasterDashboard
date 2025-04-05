import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import TabNavigation from '@/components/layout/TabNavigation';
import { SortOption } from '@/lib/types';
import type { Post, SocialAccount } from '@shared/schema';

export default function PostsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSort, setCurrentSort] = useState('date');
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Sort options for the content
  const sortOptions: SortOption[] = [
    { label: 'Tarih', value: 'date' },
    { label: 'Platform', value: 'platform' },
    { label: 'Durum', value: 'status' }
  ];

  // Fetch social accounts
  const { data: accounts } = useQuery<SocialAccount[]>({
    queryKey: ['/api/accounts'],
    select: (data) => data || []
  });

  // Fetch posts for the selected account
  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ['/api/accounts', selectedAccountId, 'posts'],
    queryFn: async () => {
      if (!selectedAccountId) return [];
      const res = await fetch(`/api/accounts/${selectedAccountId}/posts`);
      if (!res.ok) throw new Error('Failed to fetch posts');
      return res.json();
    },
    enabled: !!selectedAccountId
  });

  // Function to format date
  const formatDate = (date: Date | string | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('tr-TR');
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    let bgColor, textColor;
    switch (status) {
      case 'published':
        bgColor = 'bg-emerald-100';
        textColor = 'text-emerald-800';
        break;
      case 'scheduled':
        bgColor = 'bg-blue-100';
        textColor = 'text-blue-800';
        break;
      case 'draft':
        bgColor = 'bg-amber-100';
        textColor = 'text-amber-800';
        break;
      case 'failed':
        bgColor = 'bg-red-100';
        textColor = 'text-red-800';
        break;
      default:
        bgColor = 'bg-slate-100';
        textColor = 'text-slate-800';
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${bgColor} ${textColor}`}>
        {status === 'published' ? 'Yayınlandı' : 
         status === 'scheduled' ? 'Zamanlandı' : 
         status === 'draft' ? 'Taslak' : 
         status === 'failed' ? 'Başarısız' : status}
      </span>
    );
  };

  // Filter and sort posts
  const filteredAndSortedPosts = () => {
    if (!posts) return [];
    
    // First filter by search query
    let filtered = posts.filter(post => 
      post.content?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      post.platform?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    // Then filter by status if not 'all'
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(post => post.status === selectedStatus);
    }
    
    // Apply sorting
    return [...filtered].sort((a, b) => {
      if (currentSort === 'date') {
        const dateA = a.status === 'published' ? new Date(a.publishedAt || 0).getTime() :
                      a.status === 'scheduled' ? new Date(a.scheduledFor || 0).getTime() :
                      new Date(a.createdAt || 0).getTime();
        const dateB = b.status === 'published' ? new Date(b.publishedAt || 0).getTime() :
                      b.status === 'scheduled' ? new Date(b.scheduledFor || 0).getTime() :
                      new Date(b.createdAt || 0).getTime();
        return dateB - dateA; // Most recent first
      } else if (currentSort === 'platform') {
        return (a.platform || '').localeCompare(b.platform || '');
      } else if (currentSort === 'status') {
        return (a.status || '').localeCompare(b.status || '');
      }
      return 0;
    });
  };
  
  // Platform icon component
  const PlatformIcon = ({ platform }: { platform: string }) => {
    const iconClasses = "w-5 h-5";
    
    switch (platform.toLowerCase()) {
      case 'twitter':
        return (
          <svg className={`${iconClasses} text-blue-400`} viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.162 5.656a8.384 8.384 0 0 1-2.402.658A4.196 4.196 0 0 0 21.6 4c-.82.488-1.719.83-2.656 1.015a4.182 4.182 0 0 0-7.126 3.814 11.874 11.874 0 0 1-8.62-4.37 4.168 4.168 0 0 0-.566 2.103c0 1.45.738 2.731 1.86 3.481a4.168 4.168 0 0 1-1.894-.523v.052a4.185 4.185 0 0 0 3.355 4.101 4.21 4.21 0 0 1-1.89.072A4.185 4.185 0 0 0 7.97 16.65a8.394 8.394 0 0 1-6.191 1.732 11.83 11.83 0 0 0 6.41 1.88c7.693 0 11.9-6.373 11.9-11.9 0-.18-.005-.362-.013-.54a8.496 8.496 0 0 0 2.087-2.165z" />
          </svg>
        );
      case 'facebook':
        return (
          <svg className={`${iconClasses} text-blue-600`} viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        );
      case 'instagram':
        return (
          <svg className={`${iconClasses} text-pink-600`} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465.668.25 1.231.585 1.786 1.14.568.555.902 1.118 1.152 1.786.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.152 1.786c-.568.568-1.118.902-1.786 1.152-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.786-1.152 4.902 4.902 0 01-1.152-1.786c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.152-1.786A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
          </svg>
        );
      case 'linkedin':
        return (
          <svg className={`${iconClasses} text-blue-700`} viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        );
      default:
        return (
          <svg className={`${iconClasses} text-slate-400`} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
          </svg>
        );
    }
  };

  const filteredPosts = filteredAndSortedPosts();

  return (
    <div>
      <TabNavigation />
      
      <div className="page-header mb-8">
        <h1 className="page-title">Gönderiler</h1>
        <p className="page-description">Sosyal medya gönderilerinizi yönetin ve zamanlamasını ayarlayın</p>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div>
            <label className="form-label">Sosyal Medya Hesabı</label>
            <select 
              className="form-select w-64"
              value={selectedAccountId || ''}
              onChange={(e) => setSelectedAccountId(Number(e.target.value) || null)}
            >
              <option value="">Tüm hesaplar</option>
              {accounts?.map(account => (
                <option key={account.id} value={account.id}>
                  {account.platform} - {account.accountName}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="form-label">Duruma Göre Filtrele</label>
            <select 
              className="form-select w-36"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">Tümünü Göster</option>
              <option value="published">Yayınlandı</option>
              <option value="scheduled">Zamanlandı</option>
              <option value="draft">Taslak</option>
              <option value="failed">Başarısız</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <input
              type="search"
              placeholder="Gönderi ara..."
              className="form-input pl-10 pr-4 py-2 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400"
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          
          <button className="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Yeni Gönderi
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : selectedAccountId && posts ? (
        <>
          {filteredPosts.length === 0 ? (
            <div className="card py-16">
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h3 className="mt-4 text-xl font-medium text-slate-800">Gönderi bulunamadı</h3>
                <p className="mt-2 text-slate-500 max-w-md mx-auto">Arama kriterlerinize uygun gönderi bulunamadı veya henüz gönderi eklenmemiş.</p>
                <div className="mt-6">
                  <button className="btn btn-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Yeni Gönderi
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">İçerik</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Platform</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Durum</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tarih</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Etkileşim</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredPosts.map((post) => (
                      <tr key={post.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-4">
                          <div className="max-w-xs truncate text-sm font-medium text-slate-700">{post.content}</div>
                          {post.mediaUrls && post.mediaUrls.length > 0 && (
                            <div className="text-xs text-slate-500 mt-1">
                              <span className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                </svg>
                                Medya içeriği
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <PlatformIcon platform={post.platform || ''} />
                            <span className="ml-2 text-sm text-slate-700">{post.platform}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <StatusBadge status={post.status} />
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-500">
                          {post.status === 'published' ? (
                            <div>
                              <div>{formatDate(post.publishedAt)}</div>
                              <div className="text-xs text-slate-400">Yayınlandı</div>
                            </div>
                          ) : post.status === 'scheduled' ? (
                            <div>
                              <div>{formatDate(post.scheduledFor)}</div>
                              <div className="text-xs text-slate-400">Zamanlandı</div>
                            </div>
                          ) : (
                            <div>
                              <div>{formatDate(post.createdAt)}</div>
                              <div className="text-xs text-slate-400">Oluşturuldu</div>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {post.engagement ? (
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center">
                                <svg className="h-4 w-4 text-blue-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                                </svg>
                                <span className="text-sm font-medium">{(post.engagement as any).likes || 0}</span>
                              </div>
                              <div className="flex items-center">
                                <svg className="h-4 w-4 text-green-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm font-medium">{(post.engagement as any).comments || 0}</span>
                              </div>
                              <div className="flex items-center">
                                <svg className="h-4 w-4 text-amber-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                                </svg>
                                <span className="text-sm font-medium">{(post.engagement as any).shares || 0}</span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-slate-400">Veri yok</span>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            {post.status === 'draft' && (
                              <button className="btn btn-sm btn-ghost text-slate-600">
                                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                              </button>
                            )}
                            {post.status !== 'published' && (
                              <button className="btn btn-sm btn-ghost text-blue-600">
                                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                </svg>
                              </button>
                            )}
                            <button className="btn btn-sm btn-ghost text-slate-600">
                              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          <div className="mt-4 flex justify-between items-center text-sm text-slate-500">
            <div>
              Toplam {filteredPosts.length} gönderi gösteriliyor
            </div>
            <div className="flex items-center space-x-1">
              <button className="px-3 py-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <button className="px-3 py-1 rounded border border-slate-200 bg-primary text-white">1</button>
              <button className="px-3 py-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-50">2</button>
              <button className="px-3 py-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="card py-16">
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="mt-4 text-xl font-medium text-slate-800">Gönderileri görüntülemek için bir hesap seçin</h3>
            <p className="mt-2 text-slate-500 max-w-md mx-auto">Sosyal medya hesaplarınızın gönderilerini yönetmek ve zamanlamak için bir hesap seçin.</p>
            <div className="mt-6">
              <select 
                className="form-select w-64 mx-auto"
                value={selectedAccountId || ''}
                onChange={(e) => setSelectedAccountId(Number(e.target.value) || null)}
              >
                <option value="">Hesap seçin</option>
                {accounts?.map(account => (
                  <option key={account.id} value={account.id}>
                    {account.platform} - {account.accountName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
