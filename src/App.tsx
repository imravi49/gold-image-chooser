import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Hero from "./pages/Hero";
import Gallery from "./pages/Gallery";
import ReviewSelection from "./pages/ReviewSelection";
import Finalize from "./pages/Finalize";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminDesign from "./pages/admin/AdminDesign";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminFeedback from "./pages/admin/AdminFeedback";
import AdminLogs from "./pages/admin/AdminLogs";
import AdminContacts from "./pages/admin/AdminContacts";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/hero" element={<Hero />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/review" element={<ReviewSelection />} />
          <Route path="/finalize" element={<Finalize />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/design" element={<AdminDesign />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/feedback" element={<AdminFeedback />} />
          <Route path="/admin/logs" element={<AdminLogs />} />
          <Route path="/admin/contacts" element={<AdminContacts />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
