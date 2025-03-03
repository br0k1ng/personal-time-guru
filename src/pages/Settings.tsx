import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Globe, Users, Key, Clock, Archive, Share2, Copy, Gift, CreditCard, CheckCircle, 
  User, Trash2, BarChart, LineChart, PieChart, FileText, Camera, Upload, AlertTriangle, Bell,
  MessageCircle, Send, ThumbsUp 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useArchive } from "@/contexts/ArchiveContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "support";
  timestamp: Date;
}

interface FeedbackData {
  type: string;
  subject: string;
  message: string;
  rating?: number;
}

export default function Settings() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { 
    currentUser, 
    isAdmin, 
    updateSubscription,
    activatePromoCode,
    remainingDays,
    referralCount,
    referralsNeededForReward,
    generateAccessCode
  } = useSubscription();
  const { archiveSettings, updateArchiveSettings } = useArchive();
  
  const [promoCode, setPromoCode] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [newAccessCode, setNewAccessCode] = useState("");
  const [userEmail, setUserEmail] = useState("");
  
  const [userName, setUserName] = useState("");
  const [userBio, setUserBio] = useState("");
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  
  const [reportFrequency, setReportFrequency] = useState("weekly");
  const [reportTasks, setReportTasks] = useState(true);
  const [reportHabits, setReportHabits] = useState(true);
  const [reportSchedule, setReportSchedule] = useState(false);
  
  const [preferredChartType, setPreferredChartType] = useState("bar");
  
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(false);
  const [quietHoursStart, setQuietHoursStart] = useState("22:00");
  const [quietHoursEnd, setQuietHoursEnd] = useState("07:00");
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      text: "Добро пожаловать в службу поддержки! Чем мы можем вам помочь?",
      sender: "support",
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState("");
  
  const [feedbackData, setFeedbackData] = useState<FeedbackData>({
    type: "suggestion",
    subject: "",
    message: ""
  });
  
  useEffect(() => {
    if (currentUser) {
      setUserName(currentUser.name);
    }
  }, [currentUser]);
  
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = () => {
      setUserAvatar(reader.result as string);
      toast({
        title: "Аватар загружен",
        description: "Ваш аватар успешно обновлен",
      });
    };
    reader.readAsDataURL(file);
  };
  
  const handleSaveProfile = () => {
    toast({
      title: "Профиль сохранен",
      description: "Ваши данные успешно обновлены",
    });
  };

  const handleCopyReferralCode = () => {
    if (currentUser?.referralCode) {
      navigator.clipboard.writeText(currentUser.referralCode);
      toast({
        title: "Скопировано",
        description: "Реферальный код скопирован в буфер обмена",
      });
    }
  };

  const handleActivatePromoCode = async () => {
    if (!promoCode.trim()) {
      toast({
        title: "Ошибка",
        description: "Введите промокод",
        variant: "destructive",
      });
      return;
    }
    
    const success = await activatePromoCode(promoCode);
    
    if (success) {
      toast({
        title: "Успех!",
        description: "Промокод успешно активирован",
      });
      setPromoCode("");
    } else {
      toast({
        title: "Ошибка",
        description: "Недействительный промокод",
        variant: "destructive",
      });
    }
  };

  const handleGenerateAccessCode = async () => {
    const code = await generateAccessCode();
    setNewAccessCode(code);
    
    toast({
      title: "Код создан",
      description: "Новый код доступа создан",
    });
  };

  const handleGiveAccess = () => {
    if (!userEmail.trim() || !accessCode.trim()) {
      toast({
        title: "Ошибка",
        description: "Введите email пользователя и код доступа",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Доступ выдан",
      description: `Пользователю ${userEmail} выдан доступ с кодом ${accessCode}`,
    });
    
    setUserEmail("");
    setAccessCode("");
  };

  const handleArchiveSettingsChange = (key: keyof typeof archiveSettings, value: number) => {
    updateArchiveSettings({ [key]: value });
    
    toast({
      title: "Настройки обновлены",
      description: "Настройки архива сохранены",
    });
  };
  
  const handleSaveReportSettings = () => {
    toast({
      title: "Настройки сохранены",
      description: "Настройки отчетов успешно обновлены",
    });
  };
  
  const handleSaveChartSettings = () => {
    toast({
      title: "Настройки сохранены",
      description: "Настройки графиков успешно обновлены",
    });
  };
  
  const handleSaveNotificationSettings = () => {
    toast({
      title: "Настройки сохранены",
      description: "Настройки уведомлений успешно обновлены",
    });
  };
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  
  const handleDeleteAccount = () => {
    if (deleteConfirmText !== "УДАЛИТЬ") {
      toast({
        title: "Ошибка",
        description: "Введите УДАЛИТЬ для подтверждения",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Аккаунт удален",
      description: "Ваш аккаунт и все данные успешно удалены",
    });
    
    setShowDeleteConfirm(false);
  };
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: newMessage,
      sender: "user",
      timestamp: new Date()
    };
    
    setChatMessages([...chatMessages, userMessage]);
    setNewMessage("");
    
    setTimeout(() => {
      const supportMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "Благодарим за обращение. Наш специалист свяжется с вами в ближайшее время.",
        sender: "support",
        timestamp: new Date()
      };
      
      setChatMessages(prevMessages => [...prevMessages, supportMessage]);
    }, 1000);
  };
  
  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedbackData.subject || !feedbackData.message) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все поля формы",
        variant: "destructive"
      });
      return;
    }
    
    console.log("Отправка обратной связи:", feedbackData);
    
    toast({
      title: "Отзыв отправлен",
      description: "Благодарим за ваш отзыв! Мы обязательно его рассмотрим.",
    });
    
    setFeedbackData({
      type: "suggestion",
      subject: "",
      message: ""
    });
  };

  return (
    <div className="space-y-6 fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Настройки</CardTitle>
          <CardDescription>
            Управление настройками приложения и подпиской
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="profile">
            <TabsList className="w-full mb-6 flex flex-wrap">
              <TabsTrigger value="profile" className="flex-1">
                <User className="mr-2 h-4 w-4" />
                Профиль
              </TabsTrigger>
              <TabsTrigger value="subscription" className="flex-1">
                <CreditCard className="mr-2 h-4 w-4" />
                Подписка
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex-1">
                <FileText className="mr-2 h-4 w-4" />
                Отчеты
              </TabsTrigger>
              <TabsTrigger value="charts" className="flex-1">
                <BarChart className="mr-2 h-4 w-4" />
                Графики
              </TabsTrigger>
              <TabsTrigger value="general" className="flex-1">
                <Globe className="mr-2 h-4 w-4" />
                Общие
              </TabsTrigger>
              <TabsTrigger value="support" className="flex-1">
                <MessageCircle className="mr-2 h-4 w-4" />
                Поддержка
              </TabsTrigger>
              <TabsTrigger value="referral" className="flex-1">
                <Share2 className="mr-2 h-4 w-4" />
                Партнерская программа
              </TabsTrigger>
              {isAdmin && (
                <TabsTrigger value="admin" className="flex-1">
                  <Users className="mr-2 h-4 w-4" />
                  Управление
                </TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="profile" className="space-y-6">
              <div className="space-y-6">
                <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={userAvatar || ""} />
                      <AvatarFallback className="text-xl">
                        {userName ? userName.charAt(0).toUpperCase() : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <label 
                      htmlFor="avatar-upload" 
                      className="absolute bottom-0 right-0 rounded-full bg-primary p-1 text-white cursor-pointer"
                    >
                      <Camera className="h-4 w-4" />
                      <input 
                        id="avatar-upload" 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleAvatarUpload}
                      />
                    </label>
                  </div>
                  
                  <div className="space-y-2 flex-1">
                    <div>
                      <Label htmlFor="name">Имя</Label>
                      <Input 
                        id="name" 
                        value={userName} 
                        onChange={(e) => setUserName(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="bio">О себе</Label>
                      <Textarea 
                        id="bio" 
                        value={userBio} 
                        onChange={(e) => setUserBio(e.target.value)}
                        placeholder="Короткая информация о себе"
                        className="resize-none"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button onClick={handleSaveProfile}>
                    Сохранить изменения
                  </Button>
                </div>
                
                <div className="pt-6 border-t border-muted">
                  <h3 className="text-lg font-medium text-destructive mb-4 flex items-center">
                    <Trash2 className="h-5 w-5 mr-2" />
                    Удаление аккаунта
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Удаление аккаунта приведет к безвозвратной потере всех ваших данных, включая задачи, 
                    привычки, записи дневника и все настройки. Это действие нельзя отменить.
                  </p>
                  
                  <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                    <DialogTrigger asChild>
                      <Button variant="destructive">
                        Удалить аккаунт
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Вы уверены?</DialogTitle>
                        <DialogDescription>
                          Это действие нельзя отменить. Все ваши данные будут безвозвратно удалены.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4 py-4">
                        <Alert variant="destructive">
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          <AlertDescription>
                            Для подтверждения введите УДАЛИТЬ в поле ниже
                          </AlertDescription>
                        </Alert>
                        
                        <Input 
                          value={deleteConfirmText} 
                          onChange={(e) => setDeleteConfirmText(e.target.value)}
                          placeholder="Введите УДАЛИТЬ"
                        />
                      </div>
                      
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                          Отмена
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteAccount}>
                          Удалить навсегда
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reports" className="space-y-6">
              <Card className="border-dashed">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <CardTitle>Настройки отчетов</CardTitle>
                  </div>
                  <CardDescription>
                    Настройте частоту и содержимое отчетов о вашей продуктивности
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="report-frequency">Частота отчетов</Label>
                      <Select 
                        value={reportFrequency} 
                        onValueChange={setReportFrequency}
                      >
                        <SelectTrigger id="report-frequency" className="w-full">
                          <SelectValue placeholder="Выберите частоту" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Ежедневно</SelectItem>
                          <SelectItem value="weekly">Еженедельно</SelectItem>
                          <SelectItem value="monthly">Ежемесячно</SelectItem>
                          <SelectItem value="never">Никогда</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Данные для отображения</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="report-tasks" 
                            checked={reportTasks} 
                            onCheckedChange={setReportTasks}
                          />
                          <Label htmlFor="report-tasks">Задачи</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="report-habits" 
                            checked={reportHabits} 
                            onCheckedChange={setReportHabits}
                          />
                          <Label htmlFor="report-habits">Привычки</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="report-schedule" 
                            checked={reportSchedule} 
                            onCheckedChange={setReportSchedule}
                          />
                          <Label htmlFor="report-schedule">Расписание</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="justify-end">
                  <Button onClick={handleSaveReportSettings}>
                    Сохранить настройки
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="charts" className="space-y-6">
              <Card className="border-dashed">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <BarChart className="h-5 w-5 text-muted-foreground" />
                    <CardTitle>Настройки графиков</CardTitle>
                  </div>
                  <CardDescription>
                    Выберите предпочтительные типы графиков для аналитики
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="chart-type">Предпочтительный тип графика</Label>
                      <div className="grid grid-cols-3 gap-4 mt-2">
                        <div 
                          className={`flex flex-col items-center p-4 border rounded-md cursor-pointer ${
                            preferredChartType === "bar" ? "border-primary bg-primary/10" : "border-muted"
                          }`}
                          onClick={() => setPreferredChartType("bar")}
                        >
                          <BarChart className="h-10 w-10 mb-2" />
                          <span className="text-sm">Столбчатый</span>
                        </div>
                        <div 
                          className={`flex flex-col items-center p-4 border rounded-md cursor-pointer ${
                            preferredChartType === "line" ? "border-primary bg-primary/10" : "border-muted"
                          }`}
                          onClick={() => setPreferredChartType("line")}
                        >
                          <LineChart className="h-10 w-10 mb-2" />
                          <span className="text-sm">Линейный</span>
                        </div>
                        <div 
                          className={`flex flex-col items-center p-4 border rounded-md cursor-pointer ${
                            preferredChartType === "pie" ? "border-primary bg-primary/10" : "border-muted"
                          }`}
                          onClick={() => setPreferredChartType("pie")}
                        >
                          <PieChart className="h-10 w-10 mb-2" />
                          <span className="text-sm">Круговой</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="justify-end">
                  <Button onClick={handleSaveChartSettings}>
                    Сохранить настройки
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="general" className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="archive-settings" className="text-base font-medium">
                    Настройки архива
                  </Label>
                  <Card className="border-dashed">
                    <CardContent className="pt-6 space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Выполненные задачи хранятся в списке 7 дней, затем перемещаются в архив, где хранятся еще 30 дней.
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Хранить выполненные задачи (дней)</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <Input 
                              type="number" 
                              min="1" 
                              max="30" 
                              value={archiveSettings.keepCompletedTasksDays}
                              onChange={(e) => handleArchiveSettingsChange(
                                "keepCompletedTasksDays", 
                                parseInt(e.target.value) || 7
                              )}
                              className="w-20"
                            />
                            <span className="text-sm text-muted-foreground">дней в списке</span>
                          </div>
                        </div>
                        
                        <div>
                          <Label>Хранить в архиве (дней)</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <Input 
                              type="number" 
                              min="1" 
                              max="90" 
                              value={archiveSettings.keepArchivedTasksDays}
                              onChange={(e) => handleArchiveSettingsChange(
                                "keepArchivedTasksDays", 
                                parseInt(e.target.value) || 30
                              )}
                              className="w-20"
                            />
                            <span className="text-sm text-muted-foreground">дней в архиве</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="subscription" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className={currentUser?.subscription.plan === "free" ? "border-primary" : ""}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Бесплатный план</CardTitle>
                    <CardDescription>0 ₽ / месяц</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        Модуль задач
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    {currentUser?.subscription.plan !== "free" ? (
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        onClick={() => updateSubscription("free")}
                      >
                        Подписаться
                      </Button>
                    ) : (
                      <Badge className="w-full flex justify-center py-1">
                        Текущий план
                      </Badge>
                    )}
                  </CardFooter>
                </Card>
                
                <Card className={currentUser?.subscription.plan === "basic" ? "border-primary" : ""}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Базовый план</CardTitle>
                    <CardDescription>299 ₽ / месяц</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        Модуль задач
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        Модуль привычек
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        Модуль дневника
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        Модуль расписания
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    {currentUser?.subscription.plan !== "basic" ? (
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        onClick={() => updateSubscription("basic")}
                      >
                        Подписаться
                      </Button>
                    ) : (
                      <Badge className="w-full flex justify-center py-1">
                        Текущий план
                      </Badge>
                    )}
                  </CardFooter>
                </Card>
                
                <Card className={currentUser?.subscription.plan === "pro" ? "border-primary" : ""}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Pro план</CardTitle>
                    <CardDescription>499 ₽ / месяц</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        Модуль задач
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        Модуль привычек
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        Модуль дневника
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        Модуль расписания
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        Модуль аналитики
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        Уведомления в Telegram
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        Расширенная статистика
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    {currentUser?.subscription.plan !== "pro" ? (
                      <Button 
                        className="w-full" 
                        onClick={() => updateSubscription("pro")}
                      >
                        Подписаться
                      </Button>
                    ) : (
                      <Badge className="w-full flex justify-center py-1">
                        Текущий план
                      </Badge>
                    )}
                  </CardFooter>
                </Card>
              </div>
              
              {currentUser?.subscription.expiresAt && (
                <Alert>
                  <Clock className="h-4 w-4 mr-2" />
                  <AlertDescription>
                    Осталось дней подписки: <strong>{remainingDays}</strong>
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-4">
                <Label htmlFor="promo-code">Код доступа</Label>
                <div className="flex gap-2">
                  <Input
                    id="promo-code"
                    placeholder="Введите промокод"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <Button onClick={handleActivatePromoCode}>
                    Активировать код
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="referral" className="space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Партнерская программа</CardTitle>
                  <CardDescription>
                    Приведите 3 человек и получите бесплатную подписку на месяц
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="referral-code">Ваш реферальный код</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          id="referral-code"
                          value={currentUser?.referralCode || ""}
                          readOnly
                        />
                        <Button variant="outline" size="icon" onClick={handleCopyReferralCode}>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold">{referralCount}</div>
                        <div className="text-sm text-muted-foreground">Приглашенных пользователей</div>
                      </div>
                      <div className="bg-muted rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold">{referralsNeededForReward}</div>
                        <div className="text-sm text-muted-foreground">Осталось до награды</div>
                      </div>
                    </div>
                    
                    {referralsNeededForReward <= 0 && (
                      <Alert className="bg-green-50 border-green-200">
                        <Gift className="h-4 w-4 text-green-500 mr-2" />
                        <AlertDescription className="text-green-700">
                          Поздравляем! Вы пригласили 3 человека и получили бесплатный месяц подписки!
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="support" className="space-y-6">
              <Tabs defaultValue="chat">
                <TabsList className="w-full mb-6">
                  <TabsTrigger value="chat" className="flex-1">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Чат с поддержкой
                  </TabsTrigger>
                  <TabsTrigger value="feedback" className="flex-1">
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Обратная связь
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="chat" className="space-y-4">
                  <Card className="border-muted">
                    <CardContent className="p-4">
                      <ScrollArea className="h-[400px] pr-4">
                        <div className="space-y-4">
                          {chatMessages.map((message) => (
                            <div 
                              key={message.id} 
                              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                            >
                              <div 
                                className={`flex max-w-[80%] ${
                                  message.sender === "user" 
                                    ? "bg-primary text-primary-foreground" 
                                    : "bg-muted"
                                } rounded-lg px-4 py-2`}
                              >
                                {message.sender === "support" && (
                                  <Avatar className="h-8 w-8 mr-2">
                                    <AvatarFallback>СП</AvatarFallback>
                                  </Avatar>
                                )}
                                <div>
                                  <div className="text-sm">{message.text}</div>
                                  <div className="text-xs mt-1 opacity-70">
                                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                      
                      <div className="flex items-center gap-2 mt-4">
                        <Input
                          placeholder="Введите сообщение..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                        />
                        <Button size="icon" onClick={handleSendMessage}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="feedback" className="space-y-4">
                  <form onSubmit={handleSubmitFeedback}>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="feedback-type">Тип обращения</Label>
                        <Select 
                          value={feedbackData.type} 
                          onValueChange={(value) => setFeedbackData({...feedbackData, type: value})}
                        >
                          <SelectTrigger id="feedback-type">
                            <SelectValue placeholder="Выберите тип обращения" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="suggestion">Предложение</SelectItem>
                            <SelectItem value="bug">Сообщение об ошибке</SelectItem>
                            <SelectItem value="question">Вопрос</SelectItem>
                            <SelectItem value="other">Другое</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="feedback-subject">Тема</Label>
                        <Input
                          id="feedback-subject"
                          placeholder="Введите тему обращения"
                          value={feedbackData.subject}
                          onChange={(e) => setFeedbackData({...feedbackData, subject: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="feedback-message">Сообщение</Label>
                        <Textarea
                          id="feedback-message"
                          placeholder="Опишите подробнее ваше обращение..."
                          rows={6}
                          value={feedbackData.message}
                          onChange={(e) => setFeedbackData({...feedbackData, message: e.target.value})}
                        />
                      </div>
                    
                      <Button type="submit" className="w-full">
                        Отправить
                      </Button>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            </TabsContent>
            
            {isAdmin && (
              <TabsContent value="admin" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Управление пользователями</CardTitle>
                    <CardDescription>
                      Управление доступом пользователей
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="generate-code">Создать код доступа</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          id="generate-code"
                          value={newAccessCode}
                          readOnly
                          placeholder="Нажмите кнопку для генерации кода"
                        />
                        <Button onClick={handleGenerateAccessCode}>
                          Создать
                        </Button>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <Label htmlFor="give-access-email">Выдать доступ пользователю</Label>
                      <div className="grid grid-cols-1 gap-4 mt-1">
                        <Input
                          id="give-access-email"
                          placeholder="Email пользователя"
                          value={userEmail}
                          onChange={(e) => setUserEmail(e.target.value)}
                        />
                        <Input
                          placeholder="Код доступа"
                          value={accessCode}
                          onChange={(e) => setAccessCode(e.target.value)}
                        />
                        <Button onClick={handleGiveAccess}>
                          Выдать доступ
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
