
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { DiaryEntry as DiaryEntryType } from "@/types/diary";

interface DiaryEntryProps {
  entry: DiaryEntryType;
}

export function DiaryEntry({ entry }: DiaryEntryProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{entry.title}</CardTitle>
          <span className="text-sm text-muted-foreground">
            {format(new Date(entry.createdAt), "PPP p")}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap">{entry.content}</p>
      </CardContent>
    </Card>
  );
}
