
import { CalendarDays, Clock, MapPin, Bell, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScheduleEvent, EventFrequency, ReminderTime } from "@/types/schedule";

interface EventItemProps {
  event: ScheduleEvent;
  onDelete: (id: string) => void;
}

export function EventItem({ event, onDelete }: EventItemProps) {
  // Функция для отображения частоты повторения
  const getFrequencyLabel = (frequency: EventFrequency) => {
    switch (frequency) {
      case "once": return "Однократно";
      case "daily": return "Ежедневно";
      case "weekly": return "Еженедельно";
      case "monthly": return "Ежемесячно";
      default: return "Однократно";
    }
  };

  // Функция для отображения времени напоминания
  const getReminderLabel = (reminder: ReminderTime) => {
    switch (reminder) {
      case "15min": return "За 15 минут";
      case "1hour": return "За 1 час";
      case "1day": return "За 1 день";
      case "none": return "Нет";
      default: return "Нет";
    }
  };

  // Форматирование даты и времени с учетом российской локали
  const formattedStartDate = format(new Date(event.startTime), "d MMMM", { locale: ru });
  const formattedStartTime = format(new Date(event.startTime), "HH:mm");
  const formattedEndTime = format(new Date(event.endTime), "HH:mm");

  // Проверка, является ли событие на сегодня
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };
  
  const eventIsToday = isToday(new Date(event.startTime));

  return (
    <Card className={`overflow-hidden ${eventIsToday ? "border-primary/30" : ""}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 bg-primary/10 rounded-md p-2 text-primary">
            <CalendarDays className="h-6 w-6" />
          </div>
          
          <div className="flex-1 space-y-2">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{event.title}</h3>
                {eventIsToday && <Badge variant="outline" className="bg-primary/10">Сегодня</Badge>}
              </div>
              
              {event.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {event.description}
                </p>
              )}
            </div>
            
            <div className="flex flex-col space-y-1 text-sm">
              <div className="flex items-center text-muted-foreground">
                <Clock className="h-4 w-4 mr-2" />
                <span>{formattedStartDate}, {formattedStartTime} - {formattedEndTime}</span>
              </div>
              
              {event.location && (
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{event.location}</span>
                </div>
              )}
              
              <div className="flex items-center text-muted-foreground">
                <Bell className="h-4 w-4 mr-2" />
                <span>Напоминание: {getReminderLabel(event.reminder)}</span>
              </div>
            </div>
            
            <div className="pt-1">
              <Badge variant="outline">
                {getFrequencyLabel(event.frequency)}
              </Badge>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(event.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
