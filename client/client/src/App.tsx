import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Suspense, lazy } from "react";
import { Loader2 } from "lucide-react";

// Providers 
import { AuthProvider, useAuth } from "@/hooks/use-auth";

// Lazy-loaded pages
const NotFound = lazy(() => import("@/pages/not-found"));
const AuthPage = lazy(() => import("@/pages/auth-page"));
const DashboardPage = lazy(() => import("@/pages/dashboard-page"));
const GeneralSettingsPage = lazy(() => import("@/pages/general-settings-page"));
const SeoSettingsPage = lazy(() => import("@/pages/seo-settings-page"));
const LanguageSettingsPage = lazy(() => import("@/pages/language-settings-page"));
const PagesPage = lazy(() => import("@/pages/pages-page"));
const BlogPage = lazy(() => import("@/pages/blog-page"));
const MediaPage = lazy(() => import("@/pages/media-page"));
const TemplatesPage = lazy(() => import("@/pages/templates-page"));
const AppearancePage = lazy(() => import("@/pages/appearance-page"));
const BackupPage = lazy(() => import("@/pages/backup-page"));
const AnalyticsPage = lazy(() => import("@/pages/analytics-page"));
const AdminPanelPage = lazy(() => import("@/pages/admin-panel"));

// Sosyal Medya Yönetimi Sayfaları
const PlatformDetailPage = lazy(() => import("@/pages/social-media/platform-detail"));
const SocialAnalyticsPage = lazy(() => import("@/pages/social-media/analytics"));
const CommentAnalysisPage = lazy(() => import("@/pages/social-media/comment-analysis"));
const ContentCalendarPage = lazy(() => import("@/pages/social-media/content-calendar"));
const ContentGenerationPage = lazy(() => import("@/pages/social-media/content-generation"));
const CreatePostPage = lazy(() => import("@/pages/social-media/create-post"));

// Loading component
const LoadingPage = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
      <p className="text-gray-500 font-medium">Yükleniyor...</p>
    </div>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ path, component: Component }: { path: string, component: React.ComponentType }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Route path={path}>
        <LoadingPage />
      </Route>
    );
  }

  if (!user) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  return <Route path={path} component={Component} />;
};

// Admin Role Route Component
const AdminRoute = ({ path, component: Component }: { path: string, component: React.ComponentType }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Route path={path}>
        <LoadingPage />
      </Route>
    );
  }

  if (!user) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  if (user.role !== "admin") {
    return (
      <Route path={path}>
        <Redirect to="/accounts" />
      </Route>
    );
  }

  return <Route path={path} component={Component} />;
};

function Router() {
  const { user, isLoading } = useAuth();

  // Ana sayfaya erişildiğinde kullanıcı rolüne göre yönlendirme yapacağız
  const HomeRedirect = () => {
    if (isLoading) return <LoadingPage />;
    if (!user) return <Redirect to="/auth" />;
    
    // Admin kullanıcısı ise dashboard'a, normal kullanıcı ise sosyal medya sayfasına yönlendir
    if (user.role === "admin") {
      return <Redirect to="/dashboard" />;
    } else {
      return <Redirect to="/accounts" />;
    }
  };

  return (
    <Suspense fallback={<LoadingPage />}>
      <Switch>
        {/* Ana sayfa yönlendirmesi */}
        <Route path="/" component={HomeRedirect} />
        
        {/* Admin paneli ve dashboard sayfaları */}
        <AdminRoute path="/dashboard" component={DashboardPage} />
        <AdminRoute path="/admin-panel" component={AdminPanelPage} />
        
        {/* Sosyal Medya Yönetimi Rotaları - Tüm kullanıcılar erişebilir */}
        <ProtectedRoute path="/accounts" component={PlatformDetailPage} />
        <ProtectedRoute path="/icerik-takvimi" component={ContentCalendarPage} />
        <ProtectedRoute path="/analizler" component={SocialAnalyticsPage} />
        <ProtectedRoute path="/yorum-analizi" component={CommentAnalysisPage} />
        <ProtectedRoute path="/icerik-uretimi" component={ContentGenerationPage} />
        <ProtectedRoute path="/icerik-olustur" component={CreatePostPage} />
        <ProtectedRoute path="/platform/:platform" component={PlatformDetailPage} />
        
        {/* Aşağıdaki sayfalar sadece admin kullanıcılar için */}
        {/* Genel Site Ayarları Rotaları */}
        <AdminRoute path="/general" component={GeneralSettingsPage} />
        <AdminRoute path="/seo" component={SeoSettingsPage} />
        <AdminRoute path="/language" component={LanguageSettingsPage} />
        
        {/* İçerik Yönetimi Rotaları */}
        <AdminRoute path="/pages" component={PagesPage} />
        <AdminRoute path="/blog" component={BlogPage} />
        <AdminRoute path="/media" component={MediaPage} />
        
        {/* Tasarım Yönetimi Rotaları */}
        <AdminRoute path="/templates" component={TemplatesPage} />
        <AdminRoute path="/appearance" component={AppearancePage} />
        
        {/* Sistem Araçları Rotaları */}
        <AdminRoute path="/backup" component={BackupPage} />
        <AdminRoute path="/analytics" component={AnalyticsPage} />
        
        <Route path="/auth">
          {user ? (user.role === "admin" ? <Redirect to="/dashboard" /> : <Redirect to="/accounts" />) : <AuthPage />}
        </Route>
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
