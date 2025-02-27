
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Habits() {
  return (
    <div className="space-y-4 fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Habit Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Track your daily habits...</p>
        </CardContent>
      </Card>
    </div>
  );
}
