
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CreateHabitData, HabitFrequency, HabitCategory } from "@/types/habit";

interface HabitFormProps {
  onSubmit: (data: CreateHabitData) => void;
}

export function HabitForm({ onSubmit }: HabitFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState<HabitFrequency>("daily");
  const [category, setCategory] = useState<HabitCategory>("other");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      frequency,
      category,
    });
    
    setName("");
    setDescription("");
    setFrequency("daily");
    setCategory("other");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Название привычки</Label>
        <Input
          id="name"
          placeholder="Что вы хотите отслеживать?"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      
      <div>
        <Label htmlFor="description">Описание (опционально)</Label>
        <Textarea
          id="description"
          placeholder="Подробности привычки..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[80px] resize-none"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="frequency">Частота</Label>
          <Select value={frequency} onValueChange={(value) => setFrequency(value as HabitFrequency)}>
            <SelectTrigger id="frequency">
              <SelectValue placeholder="Выберите частоту" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Ежедневно</SelectItem>
              <SelectItem value="weekly">Еженедельно</SelectItem>
              <SelectItem value="monthly">Ежемесячно</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="category">Категория</Label>
          <Select value={category} onValueChange={(value) => setCategory(value as HabitCategory)}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Выберите категорию" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="health">Здоровье</SelectItem>
              <SelectItem value="productivity">Продуктивность</SelectItem>
              <SelectItem value="learning">Обучение</SelectItem>
              <SelectItem value="personal">Личное</SelectItem>
              <SelectItem value="other">Другое</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Button type="submit" className="w-full">
        Добавить привычку
      </Button>
    </form>
  );
}
