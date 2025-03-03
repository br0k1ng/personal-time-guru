import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LANGUAGES } from "@/constants";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "support";
  timestamp: Date;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    id: "faq1",
    question: "Как создать новую задачу?",
    answer: "Чтобы создать новую задачу, перейдите в раздел 'Задачи' и нажмите кнопку 'Создать задачу'. Заполните необходимые поля и нажмите 'Сохранить'."
  },
  {
    id: "faq2",
    question: "Как настроить привычки?",
    answer: "Для настройки привычек перейдите в раздел 'Привычки'. Там вы можете создавать новые привычки, устанавливать периодичность и отслеживать прогресс."
  },
  {
    id: "faq3",
    question: "Как настроить уведомления?",
    answer: "Настройки уведомлений доступны в разделе 'Настройки' на вкладке 'Уведомления'. Здесь вы можете указать, какие уведомления хотите получать и выбрать время их получения."
  },
  {
    id: "faq4",
    question: "Как изменить язык приложения?",
    answer: "Для изменения языка перейдите в раздел 'Настройки' на вкладке 'Общие'. В выпадающем меню выберите нужный язык интерфейса."
  },
  {
    id: "faq5",
    question: "Как посмотреть аналитику?",
    answer: "Для просмотра аналитики перейдите в раздел 'Аналитика'. Там вы найдете различные графики и статистику по выполнению задач, привычек и расписания."
  }
];

