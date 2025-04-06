import React from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';

export default function MainHeader() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  const isActive = (path: string) => {
    return location === path ? 'text-primary font-medium' : 'text-slate-600 hover:text-primary';
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="bg-white border-b border-slate-200 py-4">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Link href="/">
            <a className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary to-blue-600 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-slate-800">SocialMaster</span>
            </a>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/">
            <a className={`text-sm ${isActive('/')}`}>Ana Sayfa</a>
          </Link>
          <Link href="/hakkimizda">
            <a className={`text-sm ${isActive('/hakkimizda')}`}>Hakkımızda</a>
          </Link>
          <Link href="/blog">
            <a className={`text-sm ${isActive('/blog')}`}>Blog</a>
          </Link>
          <Link href="/sss">
            <a className={`text-sm ${isActive('/sss')}`}>S.S.S.</a>
          </Link>
          <Link href="/iletisim">
            <a className={`text-sm ${isActive('/iletisim')}`}>İletişim</a>
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <a className="text-sm font-medium text-primary border border-primary rounded-lg px-4 py-2 hover:bg-primary hover:text-white transition-colors">
                  Panele Git
                </a>
              </Link>
              <button 
                onClick={handleLogout}
                className="text-sm text-slate-600 hover:text-primary"
              >
                Çıkış Yap
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link href="/auth">
                <a className="text-sm text-slate-600 hover:text-primary">Giriş Yap</a>
              </Link>
              <Link href="/auth?register=true">
                <a className="text-sm font-medium text-white bg-primary rounded-lg px-4 py-2 hover:bg-primary/90">
                  Kaydol
                </a>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}