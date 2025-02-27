
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Schedule() {
  return (
    <div className="space-y-4 fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">My Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Plan your day here...</p>
        </CardContent>
      </Card>
    </div>
  );
}
