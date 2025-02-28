
export type EventFrequency = "once" | "daily" | "weekly" | "monthly";
export type ReminderTime = "15min" | "1hour" | "1day" | "none";

export interface ScheduleEvent {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  frequency: EventFrequency;
  reminder: ReminderTime;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateEventData = Omit<ScheduleEvent, "id" | "createdAt" | "updatedAt">;
