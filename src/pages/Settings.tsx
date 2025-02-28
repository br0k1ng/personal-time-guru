
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
import { 
  Globe, Users, Key, Clock, Archive, Share2, Copy, Gift, CreditCard, CheckCircle, 
  User, Trash2, BarChart, LineChart, PieChart, FileText, Camera, Upload, AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useArchive } from "@/contexts/ArchiveContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

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
  
  // Настройки профиля
  const [userName, setUserName] = useState("");
  const [userBio, setUserBio] = useState("");
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  
  // Настройки отчетов
  const [reportFrequency, setReportFrequency] = useState("weekly");
  const [reportTasks, setReportTasks] = useState(true);
  const [reportHabits, setReportHabits] = useState(true);
  const [reportSchedule, setReportSchedule] = useState(false);
  
  // Настройки графиков
  const [preferredChartType, setPreferredChartType] = useState("bar");
  
  // Загрузка данных пользователя
  useEffect(() => {
    if (currentUser) {
      setUserName(currentUser.name);
      // В реальном приложении здесь бы загружались остальные данные профиля
    }
  }, [currentUser]);
  
  // Загрузка аватара
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // В реальном приложении файл бы отправлялся на сервер
    // Здесь просто создаем URL для предпросмотра
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
  
  // Сохранение профиля
  const handleSaveProfile = () => {
    // В реальном приложении данные отправлялись бы на сервер
    toast({
      title: "Профиль сохранен",
      description: "Ваши данные успешно обновлены",
    });
  };

  // Функция копирования в буфер обмена
  const handleCopyReferralCode = () => {
    if (currentUser?.referralCode) {
      navigator.clipboard.writeText(currentUser.referralCode);
      toast({
        title: "Скопировано",
        description: "Реферальный код скопирован в буфер обмена",
      });
    }
  };

  // Активация промокода
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

  // Генерация кода доступа
  const handleGenerateAccessCode = async () => {
    const code = await generateAccessCode();
    setNewAccessCode(code);
    
    toast({
      title: "Код создан",
      description: "Новый код доступа создан",
    });
  };

  // Выдача доступа пользователю
  const handleGiveAccess = () => {
    if (!userEmail.trim() || !accessCode.trim()) {
      toast({
        title: "Ошибка",
        description: "Введите email пользователя и код доступа",
        variant: "destructive",
      });
      return;
    }
    
    // В реальном приложении здесь был бы API запрос
    toast({
      title: "Доступ выдан",
      description: `Пользователю ${userEmail} выдан доступ с кодом ${accessCode}`,
    });
    
    setUserEmail("");
    setAccessCode("");
  };

  // Обновление настроек архива
  const handleArchiveSettingsChange = (key: keyof typeof archiveSettings, value: number) => {
    updateArchiveSettings({ [key]: value });
    
    toast({
      title: "Настройки обновлены",
      description: "Настройки архива сохранены",
    });
  };
  
  // Сохранение настроек отчетов
  const handleSaveReportSettings = () => {
    // В реальном приложении настройки отправлялись бы на сервер
    toast({
      title: "Настройки сохранены",
      description: "Настройки отчетов успешно обновлены",
    });
  };
  
  // Сохранение настроек графиков
  const handleSaveChartSettings = () => {
    // В реальном приложении настройки отправлялись бы на сервер
    toast({
      title: "Настройки сохранены",
      description: "Настройки графиков успешно обновлены",
    });
  };
  
  // Удаление аккаунта
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
    
    // В реальном приложении здесь был бы API запрос на удаление
    toast({
      title: "Аккаунт удален",
      description: "Ваш аккаунт и все данные успешно удалены",
    });
    
    setShowDeleteConfirm(false);
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
            
            {/* Вкладка профиля */}
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
            
            {/* Вкладка отчетов */}
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
            
            {/* Вкладка графиков */}
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
            
            {/* Вкладка общих настроек */}
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
            
            {/* Вкладка подписки */}
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
            
            {/* Вкладка партнерской программы */}
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
            
            {/* Вкладка администрирования */}
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
