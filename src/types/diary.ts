
export interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateDiaryEntryData = Omit<DiaryEntry, "id" | "createdAt" | "updatedAt">;
