
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Archive, Search, ArrowLeft, RefreshCw, Calendar } from "lucide-react";
import { useArchive } from "@/contexts/ArchiveContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

export default function TaskArchive() {
  const { archivedTasks, restoreTask, deleteArchivedTask } = useArchive();
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState("");
  
  // Фильтрация задач по поисковому запросу
  const filteredTasks = archivedTasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Сортировка задач по дате архивации (сначала новые)
  const sortedTasks = [...filteredTasks].sort((a, b) => 
    new Date(b.archivedAt).getTime() - new Date(a.archivedAt).getTime()
  );

  // Восстановление задачи из архива
  const handleRestoreTask = (id: string) => {
    const restoredTask = restoreTask(id);
    
    if (restoredTask) {
      toast({
        title: "Задача восстановлена",
        description: "Задача успешно восстановлена из архива",
      });
    }
  };

  // Удаление задачи из архива
  const handleDeleteTask = (id: string) => {
    deleteArchivedTask(id);
    
    toast({
      title: "Задача удалена",
      description: "Задача окончательно удалена из архива",
    });
  };

  // Функция для отображения приоритета
  const getPriorityDetails = (priority: string) => {
    switch (priority) {
      case "high":
        return { label: t("tasks", "highPriority"), color: "text-destructive bg-destructive/10" };
      case "medium":
        return { label: t("tasks", "mediumPriority"), color: "text-orange-500 bg-orange-500/10" };
      case "low":
        return { label: t("tasks", "lowPriority"), color: "text-green-500 bg-green-500/10" };
      default:
        return { label: t("tasks", "mediumPriority"), color: "text-orange-500 bg-orange-500/10" };
    }
  };

  // Функция для отображения категории
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "work": return t("tasks", "workCategory");
      case "home": return t("tasks", "homeCategory");
      case "study": return t("tasks", "studyCategory");
      case "personal": return t("tasks", "personalCategory");
      case "other": return t("tasks", "otherCategory");
      default: return t("tasks", "otherCategory");
    }
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => navigate("/tasks")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold ml-2">{t("tasks", "archive")}</h1>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Archive className="h-5 w-5 text-muted-foreground" />
            <CardTitle>{t("tasks", "archive")}</CardTitle>
          </div>
          <CardDescription>
            Архивированные задачи хранятся 30 дней, после чего автоматически удаляются
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск в архиве..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {sortedTasks.length > 0 ? (
            <div className="space-y-4">
              {sortedTasks.map((task) => (
                <Card key={task.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{task.title}</h3>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={getPriorityDetails(task.priority).color}>
                              {getPriorityDetails(task.priority).label}
                            </Badge>
                            <Badge variant="outline">
                              {getCategoryLabel(task.category)}
                            </Badge>
                          </div>
                        </div>
                        
                        {task.description && (
                          <p className="text-sm text-muted-foreground">
                            {task.description}
                          </p>
                        )}
                        
                        <div className="flex items-center text-xs text-muted-foreground mt-2">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          Архивировано: {format(new Date(task.archivedAt), "dd.MM.yyyy")}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-muted-foreground"
                          onClick={() => handleRestoreTask(task.id)}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          <Archive className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              <Archive className="h-10 w-10 mx-auto mb-3 opacity-20" />
              <p>Архив пуст</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
