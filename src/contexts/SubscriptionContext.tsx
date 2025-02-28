
import React, { createContext, useContext, useState, useEffect } from "react";
import { SubscriptionPlan, Subscription, User } from "@/types/subscription";

interface SubscriptionContextType {
  currentUser: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  hasAccess: (module: keyof Subscription["features"]) => boolean;
  updateSubscription: (plan: SubscriptionPlan, duration?: number) => void;
  applyReferralCode: (code: string) => Promise<boolean>;
  activatePromoCode: (code: string) => Promise<boolean>;
  remainingDays: number;
  referralCount: number;
  referralsNeededForReward: number;
  generateAccessCode: () => Promise<string>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

// Тестовые данные для демонстрации функциональности
const mockUser: User = {
  id: "user123",
  name: "Пользователь",
  email: "user@example.com",
  subscription: {
    plan: "free",
    expiresAt: null,
    features: {
      tasks: true,
      habits: false,
      diary: false,
      schedule: false,
      analytics: false,
      telegramNotifications: false,
      advancedStats: false
    }
  },
  referralCode: "REF123456",
  referrals: [],
  referredBy: null,
  telegramId: null
};

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Функция для проверки доступа к модулю
  const hasAccess = (module: keyof Subscription["features"]): boolean => {
    if (!currentUser) return false;
    return currentUser.subscription.features[module];
  };

  // Обновление подписки
  const updateSubscription = (plan: SubscriptionPlan, duration: number = 30) => {
    if (!currentUser) return;

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + duration);

    let features = { ...currentUser.subscription.features };

    switch (plan) {
      case "free":
        features = {
          tasks: true,
          habits: false,
          diary: false,
          schedule: false,
          analytics: false,
          telegramNotifications: false,
          advancedStats: false
        };
        break;
      case "basic":
        features = {
          tasks: true,
          habits: true,
          diary: true,
          schedule: true,
          analytics: false,
          telegramNotifications: true,
          advancedStats: false
        };
        break;
      case "pro":
        features = {
          tasks: true,
          habits: true,
          diary: true,
          schedule: true,
          analytics: true,
          telegramNotifications: true,
          advancedStats: true
        };
        break;
    }

    setCurrentUser({
      ...currentUser,
      subscription: {
        plan,
        expiresAt,
        features
      }
    });

    // В реальном приложении здесь был бы API запрос для обновления подписки на сервере
    console.log(`Subscription updated to ${plan} for ${duration} days`);
  };

  // Применение реферального кода
  const applyReferralCode = async (code: string): Promise<boolean> => {
    // В реальном приложении здесь был бы API запрос
    if (code && code !== currentUser?.referralCode) {
      console.log(`Applied referral code: ${code}`);
      return true;
    }
    return false;
  };

  // Активация промокода
  const activatePromoCode = async (code: string): Promise<boolean> => {
    // В реальном приложении здесь был бы API запрос
    if (code === "PROMO123") {
      updateSubscription("basic", 30);
      return true;
    }
    return false;
  };

  // Генерация кода доступа (для админа)
  const generateAccessCode = async (): Promise<string> => {
    // В реальном приложении здесь был бы API запрос
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    console.log(`Generated access code: ${code}`);
    return code;
  };

  // Расчет оставшихся дней подписки
  const calculateRemainingDays = (): number => {
    if (!currentUser?.subscription.expiresAt) return 0;
    
    const expireDate = new Date(currentUser.subscription.expiresAt);
    const today = new Date();
    const diffTime = expireDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };

  // Количество приглашенных пользователей
  const referralCount = currentUser?.referrals.length || 0;
  // Количество приглашений до награды
  const referralsNeededForReward = Math.max(0, 3 - referralCount);
  // Оставшиеся дни подписки
  const remainingDays = calculateRemainingDays();

  // Загрузка данных пользователя
  useEffect(() => {
    // В реальном приложении здесь был бы API запрос
    setTimeout(() => {
      setCurrentUser(mockUser);
      setIsAdmin(false); // В реальном приложении это определялось бы на основе роли пользователя
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <SubscriptionContext.Provider
      value={{
        currentUser,
        isLoading,
        isAdmin,
        hasAccess,
        updateSubscription,
        applyReferralCode,
        activatePromoCode,
        remainingDays,
        referralCount,
        referralsNeededForReward,
        generateAccessCode
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

// Хук для использования контекста подписки
export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
};
