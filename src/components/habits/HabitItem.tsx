
import { Check, X, Activity, Heart, Book, User, MoreHorizontal, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Habit, HabitCategory } from "@/types/habit";

interface HabitItemProps {
  habit: Habit;
  onComplete: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  isToday: boolean;
}

export function HabitItem({ habit, onComplete, onDelete, isToday }: HabitItemProps) {
  const today = new Date().toISOString().split('T')[0];
  const todayCompletion = habit.completions.find(c => c.date === today);
  const completedToday = todayCompletion?.completed || false;
  
  // Функция для получения иконки категории
  const getCategoryDetails = (category: HabitCategory) => {
    switch (category) {
      case "health":
        return { label: "Здоровье", icon: Heart, color: "text-red-500" };
      case "productivity":
        return { label: "Продуктивность", icon: Activity, color: "text-blue-500" };
      case "learning":
        return { label: "Обучение", icon: Book, color: "text-yellow-500" };
      case "personal":
        return { label: "Личное", icon: User, color: "text-purple-500" };
      case "other":
        return { label: "Другое", icon: MoreHorizontal, color: "text-gray-500" };
      default:
        return { label: "Другое", icon: MoreHorizontal, color: "text-gray-500" };
    }
  };

  const categoryDetails = getCategoryDetails(habit.category);
  const CategoryIcon = categoryDetails.icon;
  
  // Расчет прогресса выполнения привычки (за последний месяц)
  const calculateProgress = () => {
    const lastMonth = habit.completions.filter(
      c => new Date(c.date) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    );
    if (lastMonth.length === 0) return 0;
    const completed = lastMonth.filter(c => c.completed).length;
    return Math.round((completed / lastMonth.length) * 100);
  };
  
  const progress = calculateProgress();

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {isToday && (
            <Button 
              variant="outline" 
              size="icon" 
              className={`mt-0.5 ${completedToday ? "bg-primary/10" : ""}`} 
              onClick={() => onComplete(habit.id, !completedToday)}
            >
              {completedToday ? (
                <Check className="h-4 w-4 text-primary" />
              ) : (
                <X className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          )}
          
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">
                  {habit.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {habit.description}
                </p>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className={categoryDetails.color}>
                  <CategoryIcon className="h-3 w-3 mr-1" />
                  {categoryDetails.label}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Прогресс</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            
            <div className="flex justify-between items-center text-xs text-muted-foreground pt-1">
              <div className="flex items-center gap-1">
                <span>Серия: {habit.streak} дней</span>
              </div>
              <div>
                Создано: {format(new Date(habit.createdAt), "d MMM", { locale: ru })}
              </div>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(habit.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
