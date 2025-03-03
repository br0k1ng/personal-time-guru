
import { useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from "date-fns";
import { ru } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EventItem } from "./EventItem";

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  time?: string;
  description?: string;
  category?: string;
}

interface EnhancedCalendarProps {
  events: CalendarEvent[];
  onDateSelect: (date: Date) => void;
  selectedDate: Date;
}

export function EnhancedCalendar({ events, onDateSelect, selectedDate }: EnhancedCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  
  // Функция для перехода к предыдущему месяцу
  const previousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  // Функция для перехода к следующему месяцу
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  // Получаем все дни текущего месяца
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Получаем события на выбранную дату
  const selectedDateEvents = events.filter(event => 
    isSameDay(new Date(event.date), selectedDate)
  );
  
  // Проверяем, есть ли события в конкретный день
  const hasEventsOnDay = (day: Date) => {
    return events.some(event => isSameDay(new Date(event.date), day));
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Календарь</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-[120px] text-center">
            {format(currentMonth, 'LLLL yyyy', { locale: ru })}
          </div>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Card className="p-4">
        <div className="grid grid-cols-7 gap-1 text-center">
          {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day) => (
            <div key={day} className="text-sm font-medium py-2">
              {day}
            </div>
          ))}
          
          {/* Пустые ячейки до начала месяца */}
          {Array.from({ length: (monthStart.getDay() === 0 ? 6 : monthStart.getDay() - 1) }).map((_, i) => (
            <div key={`empty-${i}`} className="h-12 p-1" />
          ))}
          
          {/* Дни месяца */}
          {days.map((day) => {
            const hasEvents = hasEventsOnDay(day);
            return (
              <Button
                key={day.toISOString()}
                variant="ghost"
                className={cn(
                  "h-12 w-full flex flex-col justify-center items-center p-1 relative",
                  !isSameMonth(day, currentMonth) && "text-muted-foreground opacity-50",
                  isSameDay(day, selectedDate) && "bg-primary/20",
                  isToday(day) && !isSameDay(day, selectedDate) && "border border-primary"
                )}
                onClick={() => onDateSelect(day)}
              >
                <span>{format(day, 'd')}</span>
                {hasEvents && (
                  <Badge variant="default" className="absolute bottom-1 w-1.5 h-1.5 p-0" />
                )}
              </Button>
            );
          })}
        </div>
      </Card>
      
      <div>
        <h3 className="text-lg font-medium mb-2">
          {format(selectedDate, 'dd MMMM yyyy', { locale: ru })}
        </h3>
        
        <Card>
          <ScrollArea className="h-[300px]">
            <div className="p-4 space-y-2">
              {selectedDateEvents.length > 0 ? (
                selectedDateEvents.map(event => (
                  <EventItem
                    key={event.id}
                    event={event}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Нет событий на выбранную дату
                </div>
              )}
            </div>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
}
