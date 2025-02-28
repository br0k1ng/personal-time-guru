
// Типы данных для объекта WebApp в Telegram
declare global {
  interface Window {
    Telegram: {
      WebApp: {
        ready: () => void;
        showAlert: (message: string) => void;
        showConfirm: (message: string) => void;
        sendData: (data: string) => void;
        expand: () => void;
        close: () => void;
        isExpanded: boolean;
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
          };
        };
      };
    };
  }
}

// Проверка, запущено ли приложение внутри Telegram
export const isTelegramWebApp = (): boolean => {
  return window.Telegram !== undefined && window.Telegram.WebApp !== undefined;
};

// Получение данных пользователя Telegram
export const getTelegramUser = () => {
  if (!isTelegramWebApp()) return null;
  return window.Telegram.WebApp.initDataUnsafe.user;
};

// Показать уведомление в Telegram
export const showTelegramAlert = (message: string) => {
  if (!isTelegramWebApp()) {
    alert(message);
    return;
  }
  window.Telegram.WebApp.showAlert(message);
};

// Отправить данные в Telegram бот
export const sendDataToTelegram = (data: any) => {
  if (!isTelegramWebApp()) {
    console.log('Данные для отправки в Telegram:', data);
    return;
  }
  window.Telegram.WebApp.sendData(JSON.stringify(data));
};

// Инициализация WebApp
export const initTelegramWebApp = () => {
  if (!isTelegramWebApp()) return;
  
  // Сообщаем Telegram, что приложение готово
  window.Telegram.WebApp.ready();
  
  // Расширяем приложение на весь экран
  window.Telegram.WebApp.expand();
};
