
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Diary() {
  return (
    <div className="space-y-4 fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">My Diary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Start writing your thoughts...</p>
        </CardContent>
      </Card>
    </div>
  );
}
