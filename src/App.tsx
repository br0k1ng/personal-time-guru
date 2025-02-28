
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "./components/MainLayout";
import Diary from "./pages/Diary";
import Tasks from "./pages/Tasks";
import Schedule from "./pages/Schedule";
import Habits from "./pages/Habits";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import TaskArchive from "./pages/TaskArchive";
import NotFound from "./pages/NotFound";
import { LanguageProvider } from "./contexts/LanguageContext";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import { ArchiveProvider } from "./contexts/ArchiveContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <SubscriptionProvider>
        <ArchiveProvider>
          <TooltipProvider>
            <BrowserRouter>
              <MainLayout>
                <Routes>
                  <Route path="/" element={<Navigate to="/diary" replace />} />
                  <Route path="/diary" element={<Diary />} />
                  <Route path="/tasks" element={<Tasks />} />
                  <Route path="/tasks/archive" element={<TaskArchive />} />
                  <Route path="/schedule" element={<Schedule />} />
                  <Route path="/habits" element={<Habits />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </MainLayout>
            </BrowserRouter>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </ArchiveProvider>
      </SubscriptionProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
