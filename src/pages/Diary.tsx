
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DiaryEntryForm } from "@/components/diary/DiaryEntryForm";
import { DiaryEntry } from "@/components/diary/DiaryEntry";
import type { DiaryEntry as DiaryEntryType, CreateDiaryEntryData } from "@/types/diary";

export default function Diary() {
  const [entries, setEntries] = useState<DiaryEntryType[]>([]);

  const handleCreateEntry = (data: CreateDiaryEntryData) => {
    const newEntry: DiaryEntryType = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setEntries((prev) => [newEntry, ...prev]);
  };

  return (
    <div className="space-y-6 fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">My Diary</CardTitle>
        </CardHeader>
        <CardContent>
          <DiaryEntryForm onSubmit={handleCreateEntry} />
        </CardContent>
      </Card>

      <div className="space-y-4">
        {entries.map((entry) => (
          <DiaryEntry key={entry.id} entry={entry} />
        ))}
        {entries.length === 0 && (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-muted-foreground">
                No entries yet. Start writing your thoughts above...
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
