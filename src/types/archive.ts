
import { Task } from "./task";

export interface ArchivedTask extends Task {
  archivedAt: Date;
}

export interface ArchiveSettings {
  keepCompletedTasksDays: number; // Сколько дней хранить выполненные задачи в общем списке
  keepArchivedTasksDays: number; // Сколько дней хранить задачи в архиве
}
