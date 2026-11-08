export interface Note {
    note_id: number;
    user_id: number;
    category_id: number | null;
    note_title: string;
    note_content: string;
    created_at: string;
}