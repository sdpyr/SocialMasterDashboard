import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import {
  BarChart3,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Users,
  FileText,
  Calendar,
  ChevronDown,
  ChevronRight,
  Globe,
  LayoutGrid,
  BookOpen,
  PanelRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export default function Sidebar() {
  const [location] = useLocation();
  const [openMenus, setOpenMenus] = useState({
    social: true,
    settings: false,
    admin: false,
  });

  const toggleMenu = (menu: keyof typeof openMenus) => {
    setOpenMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  interface NavItemProps {
    href?: string;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    active?: boolean;
    onClick?: () => void;
  }

  const NavItem = ({ href, icon: Icon, label, active = false, onClick }: NavItemProps) => (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start gap-2 font-normal",
        active ? "bg-muted font-medium" : "hover:bg-muted/50"
      )}
      asChild={!onClick}
      onClick={onClick}
    >
      {onClick ? (
        <div className="flex items-center">
          {Icon && <Icon className="h-4 w-4" />}
          <span>{label}</span>
          {label.toLowerCase() === 'social' && (
            openMenus.social ? 
            <ChevronDown className="ml-auto h-4 w-4" /> : 
            <ChevronRight className="ml-auto h-4 w-4" />
          )}
          {label.toLowerCase() === 'settings' && (
            openMenus.settings ? 
            <ChevronDown className="ml-auto h-4 w-4" /> : 
            <ChevronRight className="ml-auto h-4 w-4" />
          )}
          {label.toLowerCase() === 'admin' && (
            openMenus.admin ? 
            <ChevronDown className="ml-auto h-4 w-4" /> : 
            <ChevronRight className="ml-auto h-4 w-4" />
          )}
        </div>
      ) : (
        <Link href={href || "/"}>
          <div className="flex items-center">
            {Icon && <Icon className="h-4 w-4" />}
            <span>{label}</span>
          </div>
        </Link>
      )}
    </Button>
  );

  return (
    <div className="w-64 h-screen flex flex-col border-r bg-card">
      <div className="h-16 flex items-center px-6 border-b">
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Social Master
        </h1>
      </div>

      <ScrollArea className="flex-1 p-3">
        <div className="space-y-1">
          <NavItem 
            href="/dashboard" 
            icon={LayoutDashboard} 
            label="Dashboard" 
            active={location === "/dashboard"} 
          />
          
          <NavItem 
            icon={Users} 
            label="Social" 
            active={openMenus.social} 
            onClick={() => toggleMenu('social')} 
          />

          {openMenus.social && (
            <div className="ml-4 space-y-1 pt-1">
              <NavItem 
                href="/accounts" 
                icon={Users} 
                label="Hesaplar" 
                active={location === "/accounts"} 
              />
              <NavItem 
                href="/posts" 
                icon={FileText} 
                label="Paylaşımlar" 
                active={location === "/posts"}
              />
              <NavItem 
                href="/analytics" 
                icon={BarChart3} 
                label="Analitik" 
                active={location === "/analytics"}
              />
              <NavItem 
                href="/messages" 
                icon={MessageSquare} 
                label="Mesajlar" 
                active={location === "/messages"}
              />
              <NavItem 
                href="/calendar" 
                icon={Calendar} 
                label="Takvim" 
                active={location === "/calendar"}
              />
            </div>
          )}

          <NavItem 
            icon={Settings} 
            label="Settings" 
            active={openMenus.settings} 
            onClick={() => toggleMenu('settings')} 
          />

          {openMenus.settings && (
            <div className="ml-4 space-y-1 pt-1">
              <NavItem 
                href="/settings/general" 
                icon={Settings} 
                label="Genel" 
                active={location === "/settings/general"}
              />
              <NavItem 
                href="/settings/language" 
                icon={Globe} 
                label="Dil" 
                active={location === "/settings/language"}
              />
              <NavItem 
                href="/settings/appearance" 
                icon={LayoutGrid} 
                label="Görünüm" 
                active={location === "/settings/appearance"}
              />
            </div>
          )}
          
          <NavItem 
            icon={PanelRight} 
            label="Admin" 
            active={openMenus.admin} 
            onClick={() => toggleMenu('admin')} 
          />

          {openMenus.admin && (
            <div className="ml-4 space-y-1 pt-1">
              <NavItem 
                href="/admin-panel-new" 
                icon={PanelRight} 
                label="Admin Panel" 
                active={location === "/admin-panel-new"}
              />
              <NavItem 
                href="/blog" 
                icon={BookOpen} 
                label="Blog" 
                active={location === "/blog"}
              />
              <NavItem 
                href="/backup" 
                icon={FileText} 
                label="Yedekleme" 
                active={location === "/backup"}
              />
            </div>
          )}
        </div>

        <Separator className="my-4" />

        <div className="p-4 rounded-lg bg-muted/50">
          <h4 className="mb-2 text-sm font-medium">Sosyal Master Pro</h4>
          <p className="mb-3 text-xs text-muted-foreground">
            Daha fazla özelliğe erişmek için Pro sürüme yükseltin!
          </p>
          <Button size="sm" className="w-full text-xs">Şimdi Yükselt</Button>
        </div>
      </ScrollArea>
    </div>
  );
}