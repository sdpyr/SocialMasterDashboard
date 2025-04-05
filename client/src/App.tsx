import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";

// Layout Components
import Header from "@/components/layout/Header";

// Pages
import Dashboard from "@/pages/Dashboard";
import AccountsPage from "@/pages/AccountsPage";
import PostsPage from "@/pages/PostsPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import SettingsPage from "@/pages/SettingsPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
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
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
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
