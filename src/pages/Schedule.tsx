
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Schedule() {
  return (
    <div className="space-y-4 fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Моё расписание</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Планируйте свой день здесь...</p>
        </CardContent>
      </Card>
    </div>
  );
}
