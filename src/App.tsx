import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDesign } from "@/hooks/useDesign";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import Hero from "./pages/Hero";
import Gallery from "./pages/Gallery";
import ReviewSelection from "./pages/ReviewSelection";
import Finalize from "./pages/Finalize";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminUserForm from "./pages/admin/AdminUserForm";
import AdminDesign from "./pages/admin/AdminDesign";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminFeedback from "./pages/admin/AdminFeedback";
import AdminLogs from "./pages/admin/AdminLogs";
import AdminContacts from "./pages/admin/AdminContacts";
import AdminAdvanced from "./pages/admin/AdminAdvanced";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  useDesign(); // Load and apply design settings
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/hero" element={<ProtectedRoute><Hero /></ProtectedRoute>} />
        <Route path="/gallery" element={<ProtectedRoute><Gallery /></ProtectedRoute>} />
        <Route path="/review" element={<ProtectedRoute><ReviewSelection /></ProtectedRoute>} />
        <Route path="/finalize" element={<ProtectedRoute><Finalize /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute requireAdmin><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin/users/new" element={<ProtectedRoute requireAdmin><AdminUserForm /></ProtectedRoute>} />
        <Route path="/admin/users/:userId/edit" element={<ProtectedRoute requireAdmin><AdminUserForm /></ProtectedRoute>} />
        <Route path="/admin/design" element={<ProtectedRoute requireAdmin><AdminDesign /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute requireAdmin><AdminSettings /></ProtectedRoute>} />
        <Route path="/admin/feedback" element={<ProtectedRoute requireAdmin><AdminFeedback /></ProtectedRoute>} />
        <Route path="/admin/logs" element={<ProtectedRoute requireAdmin><AdminLogs /></ProtectedRoute>} />
        <Route path="/admin/contacts" element={<ProtectedRoute requireAdmin><AdminContacts /></ProtectedRoute>} />
        <Route path="/admin/advanced" element={<ProtectedRoute requireAdmin><AdminAdvanced /></ProtectedRoute>} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
