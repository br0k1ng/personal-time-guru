
import React, { createContext, useContext, useState, useEffect } from "react";

type LanguageType = "ru" | "en" | "zh";

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
      today: "Сегодня"
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
  },
  en: {
    common: {
      tasks: "Tasks",
      habits: "Habits",
      diary: "Diary",
      schedule: "Schedule",
      analytics: "Analytics",
      settings: "Settings",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      create: "Create",
      notFound: "Page Not Found",
      back: "Back",
      loading: "Loading...",
      language: "Language",
      add: "Add",
      title: "Title",
      description: "Description",
      noData: "No data",
      completed: "Completed",
      pending: "Pending",
      menu: "Menu",
      today: "Today"
    },
    subscription: {
      freePlan: "Free Plan",
      basicPlan: "Basic Plan",
      proPlan: "Pro Plan",
      features: "Features",
      upgrade: "Upgrade",
      current: "Current Plan",
      subscribe: "Subscribe",
      taskModule: "Task Module",
      habitModule: "Habit Module",
      diaryModule: "Diary Module",
      scheduleModule: "Schedule Module",
      analyticsModule: "Analytics Module",
      telegramNotifications: "Telegram Notifications",
      advancedStats: "Advanced Statistics",
      referral: "Referral Program",
      referralDescription: "Bring 3 people and get a free one-month subscription",
      yourReferralCode: "Your referral code",
      copy: "Copy",
      share: "Share",
      invitedUsers: "Invited users",
      remainingToReward: "Remaining until reward",
      accessCode: "Access code",
      activateCode: "Activate code",
      remainingDays: "Subscription days remaining",
      manageUsers: "Manage users",
      giveAccess: "Give access",
      archiveSettings: "Archive settings",
      archiveInfo: "Completed tasks are stored in the list for 7 days, then moved to the archive where they are stored for another 30 days."
    },
    tasks: {
      addTask: "Add task",
      title: "Task title",
      description: "Task description",
      priority: "Priority",
      category: "Category",
      dueDate: "Due date",
      highPriority: "High",
      mediumPriority: "Medium",
      lowPriority: "Low",
      workCategory: "Work",
      homeCategory: "Home",
      studyCategory: "Study",
      personalCategory: "Personal",
      otherCategory: "Other",
      completedTasks: "Completed tasks",
      pendingTasks: "Pending tasks",
      archive: "Task archive",
      noTasks: "No tasks",
      allTasks: "All tasks",
      todayTasks: "Today's tasks",
      createTask: "Create task",
      editTask: "Edit task",
      deleteTask: "Delete task",
      confirmDelete: "Are you sure you want to delete this task?"
    }
  },
  zh: {
    common: {
      tasks: "任务",
      habits: "习惯",
      diary: "日记",
      schedule: "日程",
      analytics: "分析",
      settings: "设置",
      save: "保存",
      cancel: "取消",
      delete: "删除",
      edit: "编辑",
      create: "创建",
      notFound: "页面未找到",
      back: "返回",
      loading: "加载中...",
      language: "语言",
      add: "添加",
      title: "标题",
      description: "描述",
      noData: "没有数据",
      completed: "已完成",
      pending: "待处理",
      menu: "菜单",
      today: "今天"
    },
    subscription: {
      freePlan: "免费计划",
      basicPlan: "基本计划",
      proPlan: "专业计划",
      features: "功能",
      upgrade: "升级",
      current: "当前计划",
      subscribe: "订阅",
      taskModule: "任务模块",
      habitModule: "习惯模块",
      diaryModule: "日记模块",
      scheduleModule: "日程模块",
      analyticsModule: "分析模块",
      telegramNotifications: "Telegram 通知",
      advancedStats: "高级统计",
      referral: "推荐计划",
      referralDescription: "带来 3 人可获得一个月免费订阅",
      yourReferralCode: "您的推荐码",
      copy: "复制",
      share: "分享",
      invitedUsers: "已邀请用户",
      remainingToReward: "距离奖励还剩",
      accessCode: "访问码",
      activateCode: "激活码",
      remainingDays: "剩余订阅天数",
      manageUsers: "管理用户",
      giveAccess: "授予访问权限",
      archiveSettings: "存档设置",
      archiveInfo: "已完成的任务在列表中保存 7 天，然后移至存档，在那里再保存 30 天。"
    },
    tasks: {
      addTask: "添加任务",
      title: "任务标题",
      description: "任务描述",
      priority: "优先级",
      category: "分类",
      dueDate: "截止日期",
      highPriority: "高",
      mediumPriority: "中",
      lowPriority: "低",
      workCategory: "工作",
      homeCategory: "家庭",
      studyCategory: "学习",
      personalCategory: "个人",
      otherCategory: "其他",
      completedTasks: "已完成任务",
      pendingTasks: "待处理任务",
      archive: "任务存档",
      noTasks: "没有任务",
      allTasks: "所有任务",
      todayTasks: "今日任务",
      createTask: "创建任务",
      editTask: "编辑任务",
      deleteTask: "删除任务",
      confirmDelete: "您确定要删除此任务吗？"
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
  // Получение языка из localStorage или использование русского по умолчанию
  const [currentLanguage, setCurrentLanguage] = useState<LanguageType>(() => {
    const savedLanguage = localStorage.getItem("language") as LanguageType;
    return savedLanguage || "ru";
  });

  // Функция для изменения языка
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
