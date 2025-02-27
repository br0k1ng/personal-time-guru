
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Analytics() {
  return (
    <div className="space-y-4 fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Аналитика</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Просмотр статистики продуктивности...</p>
        </CardContent>
      </Card>
    </div>
  );
}
