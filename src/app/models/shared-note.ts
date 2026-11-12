export interface SharedNote {
    sharedNote_id: number;
    user_id: number;
    received_from_id: number;
    source_note_id: number | null;
    sharedNote_title: string;
    sharedNote_content: string;
    created_at: string;
    received_from_username: string;
}