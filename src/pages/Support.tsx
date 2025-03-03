
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Send, ThumbsUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Интерфейс для сообщений чата
interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "support";
  timestamp: Date;
}

// Интерфейс для отзыва
interface FeedbackData {
  type: string;
  subject: string;
  message: string;
  rating?: number;
}

export default function Support() {
  const { toast } = useToast();
  
  // Состояние чата
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      text: "Добро пожаловать в службу поддержки! Чем мы можем вам помочь?",
      sender: "support",
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState("");
  
  // Состояние формы обратной связи
  const [feedbackData, setFeedbackData] = useState<FeedbackData>({
    type: "suggestion",
    subject: "",
    message: ""
  });
  
  // Обработчик отправки сообщения в чат
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // Добавляем сообщение пользователя
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: newMessage,
      sender: "user",
      timestamp: new Date()
    };
    
    setChatMessages([...chatMessages, userMessage]);
    setNewMessage("");
    
    // Имитация ответа от поддержки через 1 секунду
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
  
  // Обработчик отправки формы обратной связи
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
    
    // Здесь будет отправка данных на сервер
    console.log("Отправка обратной связи:", feedbackData);
    
    toast({
      title: "Отзыв отправлен",
      description: "Благодарим за ваш отзыв! Мы обязательно его рассмотрим.",
    });
    
    // Сброс формы
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
          <CardTitle className="text-2xl font-semibold">Поддержка и обратная связь</CardTitle>
          <CardDescription>
            Напишите нам, если у вас возникли вопросы или предложения
          </CardDescription>
        </CardHeader>
        <CardContent>
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
            
            {/* Вкладка чата */}
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
            
            {/* Вкладка обратной связи */}
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
        </CardContent>
      </Card>
    </div>
  );
}
