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

export default function Settings() {
  const { t, i18n } = useTranslation();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{t("settings.title")}</CardTitle>
          <CardDescription>{t("settings.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general" className="space-y-4">
            <TabsList>
              <TabsTrigger value="general">{t("settings.tabs.general")}</TabsTrigger>
              <TabsTrigger value="notifications">{t("settings.tabs.notifications")}</TabsTrigger>
              <TabsTrigger value="display">{t("settings.tabs.display")}</TabsTrigger>
              <TabsTrigger value="support">{t("settings.tabs.support")}</TabsTrigger>
            </TabsList>
            <TabsContent value="general" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t("settings.general.name")}</Label>
                <Input id="name" defaultValue="John Doe" className="bg-background" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t("settings.general.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue="john.doe@example.com"
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label>{t("settings.general.language")}</Label>
                <Select onValueChange={changeLanguage} defaultValue={i18n.language}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={t("settings.general.selectLanguage")} />
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
                <Label htmlFor="notifications">{t("settings.notifications.enable")}</Label>
                <Switch
                  id="notifications"
                  checked={notificationsEnabled}
                  onCheckedChange={(checked) => setNotificationsEnabled(checked)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-notifications">
                  {t("settings.notifications.emailFrequency")}
                </Label>
                <Select defaultValue="daily" id="email-notifications">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={t("settings.notifications.selectFrequency")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instant">{t("settings.notifications.instant")}</SelectItem>
                    <SelectItem value="daily">{t("settings.notifications.daily")}</SelectItem>
                    <SelectItem value="weekly">{t("settings.notifications.weekly")}</SelectItem>
                    <SelectItem value="off">{t("settings.notifications.off")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
            <TabsContent value="display" className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="theme">{t("settings.display.theme")}</Label>
                <Select onValueChange={setTheme} defaultValue={theme}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={t("settings.display.selectTheme")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">{t("settings.display.light")}</SelectItem>
                    <SelectItem value="dark">{t("settings.display.dark")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="font-size">{t("settings.display.fontSize")}</Label>
                <Select defaultValue="medium" id="font-size">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={t("settings.display.selectSize")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">{t("settings.display.small")}</SelectItem>
                    <SelectItem value="medium">{t("settings.display.medium")}</SelectItem>
                    <SelectItem value="large">{t("settings.display.large")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
            <TabsContent value="support" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t('settings.support.faqTitle', 'Часто задаваемые вопросы')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>{t('settings.support.faq1', 'Как создать новую задачу?')}</AccordionTrigger>
                      <AccordionContent>
                        {t('settings.support.faq1Answer', 'Чтобы создать новую задачу, перейдите в раздел "Задачи" и нажмите кнопку "Создать задачу". Заполните необходимые поля и нажмите "Сохранить".')}
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>{t('settings.support.faq2', 'Как настроить привычки?')}</AccordionTrigger>
                      <AccordionContent>
                        {t('settings.support.faq2Answer', 'Для настройки привычек перейдите в раздел "Привычки". Там вы можете создавать новые привычки, устанавливать периодичность и отслеживать прогресс.')}
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger>{t('settings.support.faq3', 'Как настроить уведомления?')}</AccordionTrigger>
                      <AccordionContent>
                        {t('settings.support.faq3Answer', 'Настройки уведомлений доступны в разделе "Настройки" на вкладке "Уведомления". Здесь вы можете указать, какие уведомления хотите получать и выбрать время их получения.')}
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                      <AccordionTrigger>{t('settings.support.faq4', 'Как изменить язык приложения?')}</AccordionTrigger>
                      <AccordionContent>
                        {t('settings.support.faq4Answer', 'Для изменения языка перейдите в раздел "Настройки" на вкладку "Общие". В выпадающем меню выберите нужный язык интерфейса.')}
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-5">
                      <AccordionTrigger>{t('settings.support.faq5', 'Как посмотреть аналитику?')}</AccordionTrigger>
                      <AccordionContent>
                        {t('settings.support.faq5Answer', 'Для просмотра аналитики перейдите в раздел "Аналитика". Там вы найдете различные графики и статистику по выполнению задач, привычек и расписания.')}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <div className="mt-8 flex flex-col gap-4">
                    <h3 className="text-lg font-medium">{t('settings.support.needMoreHelp', 'Нужна дополнительная помощь?')}</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="border border-dashed hover:border-solid transition-all cursor-pointer">
                        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <MessageSquare className="h-6 w-6 text-primary" />
                          </div>
                          <h3 className="font-medium mb-2">{t('settings.support.chatSupport', 'Чат с поддержкой')}</h3>
                          <p className="text-sm text-muted-foreground">
                            {t('settings.support.chatSupportDesc', 'Свяжитесь с нашим специалистом напрямую через чат')}
                          </p>
                          <Button className="mt-4" variant="outline">
                            {t('settings.support.startChat', 'Начать чат')}
                          </Button>
                        </CardContent>
                      </Card>

                      <Card className="bg-muted/50">
                        <CardContent className="p-6">
                          <h3 className="font-medium mb-4">{t('settings.support.feedback', 'Обратная связь')}</h3>
                          <form className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="subject">{t('settings.support.subject', 'Тема')}</Label>
                              <Select>
                                <SelectTrigger id="subject">
                                  <SelectValue placeholder={t('settings.support.selectSubject', 'Выберите тему')} />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="bug">{t('settings.support.bug', 'Ошибка')}</SelectItem>
                                  <SelectItem value="feature">{t('settings.support.feature', 'Предложение функции')}</SelectItem>
                                  <SelectItem value="question">{t('settings.support.question', 'Вопрос')}</SelectItem>
                                  <SelectItem value="other">{t('settings.support.other', 'Другое')}</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="message">{t('settings.support.message', 'Сообщение')}</Label>
                              <textarea
                                id="message"
                                rows={3}
                                className="w-full min-h-24 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background"
                                placeholder={t('settings.support.messagePlaceholder', 'Опишите вашу проблему или предложение...')}
                              ></textarea>
                            </div>
                            <Button type="submit" className="w-full">
                              {t('settings.support.send', 'Отправить')}
                            </Button>
                          </form>
                        </CardContent>
                      </Card>
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
