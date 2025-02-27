
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HabitForm } from "@/components/habits/HabitForm";
import { HabitItem } from "@/components/habits/HabitItem";
import { Habit, CreateHabitData } from "@/types/habit";
import { useToast } from "@/hooks/use-toast";

export default function Habits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [activeTab, setActiveTab] = useState<"today" | "all">("today");
  const { toast } = useToast();
  
  const today = new Date().toISOString().split('T')[0];

  const handleCreateHabit = (data: CreateHabitData) => {
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      ...data,
      streak: 0,
      completions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setHabits((prev) => [newHabit, ...prev]);
    
    toast({
      title: "Привычка создана",
      description: "Новая привычка была успешно добавлена в трекер",
    });
  };

  const handleCompleteHabit = (id: string, completed: boolean) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) => {
        if (habit.id !== id) return habit;
        
        const existingCompletionIndex = habit.completions.findIndex(c => c.date === today);
        let newCompletions = [...habit.completions];
        let newStreak = habit.streak;
        
        if (existingCompletionIndex >= 0) {
          // Обновляем существующую отметку
          newCompletions[existingCompletionIndex] = { date: today, completed };
        } else {
          // Добавляем новую отметку
          newCompletions.push({ date: today, completed });
        }
        
        // Обновляем серию (streak)
        if (completed) {
          newStreak += 1;
        } else {
          newStreak = 0;
        }
        
        return { 
          ...habit, 
          completions: newCompletions,
          streak: newStreak,
          updatedAt: new Date() 
        };
      })
    );
    
    toast({
      title: completed ? "Привычка выполнена" : "Привычка не выполнена",
      description: completed 
        ? "Отличная работа! Продолжайте в том же духе!"
        : "Не волнуйтесь, вы сможете выполнить её в следующий раз.",
    });
  };

  const handleDeleteHabit = (id: string) => {
    setHabits((prevHabits) => prevHabits.filter((habit) => habit.id !== id));
    
    toast({
      title: "Привычка удалена",
      description: "Привычка была удалена из трекера",
    });
  };

  return (
    <div className="space-y-6 fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Трекер привычек</CardTitle>
        </CardHeader>
        <CardContent>
          <HabitForm onSubmit={handleCreateHabit} />
        </CardContent>
      </Card>

      <Tabs defaultValue="today" value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="w-full mb-4">
          <TabsTrigger value="today" className="flex-1">На сегодня</TabsTrigger>
          <TabsTrigger value="all" className="flex-1">Все привычки</TabsTrigger>
        </TabsList>
        
        <TabsContent value="today" className="space-y-4">
          {habits.length > 0 ? (
            habits.map((habit) => (
              <HabitItem
                key={habit.id}
                habit={habit}
                onComplete={handleCompleteHabit}
                onDelete={handleDeleteHabit}
                isToday={true}
              />
            ))
          ) : (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">
                  Привычки отсутствуют. Создайте новую привычку, чтобы начать отслеживание.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="all" className="space-y-4">
          {habits.length > 0 ? (
            habits.map((habit) => (
              <HabitItem
                key={habit.id}
                habit={habit}
                onComplete={handleCompleteHabit}
                onDelete={handleDeleteHabit}
                isToday={false}
              />
            ))
          ) : (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">
                  Привычки отсутствуют. Создайте новую привычку выше.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
