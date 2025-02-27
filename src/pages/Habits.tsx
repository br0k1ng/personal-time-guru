
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Habits() {
  return (
    <div className="space-y-4 fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Трекер привычек</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Отслеживайте свои ежедневные привычки...</p>
        </CardContent>
      </Card>
    </div>
  );
}
