
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { EnhancedCalendar } from "@/components/schedule/EnhancedCalendar";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { EventForm } from "@/components/schedule/EventForm";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { ScheduleEvent, CreateEventData } from "@/types/schedule";

// Имитация загрузки событий
const fetchEvents = async (): Promise<ScheduleEvent[]> => {
  // В реальном приложении здесь был бы API-запрос
  return [
    {
      id: "1",
      title: "Встреча с командой",
      description: "Обсуждение проекта",
      startTime: new Date(2023, 5, 15, 10, 0),
      endTime: new Date(2023, 5, 15, 11, 0),
      location: "Офис",
      frequency: "once",
      reminder: "15min",
      createdAt: new Date(2023, 5, 10),
      updatedAt: new Date(2023, 5, 10)
    },
    {
      id: "2",
      title: "Посещение врача",
      description: "Плановый осмотр",
      startTime: new Date(2023, 5, 18, 14, 30),
      endTime: new Date(2023, 5, 18, 15, 30),
      location: "Клиника",
      frequency: "once",
      reminder: "1hour",
      createdAt: new Date(2023, 5, 12),
      updatedAt: new Date(2023, 5, 12)
    },
    {
      id: "3",
      title: "День рождения друга",
      description: "Не забыть купить подарок",
      startTime: new Date(),
      endTime: new Date(new Date().setHours(new Date().getHours() + 2)),
      location: "Ресторан",
      frequency: "once",
      reminder: "1day",
      createdAt: new Date(2023, 5, 14),
      updatedAt: new Date(2023, 5, 14)
    }
  ];
};

export default function Schedule() {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCreating, setIsCreating] = useState(false);
  const [view, setView] = useState<"month" | "list">("month");
  
  const { data: events = [], isLoading, refetch } = useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents
  });
  
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };
  
  const handleCreateEvent = async (eventData: CreateEventData) => {
    // В реальном приложении здесь был бы API-запрос для создания события
    console.log("Creating event:", eventData);
    
    toast({
      title: "Событие создано",
      description: `Событие "${eventData.title}" успешно добавлено в календарь`
    });
    
    setIsCreating(false);
    refetch();
  };
  
  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Расписание</h1>
        <div className="flex items-center space-x-2">
          <Tabs value={view} onValueChange={(v) => setView(v as "month" | "list")}>
            <TabsList>
              <TabsTrigger value="month">Месяц</TabsTrigger>
              <TabsTrigger value="list">Список</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button onClick={() => setIsCreating(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Добавить событие
          </Button>
        </div>
      </div>
      
      <Tabs value={view} onValueChange={(v) => setView(v as "month" | "list")} className="w-full">
        <TabsContent value="month" className="mt-0">
          <EnhancedCalendar 
            events={events}
            onDateSelect={handleDateSelect}
            selectedDate={selectedDate}
          />
        </TabsContent>
        
        <TabsContent value="list" className="mt-0">
          <div className="space-y-4">
            {events.length > 0 ? (
              events
                .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                .map(event => (
                  <div key={event.id} className="flex items-center p-3 border rounded-md">
                    <div className="flex-1">
                      <h3 className="font-medium">{event.title}</h3>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(event.startTime), "dd.MM.yyyy")} в {format(new Date(event.startTime), "HH:mm")}
                      </div>
                      {event.description && (
                        <div className="text-sm mt-1">{event.description}</div>
                      )}
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                У вас пока нет запланированных событий
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      {isCreating && (
        <EventForm
          onSubmit={handleCreateEvent}
          initialDate={selectedDate}
        />
      )}
    </div>
  );
}
