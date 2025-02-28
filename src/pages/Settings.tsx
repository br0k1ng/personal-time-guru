
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Globe, Users, Key, Clock, Archive, Share2, Copy, Gift, CreditCard, CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useArchive } from "@/contexts/ArchiveContext";

export default function Settings() {
  const { t, currentLanguage, setLanguage } = useLanguage();
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

  return (
    <div className="space-y-6 fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">{t("common", "settings")}</CardTitle>
          <CardDescription>
            Управление настройками приложения и подпиской
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="general" className="flex-1">
                <Globe className="mr-2 h-4 w-4" />
                Общие
              </TabsTrigger>
              <TabsTrigger value="subscription" className="flex-1">
                <CreditCard className="mr-2 h-4 w-4" />
                Подписка
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
            
            {/* Вкладка общих настроек */}
            <TabsContent value="general" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="language" className="text-base font-medium">
                    {t("common", "language")}
                  </Label>
                  <div className="grid grid-cols-3 gap-4 mt-2">
                    <Button 
                      variant={currentLanguage === "ru" ? "default" : "outline"} 
                      className="w-full" 
                      onClick={() => setLanguage("ru")}
                    >
                      🇷🇺 Русский
                    </Button>
                    <Button 
                      variant={currentLanguage === "en" ? "default" : "outline"} 
                      className="w-full" 
                      onClick={() => setLanguage("en")}
                    >
                      🇬🇧 English
                    </Button>
                    <Button 
                      variant={currentLanguage === "zh" ? "default" : "outline"} 
                      className="w-full" 
                      onClick={() => setLanguage("zh")}
                    >
                      🇨🇳 中文
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="archive-settings" className="text-base font-medium">
                    {t("subscription", "archiveSettings")}
                  </Label>
                  <Card className="border-dashed">
                    <CardContent className="pt-6 space-y-4">
                      <p className="text-sm text-muted-foreground">
                        {t("subscription", "archiveInfo")}
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
                    <CardTitle className="text-lg">{t("subscription", "freePlan")}</CardTitle>
                    <CardDescription>0 ₽ / месяц</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        {t("subscription", "taskModule")}
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
                        {t("subscription", "subscribe")}
                      </Button>
                    ) : (
                      <Badge className="w-full flex justify-center py-1">
                        {t("subscription", "current")}
                      </Badge>
                    )}
                  </CardFooter>
                </Card>
                
                <Card className={currentUser?.subscription.plan === "basic" ? "border-primary" : ""}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{t("subscription", "basicPlan")}</CardTitle>
                    <CardDescription>299 ₽ / месяц</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        {t("subscription", "taskModule")}
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        {t("subscription", "habitModule")}
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        {t("subscription", "diaryModule")}
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        {t("subscription", "scheduleModule")}
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
                        {t("subscription", "subscribe")}
                      </Button>
                    ) : (
                      <Badge className="w-full flex justify-center py-1">
                        {t("subscription", "current")}
                      </Badge>
                    )}
                  </CardFooter>
                </Card>
                
                <Card className={currentUser?.subscription.plan === "pro" ? "border-primary" : ""}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{t("subscription", "proPlan")}</CardTitle>
                    <CardDescription>499 ₽ / месяц</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        {t("subscription", "taskModule")}
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        {t("subscription", "habitModule")}
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        {t("subscription", "diaryModule")}
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        {t("subscription", "scheduleModule")}
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        {t("subscription", "analyticsModule")}
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        {t("subscription", "telegramNotifications")}
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        {t("subscription", "advancedStats")}
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    {currentUser?.subscription.plan !== "pro" ? (
                      <Button 
                        className="w-full" 
                        onClick={() => updateSubscription("pro")}
                      >
                        {t("subscription", "subscribe")}
                      </Button>
                    ) : (
                      <Badge className="w-full flex justify-center py-1">
                        {t("subscription", "current")}
                      </Badge>
                    )}
                  </CardFooter>
                </Card>
              </div>
              
              {currentUser?.subscription.expiresAt && (
                <Alert>
                  <Clock className="h-4 w-4 mr-2" />
                  <AlertDescription>
                    {t("subscription", "remainingDays")}: <strong>{remainingDays}</strong>
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-4">
                <Label htmlFor="promo-code">{t("subscription", "accessCode")}</Label>
                <div className="flex gap-2">
                  <Input
                    id="promo-code"
                    placeholder="Введите промокод"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <Button onClick={handleActivatePromoCode}>
                    {t("subscription", "activateCode")}
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            {/* Вкладка партнерской программы */}
            <TabsContent value="referral" className="space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{t("subscription", "referral")}</CardTitle>
                  <CardDescription>
                    {t("subscription", "referralDescription")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="referral-code">{t("subscription", "yourReferralCode")}</Label>
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
                        <div className="text-sm text-muted-foreground">{t("subscription", "invitedUsers")}</div>
                      </div>
                      <div className="bg-muted rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold">{referralsNeededForReward}</div>
                        <div className="text-sm text-muted-foreground">{t("subscription", "remainingToReward")}</div>
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
                    <CardTitle className="text-lg">{t("subscription", "manageUsers")}</CardTitle>
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
                          {t("subscription", "giveAccess")}
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
