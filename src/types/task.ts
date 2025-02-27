
export type TaskPriority = "low" | "medium" | "high";
export type TaskStatus = "pending" | "completed" | "postponed";
export type TaskCategory = "work" | "home" | "study" | "personal" | "other";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  category: TaskCategory;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
}

export type CreateTaskData = Omit<Task, "id" | "status" | "createdAt" | "updatedAt">;
