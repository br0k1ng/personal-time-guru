
export type HabitFrequency = "daily" | "weekly" | "monthly";
export type HabitCategory = "health" | "productivity" | "learning" | "personal" | "other";

export interface HabitCompletion {
  date: string; // ISO формат
  completed: boolean;
}

export interface Habit {
  id: string;
  name: string;
  description: string;
  frequency: HabitFrequency;
  category: HabitCategory;
  streak: number;
  completions: HabitCompletion[];
  createdAt: Date;
  updatedAt: Date;
}

export type CreateHabitData = Omit<Habit, "id" | "streak" | "completions" | "createdAt" | "updatedAt">;
