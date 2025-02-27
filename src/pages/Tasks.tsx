
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TaskForm } from "@/components/tasks/TaskForm";
import { TaskItem } from "@/components/tasks/TaskItem";
import { Task, CreateTaskData, TaskStatus } from "@/types/task";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "completed">("all");
  const { toast } = useToast();

  const handleCreateTask = (data: CreateTaskData) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      ...data,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setTasks((prev) => [newTask, ...prev]);
    
    toast({
      title: "Задача создана",
      description: "Новая задача была успешно добавлена в список",
    });
  };

  const handleStatusChange = (id: string, newStatus: "completed" | "pending") => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id
          ? { ...task, status: newStatus, updatedAt: new Date() }
          : task
      )
    );
    
    toast({
      title: newStatus === "completed" ? "Задача выполнена" : "Задача возобновлена",
      description: newStatus === "completed"
        ? "Поздравляем с выполнением задачи!"
        : "Задача отмечена как активная",
    });
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    
    toast({
      title: "Задача удалена",
      description: "Задача была удалена из списка",
    });
  };

  // Фильтрация задач в зависимости от выбранной вкладки
  const filteredTasks = tasks.filter((task) => {
    if (activeTab === "all") return true;
    if (activeTab === "pending") return task.status === "pending";
    if (activeTab === "completed") return task.status === "completed";
    return true;
  });

  return (
    <div className="space-y-6 fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Менеджер задач</CardTitle>
        </CardHeader>
        <CardContent>
          <TaskForm onSubmit={handleCreateTask} />
        </CardContent>
      </Card>

      <Tabs defaultValue="all" value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="w-full mb-4">
          <TabsTrigger value="all" className="flex-1">Все задачи</TabsTrigger>
          <TabsTrigger value="pending" className="flex-1">Активные</TabsTrigger>
          <TabsTrigger value="completed" className="flex-1">Выполненные</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onStatusChange={handleStatusChange}
                onDelete={handleDeleteTask}
              />
            ))
          ) : (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">
                  Задачи отсутствуют. Создайте новую задачу выше.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="pending" className="space-y-4">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onStatusChange={handleStatusChange}
                onDelete={handleDeleteTask}
              />
            ))
          ) : (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">
                  Нет активных задач. Все задачи выполнены!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onStatusChange={handleStatusChange}
                onDelete={handleDeleteTask}
              />
            ))
          ) : (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">
                  Нет выполненных задач.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
