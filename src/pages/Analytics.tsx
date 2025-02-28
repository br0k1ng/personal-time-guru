
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
} from "recharts";

// Компонент для отображения аналитики по задачам
function TaskAnalytics() {
  // Данные о выполнении задач по дням недели
  const weeklyData = [
    { name: "Пн", выполнено: 4, запланировано: 6 },
    { name: "Вт", выполнено: 5, запланировано: 5 },
    { name: "Ср", выполнено: 3, запланировано: 7 },
    { name: "Чт", выполнено: 6, запланировано: 8 },
    { name: "Пт", выполнено: 7, запланировано: 8 },
    { name: "Сб", выполнено: 2, запланировано: 4 },
    { name: "Вс", выполнено: 1, запланировано: 2 },
  ];

  // Данные по категориям задач
  const categoriesData = [
    { name: "Работа", value: 40 },
    { name: "Учеба", value: 25 },
    { name: "Личное", value: 20 },
    { name: "Дом", value: 10 },
    { name: "Другое", value: 5 },
  ];

  // Цвета для диаграммы
  const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Выполнение задач за неделю</CardTitle>
          <CardDescription>
            Сравнение выполненных и запланированных задач по дням
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="запланировано" fill="#93c5fd" />
              <Bar dataKey="выполнено" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Распределение по категориям</CardTitle>
          <CardDescription>
            Процентное соотношение задач по категориям
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoriesData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoriesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

// Компонент для отображения аналитики по привычкам
function HabitAnalytics() {
  // Данные о прогрессе выполнения привычек
  const progressData = [
    { name: "Медитация", прогресс: 85 },
    { name: "Чтение", прогресс: 65 },
    { name: "Спорт", прогресс: 40 },
    { name: "Правильное питание", прогресс: 78 },
    { name: "Изучение английского", прогресс: 55 },
  ];

  // Данные о выполнении привычек по дням
  const monthlyData = [
    { день: "1", выполнено: 3 },
    { день: "4", выполнено: 4 },
    { день: "7", выполнено: 2 },
    { день: "10", выполнено: 5 },
    { день: "13", выполнено: 4 },
    { день: "16", выполнено: 3 },
    { день: "19", выполнено: 5 },
    { день: "22", выполнено: 4 },
    { день: "25", выполнено: 5 },
    { день: "28", выполнено: 3 },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Прогресс привычек</CardTitle>
          <CardDescription>
            Процент выполнения привычек за последний месяц
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart 
              data={progressData} 
              layout="vertical"
              margin={{ top: 20, right: 30, left: 50, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="name" type="category" width={120} />
              <Tooltip />
              <Bar dataKey="прогресс" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Динамика выполнения привычек</CardTitle>
          <CardDescription>
            Количество выполненных привычек за месяц
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="день" />
              <YAxis domain={[0, 'dataMax + 1']} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="выполнено" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                dot={{ r: 5 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

// Компонент для отображения аналитики расписания
function ScheduleAnalytics() {
  // Данные о распределении событий по категориям
  const eventCategoriesData = [
    { name: "Встречи", value: 30 },
    { name: "Работа", value: 35 },
    { name: "Учеба", value: 20 },
    { name: "Личное", value: 15 },
  ];
  
  // Цвета для диаграммы
  const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b"];

  // Данные о занятости по часам дня
  const hourlyData = [
    { час: "6-8", количество: 1 },
    { час: "8-10", количество: 3 },
    { час: "10-12", количество: 5 },
    { час: "12-14", количество: 2 },
    { час: "14-16", количество: 4 },
    { час: "16-18", количество: 6 },
    { час: "18-20", количество: 3 },
    { час: "20-22", количество: 1 },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Распределение событий</CardTitle>
          <CardDescription>
            Категории запланированных событий
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={eventCategoriesData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {eventCategoriesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Распределение событий по времени</CardTitle>
          <CardDescription>
            Количество событий в разное время дня
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hourlyData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="час" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="количество" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Analytics() {
  const [activeTab, setActiveTab] = useState("tasks");

  return (
    <div className="space-y-4 fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Аналитика</CardTitle>
          <CardDescription>
            Визуальное представление вашей продуктивности и активности
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="tasks" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full mb-6">
              <TabsTrigger value="tasks" className="flex-1">Задачи</TabsTrigger>
              <TabsTrigger value="habits" className="flex-1">Привычки</TabsTrigger>
              <TabsTrigger value="schedule" className="flex-1">Расписание</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tasks">
              <TaskAnalytics />
            </TabsContent>
            
            <TabsContent value="habits">
              <HabitAnalytics />
            </TabsContent>
            
            <TabsContent value="schedule">
              <ScheduleAnalytics />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
