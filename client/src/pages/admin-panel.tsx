import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import TabNavigation from '@/components/layout/TabNavigation';
import type { SocialAccount, User } from '@shared/schema';

// OAuth Sosyal Medya Platformları
const supportedPlatforms = [
  { id: 'facebook', name: 'Facebook', color: 'bg-blue-600', textColor: 'text-white', icon: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )},
  { id: 'twitter', name: 'Twitter (X)', color: 'bg-black', textColor: 'text-white', icon: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.162 5.656a8.384 8.384 0 0 1-2.402.658A4.196 4.196 0 0 0 21.6 4c-.82.488-1.719.83-2.656 1.015a4.182 4.182 0 0 0-7.126 3.814 11.874 11.874 0 0 1-8.62-4.37 4.168 4.168 0 0 0-.566 2.103c0 1.45.738 2.731 1.86 3.481a4.168 4.168 0 0 1-1.894-.523v.052a4.185 4.185 0 0 0 3.355 4.101 4.21 4.21 0 0 1-1.89.072A4.185 4.185 0 0 0 7.97 16.65a8.394 8.394 0 0 1-6.191 1.732 11.83 11.83 0 0 0 6.41 1.88c7.693 0 11.9-6.373 11.9-11.9 0-.18-.005-.362-.013-.54a8.496 8.496 0 0 0 2.087-2.165z" />
    </svg>
  )},
  { id: 'instagram', name: 'Instagram', color: 'bg-gradient-to-r from-pink-500 to-yellow-500', textColor: 'text-white', icon: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465.668.25 1.231.585 1.786 1.14.568.555.902 1.118 1.152 1.786.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.152 1.786c-.568.568-1.118.902-1.786 1.152-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.786-1.152 4.902 4.902 0 01-1.152-1.786c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.152-1.786A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
    </svg>
  )},
  { id: 'linkedin', name: 'LinkedIn', color: 'bg-blue-700', textColor: 'text-white', icon: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )},
  { id: 'youtube', name: 'YouTube', color: 'bg-red-600', textColor: 'text-white', icon: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )},
  { id: 'tiktok', name: 'TikTok', color: 'bg-black', textColor: 'text-white', icon: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.54 6.42a2.78 2.78 0 0 1-1.94-2C20.336 3.32 20.2 2.26 20.2 2h-5.64v16.96c0 .5-.4 1.38-.92 1.7-.5.32-1.22.36-1.8.12-.58-.22-1-.76-1.12-1.34-.12-.6 0-1.24.3-1.76.32-.52.8-.88 1.38-1 .58-.12 1.16.02 1.66.36V10.9c-.66-.14-1.34-.2-2.02-.2-2.02 0-3.86.94-5.04 2.62-1.16 1.62-1.48 3.76-.8 5.76.67 1.92 2.22 3.62 4.1 4.46 1.82.84 3.9.92 5.76.22 1.84-.7 3.32-2.18 4-4.02.2-.58.3-1.18.3-1.8V11.8a8.95 8.95 0 0 0 4.9 1.42v-5.5c-1.88.26-3.66-.7-4.4-2.3z" />
    </svg>
  )},
  { id: 'pinterest', name: 'Pinterest', color: 'bg-red-700', textColor: 'text-white', icon: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" />
    </svg>
  )},
];

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('social-connections');
  const [isAdmin, setIsAdmin] = useState(true); // Geliştirme aşamasında herkese admin yetkisi verelim
  const queryClient = useQueryClient();

  // Kullanıcıları getir
  const { data: users, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ['/api/users'],
    select: (data) => data || [],
  });

  // Sosyal hesapları getir
  const { data: accounts, isLoading: accountsLoading } = useQuery<SocialAccount[]>({
    queryKey: ['/api/accounts'],
    select: (data) => data || [],
  });

  const handleConnectPlatform = (platformId: string) => {
    // Gerçek bir uygulamada, bu burada OAuth akışını başlatır
    // Şu an için basit bir simülasyon yapıyoruz
    window.alert(`${platformId} bağlantısı başlatılıyor... Bu işlem yeni pencere açacaktır.`);
    
    // Gerçek OAuth akışı şöyle olacaktır:
    // 1. Platforma göre bir yönlendirme URL'si oluştur
    // 2. Kullanıcıyı bu URL'ye yönlendir (yeni pencere veya sekme)
    // 3. Kullanıcı platforma giriş yaptıktan sonra, callback URL'yi işle
    // 4. Token'ları alıp kaydet
    
    // Örnek:
    // window.open(`https://oauth.${platformId}.com/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code`, '_blank');
  };

  const handleRemoveConnection = (accountId: number) => {
    if (window.confirm('Bu sosyal medya bağlantısını kaldırmak istediğinizden emin misiniz?')) {
      // Gerçek bir uygulamada API'ye istek gönderilir
      window.alert('Bağlantı başarıyla kaldırıldı.');
    }
  };

  const formatDate = (dateString: string | Date | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  if (!isAdmin) {
    return (
      <div>
        <TabNavigation />
        <div className="page-header mb-8">
          <h1 className="page-title">Yönetim Paneli</h1>
          <p className="page-description">Erişim reddedildi - Bu sayfaya erişmek için yönetici yetkileri gereklidir</p>
        </div>
        <div className="card p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-10v4m5 4H7a2 2 0 01-2-2V7a2 2 0 012-2h10a2 2 0 012 2v9a2 2 0 01-2 2z" />
          </svg>
          <h2 className="mt-4 text-xl font-medium text-slate-800">Erişim Reddedildi</h2>
          <p className="mt-2 text-slate-500">Bu sayfaya erişmek için yönetici yetkileri gereklidir.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <TabNavigation />
      <div className="page-header mb-8">
        <h1 className="page-title">Yönetim Paneli</h1>
        <p className="page-description">Sosyal medya hesaplarınızı yönetin ve sistem ayarlarını yapılandırın</p>
      </div>
      
      <div className="mb-6">
        <div className="flex border-b border-slate-200">
          <button 
            onClick={() => setActiveTab('social-connections')}
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'social-connections' ? 'text-primary border-b-2 border-primary' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Sosyal Medya Bağlantıları
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'users' ? 'text-primary border-b-2 border-primary' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Kullanıcı Yönetimi
          </button>
          <button 
            onClick={() => setActiveTab('system-settings')}
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'system-settings' ? 'text-primary border-b-2 border-primary' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Sistem Ayarları
          </button>
        </div>
      </div>
      
      {activeTab === 'social-connections' && (
        <div>
          <div className="card mb-6">
            <div className="card-header">
              <h2 className="text-lg font-medium text-slate-800">Bağlı Sosyal Medya Hesapları</h2>
              <p className="text-sm text-slate-500 mt-1">Yönettiğiniz ve içerik paylaştığınız sosyal medya hesapları</p>
            </div>
            <div className="card-body">
              {accountsLoading ? (
                <div className="flex justify-center items-center h-24">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : accounts && accounts.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Platform</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Hesap Adı</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Bağlantı Tarihi</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Son Senkronizasyon</th>
                        <th className="text-right py-3 px-4 text-xs font-medium text-slate-500 uppercase">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {accounts.map(account => (
                        <tr key={account.id} className="hover:bg-slate-50/50">
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              {supportedPlatforms.find(p => p.id === account.platform.toLowerCase())?.icon || (
                                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                                  {account.platform.charAt(0).toUpperCase()}
                                </div>
                              )}
                              <span className="ml-2 font-medium text-sm">{account.platform}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm">{account.accountName}</td>
                          <td className="py-3 px-4 text-sm text-slate-500">{formatDate(account.createdAt)}</td>
                          <td className="py-3 px-4 text-sm text-slate-500">{formatDate(account.lastSync)}</td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex justify-end space-x-2">
                              <button 
                                className="btn btn-ghost btn-sm text-slate-600"
                                onClick={() => window.alert('Hesap ayarlarını düzenle')}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                </svg>
                              </button>
                              <button 
                                className="btn btn-ghost btn-sm text-slate-600"
                                onClick={() => window.alert('Son istatistikler yenileniyor...')}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                                </svg>
                              </button>
                              <button 
                                className="btn btn-ghost btn-sm text-red-600"
                                onClick={() => handleRemoveConnection(account.id)}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <h3 className="mt-2 text-base font-medium text-slate-800">Bağlı hesap bulunamadı</h3>
                  <p className="mt-1 text-sm text-slate-500">Sosyal medya hesaplarınızı bağlamak için aşağıdaki platformlardan birini seçin.</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-medium text-slate-800">Yeni Sosyal Medya Hesabı Bağla</h2>
              <p className="text-sm text-slate-500 mt-1">Platformlardan birine tıklayarak OAuth bağlantısını başlatın</p>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {supportedPlatforms.map(platform => (
                  <button
                    key={platform.id}
                    className={`flex items-center justify-center p-6 rounded-lg ${platform.color} ${platform.textColor} transition-transform hover:scale-105`}
                    onClick={() => handleConnectPlatform(platform.id)}
                  >
                    <div className="flex flex-col items-center">
                      <div className="mb-3">
                        {platform.icon}
                      </div>
                      <span className="text-sm font-medium">{platform.name} ile bağlan</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'users' && (
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-medium text-slate-800">Kullanıcı Yönetimi</h2>
            <p className="text-sm text-slate-500 mt-1">Sistemdeki kullanıcıları görüntüleyin ve yönetin</p>
          </div>
          <div className="card-body">
            {usersLoading ? (
              <div className="flex justify-center items-center h-24">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : users && users.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">ID</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Kullanıcı Adı</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Ad Soyad</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">E-posta</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Kayıt Tarihi</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase">Son Giriş</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {users.map(user => (
                      <tr key={user.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 text-sm text-slate-500">#{user.id}</td>
                        <td className="py-3 px-4 font-medium text-sm">{user.username}</td>
                        <td className="py-3 px-4 text-sm">{user.fullName || '-'}</td>
                        <td className="py-3 px-4 text-sm">{user.email}</td>
                        <td className="py-3 px-4 text-sm text-slate-500">{formatDate(user.createdAt)}</td>
                        <td className="py-3 px-4 text-sm text-slate-500">-</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <h3 className="mt-2 text-base font-medium text-slate-800">Kullanıcı bulunamadı</h3>
                <p className="mt-1 text-sm text-slate-500">Sistemde henüz kayıtlı kullanıcı bulunmamaktadır.</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {activeTab === 'system-settings' && (
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-medium text-slate-800">Sistem Ayarları</h2>
            <p className="text-sm text-slate-500 mt-1">Genel sistem ayarlarını yapılandırın</p>
          </div>
          <div className="card-body space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-md font-medium text-slate-800 mb-4">Genel Ayarlar</h3>
                <div className="space-y-4">
                  <div>
                    <label className="form-label">Site Adı</label>
                    <input type="text" className="form-input" value="SocialMasterDashboard" />
                  </div>
                  <div>
                    <label className="form-label">Varsayılan Dil</label>
                    <select className="form-select">
                      <option value="tr">Türkçe</option>
                      <option value="en">İngilizce</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Zaman Dilimi</label>
                    <select className="form-select">
                      <option value="Europe/Istanbul">İstanbul (GMT+3)</option>
                      <option value="Europe/London">Londra (GMT)</option>
                      <option value="America/New_York">New York (GMT-5)</option>
                    </select>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-md font-medium text-slate-800 mb-4">Paylaşım Ayarları</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium text-sm text-slate-800">Otomatik Paylaşım</label>
                      <p className="text-xs text-slate-500">Zamanlanmış gönderileri belirtilen zamanda otomatik olarak paylaş</p>
                    </div>
                    <div className="form-switch">
                      <input type="checkbox" className="form-checkbox" defaultChecked />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium text-sm text-slate-800">Hata Bildirimleri</label>
                      <p className="text-xs text-slate-500">Sosyal medya paylaşımı hatalarında e-posta bildirimi gönder</p>
                    </div>
                    <div className="form-switch">
                      <input type="checkbox" className="form-checkbox" defaultChecked />
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Günlük Paylaşım Limiti</label>
                    <select className="form-select">
                      <option value="5">5 gönderi</option>
                      <option value="10">10 gönderi</option>
                      <option value="20">20 gönderi</option>
                      <option value="50">50 gönderi</option>
                      <option value="0">Limitsiz</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-200">
              <h3 className="text-md font-medium text-slate-800 mb-4">OAuth Kimlik Bilgileri</h3>
              <p className="text-sm text-slate-500 mb-4">Bu bilgiler sosyal medya platformlarına bağlanmak için kullanılır.</p>
              
              <div className="space-y-4">
                {supportedPlatforms.map(platform => (
                  <div key={platform.id} className="card p-4 bg-slate-50">
                    <div className="flex items-center mb-3">
                      <div className={`w-8 h-8 rounded-full ${platform.color} ${platform.textColor} flex items-center justify-center`}>
                        {platform.icon}
                      </div>
                      <h4 className="text-sm font-medium ml-2">{platform.name} API Bilgileri</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="form-label text-xs">Client ID</label>
                        <input type="text" className="form-input text-sm" placeholder={`${platform.id}_client_id`} />
                      </div>
                      <div>
                        <label className="form-label text-xs">Client Secret</label>
                        <input type="password" className="form-input text-sm" placeholder="••••••••••••••••" />
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className="form-label text-xs">Callback URL</label>
                      <input type="text" className="form-input text-sm" readOnly value={`https://yourdomain.com/auth/${platform.id}/callback`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <button className="btn btn-primary">Ayarları Kaydet</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setUserFormData({
      username: user.username,
      password: "", // Güvenlik için boş bırakıyoruz
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      subscriptionTier: user.subscriptionTier,
    });
    setOpenUserDialog(true);
  };
  
  const handleUserSubmit = async () => {
    try {
      const userData = {
        ...userFormData,
      };
      
      let response;
      
      if (editingUser) {
        // Kullanıcıyı güncelle
        response = await apiRequest(
          "PATCH",
          `/api/users/${editingUser.id}`,
          userData
        );
        toast({
          title: "Kullanıcı Güncellendi",
          description: "Kullanıcı bilgileri başarıyla güncellendi.",
        });
      } else {
        // Yeni kullanıcı ekle
        response = await apiRequest(
          "POST", 
          "/api/users",
          userData
        );
        toast({
          title: "Kullanıcı Eklendi",
          description: "Yeni kullanıcı başarıyla eklendi.",
        });
      }
      
      // Kullanıcıları yeniden yükle
      fetchData();
      setOpenUserDialog(false);
      
    } catch (error) {
      console.error("Kullanıcı işlemi sırasında hata:", error);
      toast({
        title: "İşlem Hatası",
        description: "Kullanıcı işlemi sırasında bir hata oluştu.",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteUser = async (userId: number) => {
    if (window.confirm("Bu kullanıcıyı silmek istediğinizden emin misiniz?")) {
      try {
        await apiRequest("DELETE", `/api/users/${userId}`);
        toast({
          title: "Kullanıcı Silindi",
          description: "Kullanıcı başarıyla silindi.",
        });
        // Kullanıcıları yeniden yükle
        fetchData();
      } catch (error) {
        console.error("Kullanıcı silme sırasında hata:", error);
        toast({
          title: "Silme Hatası",
          description: "Kullanıcı silinirken bir hata oluştu.",
          variant: "destructive",
        });
      }
    }
  };

  // Admin değilse erişimi engelle
  if (!isAdmin) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Bu sayfaya erişmek için admin yetkileri gereklidir.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Paneli</h1>
      
      <Tabs defaultValue="subscription-plans">
        <TabsList className="mb-6">
          <TabsTrigger value="subscription-plans">Abonelik Planları</TabsTrigger>
          <TabsTrigger value="users">Kullanıcılar</TabsTrigger>
          <TabsTrigger value="api-keys">AI API Anahtarları</TabsTrigger>
          <TabsTrigger value="social-api-keys">Sosyal Medya API</TabsTrigger>
        </TabsList>
        
        <TabsContent value="subscription-plans">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Abonelik Planları Yönetimi</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchData}
                  disabled={loading}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Yenile
                </Button>
                <Button 
                  size="sm"
                  onClick={handleAddPlan}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Yeni Plan Ekle
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-4">
                  <RefreshCw className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Plan Adı</TableHead>
                      <TableHead>Seviye</TableHead>
                      <TableHead>Fiyat</TableHead>
                      <TableHead>Maks. Hesap</TableHead>
                      <TableHead>Maks. Gönderi</TableHead>
                      <TableHead>Durum</TableHead>
                      <TableHead>İşlemler</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscriptionPlans.map((plan) => (
                      <TableRow key={plan.id}>
                        <TableCell className="font-medium">{plan.name}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            plan.tier === "free" ? "bg-gray-100" : 
                            plan.tier === "premium" ? "bg-blue-100 text-blue-800" : 
                            "bg-purple-100 text-purple-800"
                          }`}>
                            {plan.tier === "free" ? "Ücretsiz" : 
                             plan.tier === "premium" ? "Premium" : "Ultimate"}
                          </span>
                        </TableCell>
                        <TableCell>
                          {plan.price === 0 
                            ? "Ücretsiz" 
                            : `${(plan.price / 100).toFixed(2)} ₺`}
                        </TableCell>
                        <TableCell>
                          {plan.maxAccounts === -1 ? "Sınırsız" : plan.maxAccounts}
                        </TableCell>
                        <TableCell>
                          {plan.maxPosts === -1 ? "Sınırsız" : plan.maxPosts}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            plan.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}>
                            {plan.isActive ? "Aktif" : "Pasif"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditPlan(plan)}
                            >
                              Düzenle
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDeletePlan(plan.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {subscriptionPlans.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          Abonelik planı bulunmamaktadır.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Kullanıcı Yönetimi</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchData}
                  disabled={loading}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Yenile
                </Button>
                <Button 
                  size="sm"
                  onClick={handleAddUser}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Yeni Kullanıcı Ekle
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-4">
                  <RefreshCw className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Kullanıcı Adı</TableHead>
                      <TableHead>E-posta</TableHead>
                      <TableHead>Tam Ad</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Abonelik</TableHead>
                      <TableHead>Kayıt Tarihi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.fullName}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === "admin" ? "bg-red-100 text-red-800" : "bg-gray-100"
                          }`}>
                            {user.role === "admin" ? "Admin" : "Kullanıcı"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.subscriptionTier === "free" ? "bg-gray-100" : 
                            user.subscriptionTier === "premium" ? "bg-blue-100 text-blue-800" : 
                            "bg-purple-100 text-purple-800"
                          }`}>
                            {user.subscriptionTier === "free" ? "Ücretsiz" : 
                             user.subscriptionTier === "premium" ? "Premium" : "Ultimate"}
                          </span>
                        </TableCell>
                        <TableCell>
                          {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                        </TableCell>
                      </TableRow>
                    ))}
                    {users.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          Kayıtlı kullanıcı bulunmamaktadır.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api-keys">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>AI API Anahtarları Yönetimi</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchData}
                  disabled={loading}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Yenile
                </Button>
                <Button 
                  size="sm"
                  onClick={handleAddApiKey}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Yeni API Anahtarı Ekle
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-4">
                  <RefreshCw className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>İsim</TableHead>
                      <TableHead>Servis</TableHead>
                      <TableHead>Anahtar</TableHead>
                      <TableHead>Durum</TableHead>
                      <TableHead>İşlemler</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {apiKeys.map((apiKey) => (
                      <TableRow key={apiKey.id}>
                        <TableCell className="font-medium">{apiKey.name}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            apiKey.service === "gemini" ? "bg-purple-100 text-purple-800" : 
                            apiKey.service === "openai" ? "bg-green-100 text-green-800" : 
                            apiKey.service === "stripe" ? "bg-blue-100 text-blue-800" :
                            "bg-gray-100"
                          }`}>
                            {apiKey.service === "gemini" ? "Gemini AI" : 
                             apiKey.service === "openai" ? "OpenAI" : 
                             apiKey.service === "stripe" ? "Stripe" : 
                             apiKey.service}
                          </span>
                        </TableCell>
                        <TableCell>
                          {apiKey.maskedKey || "••••••••••••••••••"}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            apiKey.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}>
                            {apiKey.isActive ? "Aktif" : "Pasif"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditApiKey(apiKey)}
                            >
                              Düzenle
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDeleteApiKey(apiKey.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {apiKeys.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          API anahtarı bulunmamaktadır.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="social-api-keys">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Sosyal Medya API Anahtarları</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchData}
                  disabled={loading}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Yenile
                </Button>
                <Button 
                  size="sm"
                  onClick={() => handleAddSocialApiKey()}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Yeni Sosyal API Ekle
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-4">
                  <RefreshCw className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Platform</TableHead>
                      <TableHead>API Anahtarı</TableHead>
                      <TableHead>API Sırrı</TableHead>
                      <TableHead>Durum</TableHead>
                      <TableHead>İşlemler</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {socialApiKeys && socialApiKeys.length > 0 ? (
                      socialApiKeys.map((apiKey) => (
                        <TableRow key={apiKey.id}>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              apiKey.platform === "instagram" ? "bg-pink-100 text-pink-800" : 
                              apiKey.platform === "facebook" ? "bg-blue-100 text-blue-800" : 
                              apiKey.platform === "twitter" ? "bg-sky-100 text-sky-800" :
                              apiKey.platform === "youtube" ? "bg-red-100 text-red-800" :
                              apiKey.platform === "tiktok" ? "bg-black text-white" :
                              apiKey.platform === "linkedin" ? "bg-blue-900 text-white" :
                              "bg-gray-100"
                            }`}>
                              {apiKey.platform === "instagram" ? "Instagram" : 
                               apiKey.platform === "facebook" ? "Facebook" : 
                               apiKey.platform === "twitter" ? "Twitter" : 
                               apiKey.platform === "youtube" ? "YouTube" :
                               apiKey.platform === "tiktok" ? "TikTok" :
                               apiKey.platform === "linkedin" ? "LinkedIn" :
                               apiKey.platform}
                            </span>
                          </TableCell>
                          <TableCell>
                            {apiKey.apiKeyMasked || "••••••••••••••••••"}
                          </TableCell>
                          <TableCell>
                            {apiKey.apiSecretMasked || "••••••••••••••••••"}
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              apiKey.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}>
                              {apiKey.isActive ? "Aktif" : "Pasif"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEditSocialApiKey(apiKey)}
                              >
                                Düzenle
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleDeleteSocialApiKey(apiKey.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          Sosyal medya API anahtarı bulunmamaktadır.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Plan ekleme/düzenleme dialog */}
      {/* Kullanıcı ekleme/düzenleme dialog */}
      <Dialog open={openUserDialog} onOpenChange={setOpenUserDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? "Kullanıcıyı Düzenle" : "Yeni Kullanıcı Ekle"}
            </DialogTitle>
            <DialogDescription>
              {editingUser 
                ? "Kullanıcı bilgilerini güncelleyin." 
                : "Yeni bir kullanıcı oluşturun."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">Kullanıcı Adı</Label>
              <Input 
                id="username" 
                name="username" 
                value={userFormData.username} 
                onChange={handleUserInputChange} 
                className="col-span-3" 
                disabled={!!editingUser}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">Şifre</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                value={userFormData.password} 
                onChange={handleUserInputChange} 
                className="col-span-3" 
                placeholder={editingUser ? "Değişmeyecekse boş bırakın" : "Şifre girin"}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">E-posta</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                value={userFormData.email} 
                onChange={handleUserInputChange} 
                className="col-span-3" 
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fullName" className="text-right">Tam Ad</Label>
              <Input 
                id="fullName" 
                name="fullName" 
                value={userFormData.fullName} 
                onChange={handleUserInputChange} 
                className="col-span-3" 
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">Rol</Label>
              <select 
                id="role" 
                name="role" 
                value={userFormData.role} 
                onChange={handleUserInputChange as any} 
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="user">Kullanıcı</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subscriptionTier" className="text-right">Abonelik</Label>
              <select 
                id="subscriptionTier" 
                name="subscriptionTier" 
                value={userFormData.subscriptionTier} 
                onChange={handleUserInputChange as any} 
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="free">Ücretsiz</option>
                <option value="premium">Premium</option>
                <option value="ultimate">Ultimate</option>
              </select>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setOpenUserDialog(false)}>
              İptal
            </Button>
            <Button type="button" onClick={handleUserSubmit}>
              {editingUser ? "Güncelle" : "Ekle"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Plan ekleme/düzenleme dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingPlan ? "Abonelik Planını Düzenle" : "Yeni Abonelik Planı Ekle"}
            </DialogTitle>
            <DialogDescription>
              {editingPlan 
                ? "Abonelik planının bilgilerini güncelleyin." 
                : "Yeni bir abonelik planı oluşturun."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Plan Adı</Label>
              <Input 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange} 
                className="col-span-3" 
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tier" className="text-right">Seviye</Label>
              <select 
                id="tier" 
                name="tier" 
                value={formData.tier} 
                onChange={handleInputChange as any} 
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="free">Ücretsiz</option>
                <option value="premium">Premium</option>
                <option value="ultimate">Ultimate</option>
              </select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">Fiyat (₺)</Label>
              <Input 
                id="price" 
                name="price" 
                type="number" 
                value={formData.price} 
                onChange={handleInputChange} 
                className="col-span-3" 
              />
              <p className="text-xs text-muted-foreground col-start-2 col-span-3">
                Fiyat kuruş cinsinden saklanır. Örn: 2999 = 29.99₺
              </p>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="maxAccounts" className="text-right">Maks. Hesap</Label>
              <Input 
                id="maxAccounts" 
                name="maxAccounts" 
                type="number" 
                value={formData.maxAccounts} 
                onChange={handleInputChange} 
                className="col-span-3" 
              />
              <p className="text-xs text-muted-foreground col-start-2 col-span-3">
                Sınırsız için -1 değerini giriniz
              </p>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="maxPosts" className="text-right">Maks. Gönderi</Label>
              <Input 
                id="maxPosts" 
                name="maxPosts" 
                type="number" 
                value={formData.maxPosts} 
                onChange={handleInputChange} 
                className="col-span-3" 
              />
              <p className="text-xs text-muted-foreground col-start-2 col-span-3">
                Sınırsız için -1 değerini giriniz
              </p>
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2">Açıklama</Label>
              <Textarea 
                id="description" 
                name="description" 
                value={formData.description} 
                onChange={handleInputChange} 
                className="col-span-3" 
              />
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="features" className="text-right pt-2">Özellikler</Label>
              <Textarea 
                id="features" 
                name="features" 
                value={formData.features} 
                onChange={handleInputChange} 
                className="col-span-3" 
              />
              <p className="text-xs text-muted-foreground col-start-2 col-span-3">
                Virgülle ayrılmış özellikler. Örn: Analitik, Çoklu hesap desteği, Yapay zeka önerileri
              </p>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isActive" className="text-right">Aktif</Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Switch 
                  id="isActive" 
                  name="isActive" 
                  checked={formData.isActive} 
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, isActive: checked }))
                  } 
                />
                <Label htmlFor="isActive" className="cursor-pointer">
                  {formData.isActive ? "Aktif" : "Pasif"}
                </Label>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setOpenDialog(false)}>
              İptal
            </Button>
            <Button type="button" onClick={handleSubmit}>
              {editingPlan ? "Güncelle" : "Ekle"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* API anahtarı ekleme/düzenleme dialog */}
      <Dialog open={openApiKeyDialog} onOpenChange={setOpenApiKeyDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingApiKey ? "API Anahtarını Düzenle" : "Yeni API Anahtarı Ekle"}
            </DialogTitle>
            <DialogDescription>
              {editingApiKey 
                ? "API anahtarının bilgilerini güncelleyin." 
                : "Yeni bir API anahtarı oluşturun."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">İsim</Label>
              <Input 
                id="name" 
                name="name" 
                value={apiKeyFormData.name} 
                onChange={handleApiKeyInputChange} 
                className="col-span-3" 
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="service" className="text-right">Servis</Label>
              <select 
                id="service" 
                name="service" 
                value={apiKeyFormData.service} 
                onChange={handleApiKeyInputChange as any} 
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="gemini">Gemini AI</option>
                <option value="openai">OpenAI</option>
                <option value="stripe">Stripe</option>
                <option value="instagram">Instagram API</option>
                <option value="instagram_secret">Instagram Secret</option>
                <option value="facebook">Facebook API</option>
                <option value="facebook_secret">Facebook Secret</option>
                <option value="twitter">Twitter API</option>
                <option value="twitter_secret">Twitter Secret</option>
                <option value="youtube">YouTube API</option>
                <option value="youtube_secret">YouTube Secret</option>
                <option value="youtube_refresh">YouTube Refresh Token</option>
                <option value="linkedin">LinkedIn API</option>
                <option value="linkedin_secret">LinkedIn Secret</option>
                <option value="tiktok">TikTok API</option>
                <option value="tiktok_secret">TikTok Secret</option>
              </select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="key" className="text-right">API Anahtarı</Label>
              <Input 
                id="key" 
                name="key" 
                type="password" 
                value={apiKeyFormData.key} 
                onChange={handleApiKeyInputChange} 
                className="col-span-3" 
                placeholder={editingApiKey ? "Değişmeyecekse boş bırakın" : "API anahtarını girin"}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isActive" className="text-right">Aktif</Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Switch 
                  id="isActive" 
                  name="isActive" 
                  checked={apiKeyFormData.isActive} 
                  onCheckedChange={(checked) => 
                    setApiKeyFormData(prev => ({ ...prev, isActive: checked }))
                  } 
                />
                <Label htmlFor="isActive" className="cursor-pointer">
                  {apiKeyFormData.isActive ? "Aktif" : "Pasif"}
                </Label>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setOpenApiKeyDialog(false)}>
              İptal
            </Button>
            <Button type="button" onClick={handleApiKeySubmit}>
              {editingApiKey ? "Güncelle" : "Ekle"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Sosyal Medya API Anahtarı Dialogu */}
      <Dialog open={openSocialApiKeyDialog} onOpenChange={setOpenSocialApiKeyDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingSocialApiKey ? "Sosyal Medya API Anahtarını Düzenle" : "Yeni Sosyal Medya API Anahtarı Ekle"}
            </DialogTitle>
            <DialogDescription>
              {editingSocialApiKey 
                ? "Sosyal medya API anahtarı bilgilerini güncelleyin." 
                : "Yeni bir sosyal medya platformu için API anahtarları oluşturun."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="platform" className="text-right">Platform</Label>
              <select 
                id="platform" 
                name="platform" 
                value={socialApiKeyFormData.platform} 
                onChange={handleSocialApiKeyInputChange as any} 
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="twitter">Twitter</option>
                <option value="youtube">YouTube</option>
                <option value="tiktok">TikTok</option>
                <option value="linkedin">LinkedIn</option>
              </select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="apiKey" className="text-right">API Anahtarı</Label>
              <Input 
                id="apiKey" 
                name="apiKey" 
                value={socialApiKeyFormData.apiKey} 
                onChange={handleSocialApiKeyInputChange as any} 
                className="col-span-3" 
                placeholder={editingSocialApiKey ? "Değişmeyecekse boş bırakın" : "API anahtarınızı girin"}
                type="password"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="apiSecret" className="text-right">API Secret</Label>
              <Input 
                id="apiSecret" 
                name="apiSecret" 
                value={socialApiKeyFormData.apiSecret} 
                onChange={handleSocialApiKeyInputChange as any} 
                className="col-span-3" 
                placeholder={editingSocialApiKey ? "Değişmeyecekse boş bırakın" : "API sır anahtarınızı girin"}
                type="password"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="socialIsActive" className="text-right">Aktif</Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Switch 
                  id="socialIsActive" 
                  name="isActive" 
                  checked={socialApiKeyFormData.isActive} 
                  onCheckedChange={(checked) => 
                    setSocialApiKeyFormData(prev => ({ ...prev, isActive: checked }))
                  } 
                />
                <Label htmlFor="socialIsActive" className="cursor-pointer">
                  {socialApiKeyFormData.isActive ? "Aktif" : "Pasif"}
                </Label>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setOpenSocialApiKeyDialog(false)}>
              İptal
            </Button>
            <Button type="button" onClick={handleSocialApiKeySubmit}>
              {editingSocialApiKey ? "Güncelle" : "Ekle"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}