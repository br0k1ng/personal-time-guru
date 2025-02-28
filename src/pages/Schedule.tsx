
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventForm } from "@/components/schedule/EventForm";
import { EventItem } from "@/components/schedule/EventItem";
import { NotificationSettings } from "@/components/telegram/NotificationSettings";
import { ScheduleEvent, CreateEventData } from "@/types/schedule";
import { useToast } from "@/hooks/use-toast";
import { isTelegramWebApp } from "@/lib/telegram";

export default function Schedule() {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [activeTab, setActiveTab] = useState<"today" | "all" | "settings">("today");
  const { toast } = useToast();
  const [isTelegram, setIsTelegram] = useState(false);
  
  // Проверяем, запущено ли приложение в Telegram
  useState(() => {
    setIsTelegram(isTelegramWebApp());
  });

  const handleCreateEvent = (data: CreateEventData) => {
    const newEvent: ScheduleEvent = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setEvents((prev) => [...prev, newEvent].sort((a, b) => 
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    ));
    
    toast({
      title: "Событие создано",
      description: "Новое событие было успешно добавлено в расписание",
    });
  };

  const handleDeleteEvent = (id: string) => {
    setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
    
    toast({
      title: "Событие удалено",
      description: "Событие было удалено из расписания",
    });
  };

  // Фильтрация событий для сегодняшнего дня
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const todayEvents = events.filter(event => isToday(new Date(event.startTime)));
  const filteredEvents = activeTab === "today" ? todayEvents : events;

  return (
    <div className="space-y-6 fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Моё расписание</CardTitle>
        </CardHeader>
        <CardContent>
          <EventForm onSubmit={handleCreateEvent} />
        </CardContent>
      </Card>

      <Tabs defaultValue="today" value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="w-full mb-4">
          <TabsTrigger value="today" className="flex-1">Сегодня</TabsTrigger>
          <TabsTrigger value="all" className="flex-1">Все события</TabsTrigger>
          {isTelegram && (
            <TabsTrigger value="settings" className="flex-1">Уведомления</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="today" className="space-y-4">
          {todayEvents.length > 0 ? (
            todayEvents.map((event) => (
              <EventItem
                key={event.id}
                event={event}
                onDelete={handleDeleteEvent}
              />
            ))
          ) : (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">
                  Нет событий на сегодня. Добавьте новое событие, чтобы начать планирование дня.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="all" className="space-y-4">
          {events.length > 0 ? (
            events.map((event) => (
              <EventItem
                key={event.id}
                event={event}
                onDelete={handleDeleteEvent}
              />
            ))
          ) : (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">
                  События отсутствуют. Создайте новое событие выше.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {isTelegram && (
          <TabsContent value="settings" className="space-y-4">
            <NotificationSettings />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
