
export type SubscriptionPlan = "free" | "basic" | "pro";

export interface Subscription {
  plan: SubscriptionPlan;
  expiresAt: Date | null;
  features: {
    tasks: boolean;
    habits: boolean;
    diary: boolean;
    schedule: boolean;
    analytics: boolean;
    telegramNotifications: boolean;
    advancedStats: boolean;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  subscription: Subscription;
  referralCode: string;
  referrals: string[];
  referredBy: string | null;
  telegramId: string | null;
}

export interface PromoCode {
  code: string;
  plan: SubscriptionPlan;
  duration: number; // Количество дней
  usedBy: string[];
  maxUses: number;
  expireAt: Date | null;
}
