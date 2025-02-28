
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
import { CreateEventData, EventFrequency, ReminderTime } from "@/types/schedule";

interface EventFormProps {
  onSubmit: (data: CreateEventData) => void;
}

export function EventForm({ onSubmit }: EventFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [frequency, setFrequency] = useState<EventFrequency>("once");
  const [reminder, setReminder] = useState<ReminderTime>("none");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !startTime || !endTime) return;
    
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      location: location.trim(),
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      frequency,
      reminder,
    });
    
    setTitle("");
    setDescription("");
    setLocation("");
    setStartTime("");
    setEndTime("");
    setFrequency("once");
    setReminder("none");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Название события</Label>
        <Input
          id="title"
          placeholder="Встреча, занятие и т.д."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="description">Описание (опционально)</Label>
        <Textarea
          id="description"
          placeholder="Подробности события..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[80px] resize-none"
        />
      </div>
      
      <div>
        <Label htmlFor="location">Место (опционально)</Label>
        <Input
          id="location"
          placeholder="Адрес или название места"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startTime">Время начала</Label>
          <Input
            id="startTime"
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="endTime">Время окончания</Label>
          <Input
            id="endTime"
            type="datetime-local"
            value={endTime}
            onChange={(e) => {
              // Убедимся, что время окончания не раньше времени начала
              if (startTime && e.target.value < startTime) {
                setEndTime(startTime);
              } else {
                setEndTime(e.target.value);
              }
            }}
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="frequency">Повторение</Label>
          <Select value={frequency} onValueChange={(value) => setFrequency(value as EventFrequency)}>
            <SelectTrigger id="frequency">
              <SelectValue placeholder="Выберите частоту" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="once">Однократно</SelectItem>
              <SelectItem value="daily">Ежедневно</SelectItem>
              <SelectItem value="weekly">Еженедельно</SelectItem>
              <SelectItem value="monthly">Ежемесячно</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="reminder">Напоминание</Label>
          <Select value={reminder} onValueChange={(value) => setReminder(value as ReminderTime)}>
            <SelectTrigger id="reminder">
              <SelectValue placeholder="Выберите время напоминания" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Не напоминать</SelectItem>
              <SelectItem value="15min">За 15 минут</SelectItem>
              <SelectItem value="1hour">За 1 час</SelectItem>
              <SelectItem value="1day">За 1 день</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Button type="submit" className="w-full">
        Добавить событие
      </Button>
    </form>
  );
}
