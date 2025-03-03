
import { CalendarDays, BookOpen, ListTodo, ActivitySquare, Settings, BarChart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { useMobile } from "@/hooks/use-mobile";

const navigation = [
  { name: "Дневник", href: "/diary", icon: BookOpen },
  { name: "Задачи", href: "/tasks", icon: ListTodo },
  { name: "Расписание", href: "/schedule", icon: CalendarDays },
  { name: "Привычки", href: "/habits", icon: ActivitySquare },
  { name: "Аналитика", href: "/analytics", icon: BarChart },
  { name: "Настройки", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const isMobile = useMobile();

  return (
    <div className="flex flex-col w-64 bg-card border-r">
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-primary">Ассистент</h1>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {navigation.map((item) => {
          const isActive = location.pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
