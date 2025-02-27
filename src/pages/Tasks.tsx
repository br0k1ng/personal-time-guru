
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Tasks() {
  return (
    <div className="space-y-4 fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Task Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Organize your tasks here...</p>
        </CardContent>
      </Card>
    </div>
  );
}
