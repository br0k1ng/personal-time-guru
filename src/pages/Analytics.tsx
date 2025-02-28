
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
} from "recharts";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle } from "lucide-react";

// Локализация интерфейса
const locales = {
  ru: {
    title: "Аналитика",
    description: "Визуальное представление вашей продуктивности и активности",
    tabs: {
      tasks: "Задачи",
      habits: "Привычки",
      schedule: "Расписание"
    },
    task: {
      weeklyTitle: "Выполнение задач за неделю",
      weeklyDesc: "Сравнение выполненных и запланированных задач по дням",
      categoriesTitle: "Распределение по категориям",
      categoriesDesc: "Процентное соотношение задач по категориям",
      planned: "запланировано",
      completed: "выполнено"
    },
    habit: {
      progressTitle: "Прогресс привычек",
      progressDesc: "Процент выполнения привычек за последний месяц",
      dynamicsTitle: "Динамика выполнения привычек",
      dynamicsDesc: "Количество выполненных привычек за месяц",
      progress: "прогресс",
      performed: "выполнено",
      day: "день"
    },
    schedule: {
      distributionTitle: "Распределение событий",
      distributionDesc: "Категории запланированных событий",
      timeDistributionTitle: "Распределение событий по времени",
      timeDistributionDesc: "Количество событий в разное время дня",
      amount: "количество",
      hour: "час"
    },
    ui: {
      refreshData: "Обновить данные",
      exportData: "Экспорт",
      notifications: "Уведомления",
      noData: "Нет данных для отображения",
      language: "Язык",
      tip: "Совет: Отправьте команду /stats в бота, чтобы получить сводку вне приложения"
    }
  },
  en: {
    title: "Analytics",
    description: "Visual representation of your productivity and activity",
    tabs: {
      tasks: "Tasks",
      habits: "Habits",
      schedule: "Schedule"
    },
    task: {
      weeklyTitle: "Task completion by week",
      weeklyDesc: "Comparison of completed and planned tasks by day",
      categoriesTitle: "Distribution by categories",
      categoriesDesc: "Percentage of tasks by categories",
      planned: "planned",
      completed: "completed"
    },
    habit: {
      progressTitle: "Habit progress",
      progressDesc: "Percentage of habits completion for the last month",
      dynamicsTitle: "Habit completion dynamics",
      dynamicsDesc: "Number of completed habits per month",
      progress: "progress",
      performed: "completed",
      day: "day"
    },
    schedule: {
      distributionTitle: "Event distribution",
      distributionDesc: "Categories of scheduled events",
      timeDistributionTitle: "Event distribution by time",
      timeDistributionDesc: "Number of events at different times of the day",
      amount: "amount",
      hour: "hour"
    },
    ui: {
      refreshData: "Refresh data",
      exportData: "Export",
      notifications: "Notifications",
      noData: "No data to display",
      language: "Language",
      tip: "Tip: Send /stats command to the bot to get a summary outside the app"
    }
  },
  zh: {
    title: "分析",
    description: "生产力和活动的可视化表示",
    tabs: {
      tasks: "任务",
      habits: "习惯",
      schedule: "日程"
    },
    task: {
      weeklyTitle: "每周任务完成情况",
      weeklyDesc: "按天比较已完成和计划任务",
      categoriesTitle: "按类别分布",
      categoriesDesc: "按类别的任务百分比",
      planned: "计划",
      completed: "完成"
    },
    habit: {
      progressTitle: "习惯进度",
      progressDesc: "上个月习惯完成百分比",
      dynamicsTitle: "习惯完成动态",
      dynamicsDesc: "每月完成的习惯数量",
      progress: "进度",
      performed: "完成",
      day: "天"
    },
    schedule: {
      distributionTitle: "事件分布",
      distributionDesc: "计划事件的类别",
      timeDistributionTitle: "按时间的事件分布",
      timeDistributionDesc: "一天中不同时间的事件数量",
      amount: "数量",
      hour: "小时"
    },
    ui: {
      refreshData: "刷新数据",
      exportData: "导出",
      notifications: "通知",
      noData: "没有要显示的数据",
      language: "语言",
      tip: "提示：向机器人发送 /stats 命令以在应用外获取摘要"
    }
  }
};

