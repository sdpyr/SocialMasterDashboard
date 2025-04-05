import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";

// Layout Components
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

// Pages
import Dashboard from "@/pages/Dashboard";
import AccountsPage from "@/pages/AccountsPage";
import PostsPage from "@/pages/PostsPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import SettingsPage from "@/pages/SettingsPage";
import AdminPanel from "@/pages/admin-panel-new";
import NotFound from "@/pages/not-found";

// Main Layout Component
function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  
  // Get page title based on current route
  const getPageTitle = () => {
    if (location === "/") return "Dashboard";
    if (location.startsWith("/accounts")) return "Sosyal Hesaplar";
    if (location.startsWith("/posts")) return "Gönderiler";
    if (location.startsWith("/schedule")) return "Zamanlama";
    if (location.startsWith("/drafts")) return "Taslaklar";
    if (location.startsWith("/analytics")) return "Analitik";
    if (location.startsWith("/settings")) return "Ayarlar";
    return "SocialMaster";
  };

  return (
    <div className="flex h-screen w-full bg-slate-50">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header title={getPageTitle()} />
        
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Layout>
      <Switch>
        {/* Dashboard */}
        <Route path="/" component={Dashboard} />
        
        {/* Social Accounts */}
        <Route path="/accounts" component={AccountsPage} />
        <Route path="/accounts/:platform" component={AccountsPage} />
        <Route path="/accounts/:id" component={AccountsPage} />
        
        {/* Content Management */}
        <Route path="/posts" component={PostsPage} />
        <Route path="/schedule" component={PostsPage} />
        <Route path="/drafts" component={PostsPage} />
        
        {/* Analytics */}
        <Route path="/analytics" component={AnalyticsPage} />
        
        {/* Settings */}
        <Route path="/settings" component={SettingsPage} />
        
        {/* Admin Panel */}
        <Route path="/admin" component={AdminPanel} />
        
        {/* Fallback to 404 */}
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
