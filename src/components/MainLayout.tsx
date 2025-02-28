
import { useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { initTelegramWebApp, isTelegramWebApp } from "@/lib/telegram";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isTelegramApp, setIsTelegramApp] = useState(false);
  
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
  }, []);
  
  return (
    <div className="flex min-h-screen bg-background">
      <div className="sidebar">
        <Sidebar />
      </div>
      <main className="flex-1 p-4 md:p-6 main-content">
        {children}
      </main>
    </div>
  );
}