// Компонент для отображения аналитики по задачам
function TaskAnalytics({ locale }) {
  const t = locales[locale];
  
  // Данные о выполнении задач по дням недели
  const weeklyData = [
    { name: locale === 'ru' ? "Пн" : (locale === 'zh' ? "周一" : "Mon"), 
      [t.task.planned]: 6, [t.task.completed]: 4 },
    { name: locale === 'ru' ? "Вт" : (locale === 'zh' ? "周二" : "Tue"), 
      [t.task.planned]: 5, [t.task.completed]: 5 },
    { name: locale === 'ru' ? "Ср" : (locale === 'zh' ? "周三" : "Wed"), 
      [t.task.planned]: 7, [t.task.completed]: 3 },
    { name: locale === 'ru' ? "Чт" : (locale === 'zh' ? "周四" : "Thu"), 
      [t.task.planned]: 8, [t.task.completed]: 6 },
    { name: locale === 'ru' ? "Пт" : (locale === 'zh' ? "周五" : "Fri"), 
      [t.task.planned]: 8, [t.task.completed]: 7 },
    { name: locale === 'ru' ? "Сб" : (locale === 'zh' ? "周六" : "Sat"), 
      [t.task.planned]: 4, [t.task.completed]: 2 },
    { name: locale === 'ru' ? "Вс" : (locale === 'zh' ? "周日" : "Sun"), 
      [t.task.planned]: 2, [t.task.completed]: 1 },
  ];

  // Данные по категориям задач
  const categoriesData = [
    { name: locale === 'ru' ? "Работа" : (locale === 'zh' ? "工作" : "Work"), value: 40 },
    { name: locale === 'ru' ? "Учеба" : (locale === 'zh' ? "学习" : "Study"), value: 25 },
    { name: locale === 'ru' ? "Личное" : (locale === 'zh' ? "个人" : "Personal"), value: 20 },
    { name: locale === 'ru' ? "Дом" : (locale === 'zh' ? "家庭" : "Home"), value: 10 },
    { name: locale === 'ru' ? "Другое" : (locale === 'zh' ? "其他" : "Other"), value: 5 },
  ];

  // Цвета для диаграммы
  const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t.task.weeklyTitle}</CardTitle>
          <CardDescription>
            {t.task.weeklyDesc}
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
              <Bar dataKey={t.task.planned} fill="#93c5fd" />
              <Bar dataKey={t.task.completed} fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t.task.categoriesTitle}</CardTitle>
          <CardDescription>
            {t.task.categoriesDesc}
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
function HabitAnalytics({ locale }) {
  const t = locales[locale];
  
  // Данные о прогрессе выполнения привычек
  const progressData = [
    { name: locale === 'ru' ? "Медитация" : (locale === 'zh' ? "冥想" : "Meditation"), 
      [t.habit.progress]: 85 },
    { name: locale === 'ru' ? "Чтение" : (locale === 'zh' ? "阅读" : "Reading"), 
      [t.habit.progress]: 65 },
    { name: locale === 'ru' ? "Спорт" : (locale === 'zh' ? "运动" : "Sports"), 
      [t.habit.progress]: 40 },
    { name: locale === 'ru' ? "Правильное питание" : (locale === 'zh' ? "健康饮食" : "Healthy eating"), 
      [t.habit.progress]: 78 },
    { name: locale === 'ru' ? "Изучение английского" : (locale === 'zh' ? "学习英语" : "Learning English"), 
      [t.habit.progress]: 55 },
  ];

  // Данные о выполнении привычек по дням
  const monthlyData = [
    { [t.habit.day]: "1", [t.habit.performed]: 3 },
    { [t.habit.day]: "4", [t.habit.performed]: 4 },
    { [t.habit.day]: "7", [t.habit.performed]: 2 },
    { [t.habit.day]: "10", [t.habit.performed]: 5 },
    { [t.habit.day]: "13", [t.habit.performed]: 4 },
    { [t.habit.day]: "16", [t.habit.performed]: 3 },
    { [t.habit.day]: "19", [t.habit.performed]: 5 },
    { [t.habit.day]: "22", [t.habit.performed]: 4 },
    { [t.habit.day]: "25", [t.habit.performed]: 5 },
    { [t.habit.day]: "28", [t.habit.performed]: 3 },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t.habit.progressTitle}</CardTitle>
          <CardDescription>
            {t.habit.progressDesc}
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
              <Bar dataKey={t.habit.progress} fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t.habit.dynamicsTitle}</CardTitle>
          <CardDescription>
            {t.habit.dynamicsDesc}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={t.habit.day} />
              <YAxis domain={[0, 'dataMax + 1']} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey={t.habit.performed}
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
function ScheduleAnalytics({ locale }) {
  const t = locales[locale];
  
  // Данные о распределении событий по категориям
  const eventCategoriesData = [
    { name: locale === 'ru' ? "Встречи" : (locale === 'zh' ? "会议" : "Meetings"), value: 30 },
    { name: locale === 'ru' ? "Работа" : (locale === 'zh' ? "工作" : "Work"), value: 35 },
    { name: locale === 'ru' ? "Учеба" : (locale === 'zh' ? "学习" : "Study"), value: 20 },
    { name: locale === 'ru' ? "Личное" : (locale === 'zh' ? "个人" : "Personal"), value: 15 },
  ];
  
  // Цвета для диаграммы
  const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b"];

  // Данные о занятости по часам дня
  const hourlyData = [
    { [t.schedule.hour]: "6-8", [t.schedule.amount]: 1 },
    { [t.schedule.hour]: "8-10", [t.schedule.amount]: 3 },
    { [t.schedule.hour]: "10-12", [t.schedule.amount]: 5 },
    { [t.schedule.hour]: "12-14", [t.schedule.amount]: 2 },
    { [t.schedule.hour]: "14-16", [t.schedule.amount]: 4 },
    { [t.schedule.hour]: "16-18", [t.schedule.amount]: 6 },
    { [t.schedule.hour]: "18-20", [t.schedule.amount]: 3 },
    { [t.schedule.hour]: "20-22", [t.schedule.amount]: 1 },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t.schedule.distributionTitle}</CardTitle>
          <CardDescription>
            {t.schedule.distributionDesc}
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
          <CardTitle>{t.schedule.timeDistributionTitle}</CardTitle>
          <CardDescription>
            {t.schedule.timeDistributionDesc}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hourlyData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={t.schedule.hour} />
              <YAxis />
              <Tooltip />
              <Bar dataKey={t.schedule.amount} fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Analytics() {
  const [activeTab, setActiveTab] = useState("tasks");
  const [locale, setLocale] = useState<"ru" | "en" | "zh">("ru");
  const t = locales[locale];

  return (
    <div className="space-y-4 fade-in">
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-semibold">{t.title}</CardTitle>
            <CardDescription>
              {t.description}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={locale} onValueChange={(val) => setLocale(val as "ru" | "en" | "zh")}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t.ui.language} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ru">Русский</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="zh">中文</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              {t.ui.refreshData}
            </Button>
            <Button variant="outline" size="sm">
              {t.ui.exportData}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 bg-amber-50 p-4 rounded-md border border-amber-200 text-amber-800 flex items-start gap-2">
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <p className="text-sm">{t.ui.tip}</p>
          </div>

          <Tabs defaultValue="tasks" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full mb-6">
              <TabsTrigger value="tasks" className="flex-1">{t.tabs.tasks}</TabsTrigger>
              <TabsTrigger value="habits" className="flex-1">{t.tabs.habits}</TabsTrigger>
              <TabsTrigger value="schedule" className="flex-1">{t.tabs.schedule}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tasks">
              <TaskAnalytics locale={locale} />
            </TabsContent>
            
            <TabsContent value="habits">
              <HabitAnalytics locale={locale} />
            </TabsContent>
            
            <TabsContent value="schedule">
              <ScheduleAnalytics locale={locale} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
