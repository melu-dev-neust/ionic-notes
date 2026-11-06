export interface Note {
  id: number;
  note_title: string;
  note_content: string;
  category: string | null;   // category name, or null for "All" / uncategorized
  created_at: string;        // ISO string
}