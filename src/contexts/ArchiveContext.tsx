
import React, { createContext, useContext, useState, useEffect } from "react";
import { ArchivedTask, ArchiveSettings } from "@/types/archive";
import { Task } from "@/types/task";

interface ArchiveContextType {
  archivedTasks: ArchivedTask[];
  archiveSettings: ArchiveSettings;
  updateArchiveSettings: (settings: Partial<ArchiveSettings>) => void;
  archiveTask: (task: Task) => void;
  deleteArchivedTask: (id: string) => void;
  restoreTask: (id: string) => Task | null;
}

const ArchiveContext = createContext<ArchiveContextType | undefined>(undefined);

export const ArchiveProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [archivedTasks, setArchivedTasks] = useState<ArchivedTask[]>([]);
  const [archiveSettings, setArchiveSettings] = useState<ArchiveSettings>({
    keepCompletedTasksDays: 7, // Выполненные задачи хранятся в списке 7 дней
    keepArchivedTasksDays: 30  // В архиве задачи хранятся 30 дней
  });

  // Обновление настроек архива
  const updateArchiveSettings = (settings: Partial<ArchiveSettings>) => {
    setArchiveSettings({ ...archiveSettings, ...settings });
    // В реальном приложении здесь был бы API запрос для сохранения настроек
  };

  // Архивация задачи
  const archiveTask = (task: Task) => {
    const archivedTask: ArchivedTask = {
      ...task,
      archivedAt: new Date()
    };
    setArchivedTasks(prev => [...prev, archivedTask]);
    // В реальном приложении здесь был бы API запрос
  };

  // Удаление задачи из архива
  const deleteArchivedTask = (id: string) => {
    setArchivedTasks(prev => prev.filter(task => task.id !== id));
    // В реальном приложении здесь был бы API запрос
  };

  // Восстановление задачи из архива
  const restoreTask = (id: string): Task | null => {
    const task = archivedTasks.find(task => task.id === id);
    if (!task) return null;
    
    setArchivedTasks(prev => prev.filter(t => t.id !== id));
    // В реальном приложении здесь был бы API запрос
    
    // Возвращаем задачу без поля archivedAt
    const { archivedAt, ...restoredTask } = task;
    return restoredTask as Task;
  };

  // Автоматическая очистка устаревших задач в архиве
  useEffect(() => {
    const cleanupArchivedTasks = () => {
      const now = new Date();
      setArchivedTasks(prev => 
        prev.filter(task => {
          const archivedDate = new Date(task.archivedAt);
          const diffDays = Math.floor((now.getTime() - archivedDate.getTime()) / (1000 * 60 * 60 * 24));
          return diffDays <= archiveSettings.keepArchivedTasksDays;
        })
      );
    };

    // Запускаем очистку при монтировании и когда меняются настройки архива
    cleanupArchivedTasks();
    // В реальном приложении эта функция запускалась бы по расписанию на сервере
  }, [archiveSettings]);

  return (
    <ArchiveContext.Provider
      value={{
        archivedTasks,
        archiveSettings,
        updateArchiveSettings,
        archiveTask,
        deleteArchivedTask,
        restoreTask
      }}
    >
      {children}
    </ArchiveContext.Provider>
  );
};

// Хук для использования контекста архива
export const useArchive = () => {
  const context = useContext(ArchiveContext);
  if (context === undefined) {
    throw new Error("useArchive must be used within an ArchiveProvider");
  }
  return context;
};