export default function Settings() {
  const { t, currentLanguage, setLanguage } = useLanguage();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const { toast } = useToast();
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      text: "Добро пожаловать в службу поддержки! Чем мы можем вам помочь?",
      sender: "support",
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [showFaq, setShowFaq] = useState(true);

  const changeLanguage = (lng: string) => {
    if (lng === "ru") {
      setLanguage("ru");
    }
  };

  const handleThemeChange = (value: "light" | "dark") => {
    setTheme(value);
  };
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: newMessage,
      sender: "user",
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage("");
    
    if (newMessage.toLowerCase().includes("помощь") || newMessage.toLowerCase().includes("help")) {
      setShowFaq(true);
    } else {
      setTimeout(() => {
        const supportMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: "Благодарим за обращение. Наш специалист свяжется с вами в ближайшее время.",
          sender: "support",
          timestamp: new Date()
        };
        
        setChatMessages(prev => [...prev, supportMessage]);
      }, 1000);
    }
  };
  
  const handleFaqSelect = (answer: string) => {
    const faqMessage: ChatMessage = {
      id: Date.now().toString(),
      text: answer,
      sender: "support",
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, faqMessage]);
    setShowFaq(false);
    
    toast({
      description: "Если у вас остались вопросы, напишите нам"
    });
  };
  
  const requestLiveSupport = () => {
    const systemMessage: ChatMessage = {
      id: Date.now().toString(),
      text: "Запрос отправлен. Специалист подключится к чату в течение 5 минут.",
      sender: "support",
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, systemMessage]);
    setShowFaq(false);
    
    toast({
      description: "Специалист скоро подключится к чату"
    });
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{t("settings", "title")}</CardTitle>
          <CardDescription>{t("settings", "description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general" className="space-y-4">
            <TabsList>
              <TabsTrigger value="general">{t("settings", "tabs.general")}</TabsTrigger>
              <TabsTrigger value="notifications">{t("settings", "tabs.notifications")}</TabsTrigger>
              <TabsTrigger value="display">{t("settings", "tabs.display")}</TabsTrigger>
              <TabsTrigger value="support">{t("settings", "tabs.support")}</TabsTrigger>
              <TabsTrigger value="subscription">{t("settings", "tabs.subscription")}</TabsTrigger>
              <TabsTrigger value="referral">{t("settings", "tabs.referral")}</TabsTrigger>
            </TabsList>
            <TabsContent value="general" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t("settings", "general.name")}</Label>
                <Input id="name" defaultValue="John Doe" className="bg-background" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t("settings", "general.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue="john.doe@example.com"
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label>{t("settings", "general.language")}</Label>
                <Select onValueChange={changeLanguage} defaultValue={currentLanguage}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={t("settings", "general.selectLanguage")} />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
            <TabsContent value="notifications" className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications">{t("settings", "notifications.enable")}</Label>
                <Switch
                  id="notifications"
                  checked={notificationsEnabled}
                  onCheckedChange={(checked) => setNotificationsEnabled(checked)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-notifications">
                  {t("settings", "notifications.emailFrequency")}
                </Label>
                <Select defaultValue="daily">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={t("settings", "notifications.selectFrequency")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instant">{t("settings", "notifications.instant")}</SelectItem>
                    <SelectItem value="daily">{t("settings", "notifications.daily")}</SelectItem>
                    <SelectItem value="weekly">{t("settings", "notifications.weekly")}</SelectItem>
                    <SelectItem value="off">{t("settings", "notifications.off")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
            <TabsContent value="display" className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="theme">{t("settings", "display.theme")}</Label>
                <Select onValueChange={handleThemeChange} defaultValue={theme}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={t("settings", "display.selectTheme")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">{t("settings", "display.light")}</SelectItem>
                    <SelectItem value="dark">{t("settings", "display.dark")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="font-size">{t("settings", "display.fontSize")}</Label>
                <Select defaultValue="medium">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={t("settings", "display.selectSize")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">{t("settings", "display.small")}</SelectItem>
                    <SelectItem value="medium">{t("settings", "display.medium")}</SelectItem>
                    <SelectItem value="large">{t("settings", "display.large")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
            <TabsContent value="support" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t('settings', 'support.chatTitle')}</CardTitle>
                  <CardDescription>{t('settings', 'support.chatDescription')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] flex flex-col relative">
                    <div className="flex-1 overflow-y-auto mb-4 p-4 border rounded-lg">
                      {chatMessages.map((message) => (
                        <div 
                          key={message.id} 
                          className={`mb-3 flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div 
                            className={`px-4 py-2 rounded-lg max-w-[80%] ${
                              message.sender === "user" 
                                ? "bg-primary text-primary-foreground ml-auto" 
                                : "bg-muted"
                            }`}
                          >
                            <p>{message.text}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {showFaq && (
                      <div className="absolute bottom-16 left-0 right-0 bg-card border rounded-lg p-4 shadow-lg">
                        <h3 className="text-lg font-medium mb-2">Частые вопросы:</h3>
                        <div className="space-y-2 mb-4">
                          {faqItems.map((item) => (
                            <div 
                              key={item.id}
                              className="p-2 bg-background hover:bg-muted rounded cursor-pointer transition-colors"
                              onClick={() => handleFaqSelect(item.answer)}
                            >
                              {item.question}
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between">
                          <Button variant="outline" onClick={() => setShowFaq(false)}>
                            {t('settings', 'support.closeFaq')}
                          </Button>
                          <Button onClick={requestLiveSupport}>
                            {t('settings', 'support.contactSpecialist')}
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <Input
                        placeholder={t('settings', 'support.enterMessage')}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      />
                      <Button onClick={handleSendMessage}>{t('settings', 'support.sendMessage')}</Button>
                      <Button variant="outline" onClick={() => setShowFaq(!showFaq)}>
                        FAQ
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="text-lg font-medium mb-4">{t('settings', 'support.faq')}</h3>
                    <Accordion type="single" collapsible className="w-full">
                      {faqItems.map((item) => (
                        <AccordionItem key={item.id} value={item.id}>
                          <AccordionTrigger>{item.question}</AccordionTrigger>
                          <AccordionContent>
                            {item.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="subscription" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t('subscription', 'current')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{t('subscription', 'freePlan')}</p>
                  <Button className="mt-4">{t('subscription', 'upgrade')}</Button>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="referral" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t('subscription', 'referral')}</CardTitle>
                  <CardDescription>{t('subscription', 'referralDescription')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label>{t('subscription', 'yourReferralCode')}</Label>
                      <div className="flex mt-2">
                        <Input value="CODE123" readOnly className="bg-background" />
                        <Button variant="outline" className="ml-2">{t('subscription', 'copy')}</Button>
                        <Button className="ml-2">{t('subscription', 'share')}</Button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div>
                        <p className="text-sm text-muted-foreground">{t('subscription', 'invitedUsers')}</p>
                        <p className="text-2xl font-bold">1/3</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t('subscription', 'remainingToReward')}</p>
                        <p className="text-2xl font-bold">2</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
