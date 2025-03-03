
import React, { createContext, useContext, useState, useEffect } from "react";
import { Bell } from "lucide-react";

type LanguageType = "ru";

// Объект локализации для всего приложения
export const translations = {
  ru: {
    common: {
      tasks: "Задачи",
      habits: "Привычки",
      diary: "Дневник",
      schedule: "Расписание",
      analytics: "Аналитика",
      settings: "Настройки",
      save: "Сохранить",
      cancel: "Отмена",
      delete: "Удалить",
      edit: "Редактировать",
      create: "Создать",
      notFound: "Страница не найдена",
      back: "Назад",
      loading: "Загрузка...",
      language: "Язык",
      add: "Добавить",
      title: "Название",
      description: "Описание",
      noData: "Нет данных",
      completed: "Выполнено",
      pending: "В ожидании",
      menu: "Меню",
      today: "Сегодня",
      profile: "Профиль"
    },
    subscription: {
      freePlan: "Бесплатный план",
      basicPlan: "Базовый план",
      proPlan: "Pro план",
      features: "Функции",
      upgrade: "Улучшить",
      current: "Текущий план",
      subscribe: "Подписаться",
      taskModule: "Модуль задач",
      habitModule: "Модуль привычек",
      diaryModule: "Модуль дневника",
      scheduleModule: "Модуль расписания",
      analyticsModule: "Модуль аналитики",
      telegramNotifications: "Уведомления в Telegram",
      advancedStats: "Расширенная статистика",
      referral: "Партнерская программа",
      referralDescription: "Приведите 3 человек и получите бесплатную подписку на месяц",
      yourReferralCode: "Ваш реферальный код",
      copy: "Копировать",
      share: "Поделиться",
      invitedUsers: "Приглашенных пользователей",
      remainingToReward: "Осталось до награды",
      accessCode: "Код доступа",
      activateCode: "Активировать код",
      remainingDays: "Осталось дней подписки",
      manageUsers: "Управление пользователями",
      giveAccess: "Выдать доступ",
      archiveSettings: "Настройки архива",
      archiveInfo: "Выполненные задачи хранятся в списке 7 дней, затем перемещаются в архив, где хранятся еще 30 дней."
    },
    tasks: {
      addTask: "Добавить задачу",
      title: "Название задачи",
      description: "Описание задачи",
      priority: "Приоритет",
      category: "Категория",
      dueDate: "Срок выполнения",
      highPriority: "Высокий",
      mediumPriority: "Средний",
      lowPriority: "Низкий",
      workCategory: "Работа",
      homeCategory: "Дом",
      studyCategory: "Учеба",
      personalCategory: "Личное",
      otherCategory: "Другое",
      completedTasks: "Выполненные задачи",
      pendingTasks: "Активные задачи",
      archive: "Архив задач",
      noTasks: "Нет задач",
      allTasks: "Все задачи",
      todayTasks: "Задачи на сегодня",
      createTask: "Создать задачу",
      editTask: "Редактировать задачу",
      deleteTask: "Удалить задачу",
      confirmDelete: "Вы уверены, что хотите удалить эту задачу?"
    }
  }
};

interface LanguageContextType {
  currentLanguage: LanguageType;
  setLanguage: (lang: LanguageType) => void;
  t: (section: keyof typeof translations.ru, key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Всегда используем русский
  const [currentLanguage, setCurrentLanguage] = useState<LanguageType>("ru");

  // Функция для изменения языка (оставлена для совместимости)
  const setLanguage = (lang: LanguageType) => {
    setCurrentLanguage(lang);
    localStorage.setItem("language", lang);
  };

  // Функция для получения переводов
  const t = (section: keyof typeof translations.ru, key: string): string => {
    // @ts-ignore - Динамический доступ к ключам
    return translations[currentLanguage][section]?.[key] || `${key}`;
  };

  // Установка языка при загрузке
  useEffect(() => {
    document.documentElement.setAttribute('lang', currentLanguage);
  }, [currentLanguage]);

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Хук для использования языковых настроек
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
