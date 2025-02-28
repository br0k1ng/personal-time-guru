
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { sendDataToTelegram, showTelegramAlert, isTelegramWebApp } from "@/lib/telegram";

export function NotificationSettings() {
  const [morningNotification, setMorningNotification] = useState(true);
  const [eveningNotification, setEveningNotification] = useState(true);
  const [reminderNotification, setReminderNotification] = useState(true);
  const { toast } = useToast();

  const handleSaveSettings = () => {
    const settings = {
      type: "notification_settings",
      settings: {
        morningNotification,
        eveningNotification,
        reminderNotification
      }
    };
    
    // Если мы в Telegram, отправляем данные в бот
    if (isTelegramWebApp()) {
      sendDataToTelegram(settings);
      showTelegramAlert("Настройки уведомлений сохранены");
    } else {
      console.log("Сохранены настройки уведомлений:", settings);
      toast({
        title: "Настройки сохранены",
        description: "Настройки уведомлений успешно сохранены.",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Настройки уведомлений</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="morning-notification" className="font-medium">
              Утреннее напоминание
            </Label>
            <p className="text-sm text-muted-foreground">
              Ежедневно в 7:00 - задачи и события на день
            </p>
          </div>
          <Switch
            id="morning-notification"
            checked={morningNotification}
            onCheckedChange={setMorningNotification}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="evening-notification" className="font-medium">
              Вечернее напоминание
            </Label>
            <p className="text-sm text-muted-foreground">
              Ежедневно в 21:00 - планирование на завтра
            </p>
          </div>
          <Switch
            id="evening-notification"
            checked={eveningNotification}
            onCheckedChange={setEveningNotification}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="reminder-notification" className="font-medium">
              Напоминания о событиях
            </Label>
            <p className="text-sm text-muted-foreground">
              За указанное время до начала события
            </p>
          </div>
          <Switch
            id="reminder-notification"
            checked={reminderNotification}
            onCheckedChange={setReminderNotification}
          />
        </div>
        
        <Button onClick={handleSaveSettings} className="w-full mt-4">
          Сохранить настройки
        </Button>
      </CardContent>
    </Card>
  );
}
