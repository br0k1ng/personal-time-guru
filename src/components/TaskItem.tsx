
import { Check, X, Flag, Bookmark, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Task, TaskPriority, TaskCategory } from "@/types/task";
import { useToast } from "@/hooks/use-toast";
import { sendDataToTelegram, isTelegramWebApp } from "@/lib/telegram";

interface TaskItemProps {
  task: Task;
  onStatusChange: (id: string, status: "completed" | "pending") => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onStatusChange, onDelete }: TaskItemProps) {
  const { toast } = useToast();

  // Функция для отображения приоритета
  const getPriorityDetails = (priority: TaskPriority) => {
    switch (priority) {
      case "high":
        return { label: "Высокий", color: "text-destructive bg-destructive/10" };
      case "medium":
        return { label: "Средний", color: "text-orange-500 bg-orange-500/10" };
      case "low":
        return { label: "Низкий", color: "text-green-500 bg-green-500/10" };
      default:
        return { label: "Средний", color: "text-orange-500 bg-orange-500/10" };
    }
  };

  // Функция для отображения категории
  const getCategoryDetails = (category: TaskCategory) => {
    switch (category) {
      case "work":
        return { label: "Работа", icon: Bookmark };
      case "home":
        return { label: "Дом", icon: Bookmark };
      case "study":
        return { label: "Учёба", icon: Bookmark };
      case "personal":
        return { label: "Личное", icon: Bookmark };
      case "other":
        return { label: "Другое", icon: Bookmark };
      default:
        return { label: "Другое", icon: Bookmark };
    }
  };

  // Обработчик изменения статуса с отправкой в Telegram
  const handleStatusChange = (id: string, status: "completed" | "pending") => {
    onStatusChange(id, status);
    
    // Если приложение запущено в Telegram, отправляем данные о изменении статуса
    if (isTelegramWebApp()) {
      sendDataToTelegram({
        type: "task_status_change",
        task: {
          id,
          title: task.title,
          status
        }
      });
    }
  };

  const priorityDetails = getPriorityDetails(task.priority);
  const categoryDetails = getCategoryDetails(task.category);
  const CategoryIcon = categoryDetails.icon;

  return (
    <Card className={task.status === "completed" ? "opacity-70" : ""}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Button 
            variant="outline" 
            size="icon" 
            className={`mt-0.5 ${task.status === "completed" ? "bg-primary/10" : ""}`} 
            onClick={() => handleStatusChange(task.id, task.status === "completed" ? "pending" : "completed")}
          >
            {task.status === "completed" ? (
              <Check className="h-4 w-4 text-primary" />
            ) : (
              <X className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
          
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <h3 className={`font-medium ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}>
                {task.title}
              </h3>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={priorityDetails.color}>
                  <Flag className="h-3 w-3 mr-1" />
                  {priorityDetails.label}
                </Badge>
                <Badge variant="outline">
                  <CategoryIcon className="h-3 w-3 mr-1" />
                  {categoryDetails.label}
                </Badge>
              </div>
            </div>
            
            {task.description && (
              <p className={`text-sm ${task.status === "completed" ? "text-muted-foreground/70" : "text-muted-foreground"}`}>
                {task.description}
              </p>
            )}
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(task.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
