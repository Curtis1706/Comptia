import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Comptabilite from "./pages/Comptabilite.tsx";
import Facturation from "./pages/Facturation.tsx";
import TVA from "./pages/TVA.tsx";
import Reporting from "./pages/Reporting.tsx";
import Documents from "./pages/Documents.tsx";
import Paie from "./pages/Paie.tsx";
import Parametres from "./pages/Parametres.tsx";
import { AppShell } from "./components/layout/AppShell.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppShell><Index /></AppShell>} />
          <Route path="/comptabilite" element={<AppShell><Comptabilite /></AppShell>} />
          <Route path="/comptabilite/:section" element={<AppShell><Comptabilite /></AppShell>} />
          <Route path="/facturation" element={<AppShell><Facturation /></AppShell>} />
          <Route path="/tva" element={<AppShell><TVA /></AppShell>} />
          <Route path="/reporting" element={<AppShell><Reporting /></AppShell>} />
          <Route path="/documents" element={<AppShell><Documents /></AppShell>} />
          <Route path="/paie" element={<AppShell><Paie /></AppShell>} />
          <Route path="/parametres" element={<AppShell><Parametres /></AppShell>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
