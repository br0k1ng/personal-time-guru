
import { useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { initTelegramWebApp, isTelegramWebApp } from "@/lib/telegram";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Navigate, useLocation } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { LockKeyhole, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useMobile } from "@/hooks/use-mobile";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isTelegramApp, setIsTelegramApp] = useState(false);
  const { t, currentLanguage } = useLanguage();
  const { hasAccess } = useSubscription();
  const location = useLocation();
  const isMobile = useMobile();
  
  useEffect(() => {
    // Проверяем, запущено ли приложение в Telegram
    const telegramApp = isTelegramWebApp();
    setIsTelegramApp(telegramApp);
    
    if (telegramApp) {
      // Инициализируем Telegram WebApp
      initTelegramWebApp();
      // Добавляем класс для стилизации
      document.body.classList.add('telegram-app');
    }
    
    // Устанавливаем язык документа
    document.documentElement.setAttribute('lang', currentLanguage);
  }, [currentLanguage]);
  
  // Проверка доступа к модулю на основе пути
  const checkAccess = () => {
    const path = location.pathname;
    
    if (path.startsWith("/tasks") || path === "/settings" || path === "/support") {
      // Доступ к задачам, настройкам и поддержке есть всегда
      return true;
    }
    
    if (path.startsWith("/diary")) {
      return hasAccess("diary");
    }
    
    if (path.startsWith("/habits")) {
      return hasAccess("habits");
    }
    
    if (path.startsWith("/schedule")) {
      return hasAccess("schedule");
    }
    
    if (path.startsWith("/analytics")) {
      return hasAccess("analytics");
    }
    
    return true;
  };
  
  const hasModuleAccess = checkAccess();
  
  return (
    <div className="flex min-h-screen bg-background">
      {isMobile ? (
        <>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="fixed top-4 left-4 z-40 md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <Sidebar />
            </SheetContent>
          </Sheet>
          <main className="flex-1 p-4 md:p-6 pt-16 w-full">
            {hasModuleAccess ? (
              children
            ) : (
              <div className="max-w-md mx-auto mt-16">
                <Alert className="bg-yellow-50 border-yellow-200">
                  <LockKeyhole className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    Этот модуль доступен только в платной версии.
                  </AlertDescription>
                </Alert>
                <div className="mt-6 flex justify-center">
                  <Button onClick={() => <Navigate to="/settings" replace />}>
                    Перейти к настройкам подписки
                  </Button>
                </div>
              </div>
            )}
          </main>
        </>
      ) : (
        <>
          <div className="sidebar hidden md:block">
            <Sidebar />
          </div>
          <main className="flex-1 p-4 md:p-6 main-content">
            {hasModuleAccess ? (
              children
            ) : (
              <div className="max-w-md mx-auto mt-16">
                <Alert className="bg-yellow-50 border-yellow-200">
                  <LockKeyhole className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    Этот модуль доступен только в платной версии.
                  </AlertDescription>
                </Alert>
                <div className="mt-6 flex justify-center">
                  <Button onClick={() => <Navigate to="/settings" replace />}>
                    Перейти к настройкам подписки
                  </Button>
                </div>
              </div>
            )}
          </main>
        </>
      )}
    </div>
  );
}
