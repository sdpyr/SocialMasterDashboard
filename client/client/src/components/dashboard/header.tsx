import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, Bell, HelpCircle } from "lucide-react";

export default function Header({
  toggleSidebar,
}: {
  toggleSidebar: () => void;
}) {
  const [location] = useLocation();

  const getPageTitle = (path: string): string => {
    switch (path) {
      case "/":
        return "Dashboard";
      case "/general":
        return "Genel Site Ayarları";
      case "/seo":
        return "SEO Ayarları";
      case "/language":
        return "Dil Ayarları";
      case "/pages":
        return "Sayfa Yönetimi";
      case "/blog":
        return "Blog Yönetimi";
      case "/media":
        return "Medya Yönetimi";
      case "/templates":
        return "Şablonlar";
      case "/appearance":
        return "Görünüm Ayarları";
      case "/backup":
        return "Yedekleme Yönetimi";
      case "/analytics":
        return "Site İstatistikleri";
      default:
        return "SocialMasterPanel";
    }
  };

  return (
    <header className="bg-white/70 backdrop-blur-sm border-b border-purple-100 shadow-sm z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="md:hidden text-primary hover:bg-purple-100/50"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="ml-3 text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              {getPageTitle(location)}
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="text-primary hover:bg-purple-100/50">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-primary hover:bg-purple-100/50">
              <HelpCircle className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
