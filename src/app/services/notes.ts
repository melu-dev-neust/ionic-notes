import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Note } from '../models/note';
import { Category } from '../models/category';
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class NotesService {

  // ===== FAKE DATA (replace with HttpClient calls to your PHP API later) =====

    private _notes: Note[] = [
        { id: 1, note_title: 'Grocery List', note_content: 'Milk, eggs, bread, butter, apples, and a bag of coffee beans for the weekend.', category: 'Personal', created_at: '2026-01-12T09:15:00' },
        { id: 2, note_title: 'Project Ideas', note_content: 'Build a habit tracker. Maybe a recipe manager with meal planning. Or a budget app that syncs across devices.', category: 'Work', created_at: '2026-01-10T14:30:00' },
        { id: 3, note_title: 'Meeting Notes', note_content: 'Discussed Q1 roadmap. Priorities: auth flow, dashboard redesign, and API rate limiting. Next sync Friday.', category: 'Work', created_at: '2026-01-08T11:00:00' },
        { id: 4, note_title: 'Book Recommendations', note_content: 'The Pragmatic Programmer. Designing Data-Intensive Applications. Refactoring by Martin Fowler.', category: 'Personal', created_at: '2026-01-05T19:45:00' },
        { id: 5, note_title: 'Workout Plan', note_content: 'Monday legs, Wednesday push, Friday pull. Add 20 min cardio after each session. Rest on weekends.', category: 'Health', created_at: '2026-01-03T07:20:00' },
        { id: 6, note_title: 'Travel Checklist', note_content: 'Passport, charger, headphones, power bank, meds. Don’t forget the hotel confirmation email.', category: 'Personal', created_at: '2025-12-28T16:10:00' },
        { id: 7, note_title: 'Debugging Tips', note_content: 'Reproduce first. Isolate the smallest failing case. Read the error message properly before Googling.', category: 'Work', created_at: '2025-12-20T10:05:00' },
        { id: 8, note_title: 'Recipe: Pasta', note_content: 'Garlic, olive oil, cherry tomatoes, basil, parmesan. Reserve pasta water to emulsify the sauce.', category: 'Health', created_at: '2025-12-15T18:00:00' },
        { id: 8, note_title: 'Time Management!!', note_content: 'problem again!', category: 'Personal', created_at: '2025-12-15T18:00:00' },
    ];

    private _sharedNotes: Note[] = [
        { id: 101, note_title: 'Team Retro', note_content: 'What went well: shipping on time. What didn’t: too many context switches. Action: batch meetings.', category: 'Work', created_at: '2026-01-11T13:00:00' },
        { id: 102, note_title: 'Re: Trip Photos', note_content: 'Sending over the drive link. Let me know which ones you want to keep — I’ll delete the rest.', category: null, created_at: '2026-01-09T08:40:00' },
        { id: 103, note_title: 'Shared Budget', note_content: 'Groceries this month: $312. Utilities: $98. Let’s split the difference next weekend.', category: 'Personal', created_at: '2026-01-02T21:00:00' },
    ];

    private _categories: Category[] = [
        { id: 1, name: 'Personal' },
        { id: 2, name: 'Work' },
        { id: 3, name: 'Health' },
    ];

    private _user: User = { id: 1, email: 'alex@example.com', username: 'alex_dev' };


  // ===== REACTIVE STATE =====

  private notesSubject = new BehaviorSubject<Note[]>(this._notes);
  notes$ = this.notesSubject.asObservable();

  private sharedSubject = new BehaviorSubject<Note[]>(this._sharedNotes);
  sharedNotes$ = this.sharedSubject.asObservable();

  private categoriesSubject = new BehaviorSubject<Category[]>(this._categories);
  categories$ = this.categoriesSubject.asObservable();

  // Currently selected category filter ('All' = no filter)
  private activeCategorySubject = new BehaviorSubject<string>('All');
  activeCategory$ = this.activeCategorySubject.asObservable();

  getUser(): User { return this._user; }

  setActiveCategory(name: string) {
    this.activeCategorySubject.next(name);
  }
  getActiveCategory(): string {
    return this.activeCategorySubject.value;
  }

  // ===== NOTES =====

  getNote(id: number): Note | undefined {
    return this.notesSubject.value.find(n => n.id === id);
  }

  /** Create a note. Category is auto-assigned to the active one if provided. */
  addNote(note_title: string, note_content: string, category?: string | null): Note {
    const cat = category ?? (this.getActiveCategory() === 'All' ? null : this.getActiveCategory());
    const note: Note = {
      id: Date.now(),
      note_title: note_title || 'Untitled',
      note_content,
      category: cat,
      created_at: new Date().toISOString(),
    };
    this.notesSubject.next([note, ...this.notesSubject.value]);
    return note;
  }

  updateNote(id: number, changes: Partial<Note>) {
    const updated = this.notesSubject.value.map(n =>
      n.id === id ? { ...n, ...changes, created_at: new Date().toISOString() } : n
    );
    this.notesSubject.next(updated);
  }

  /** Autosave used by the editor page. Creates if id is 0/new, otherwise updates. */
  saveNote(note: Partial<Note> & { id?: number }): Note {
    if (note.id) {
      this.updateNote(note.id, note);
      return this.getNote(note.id)!;
    }
    return this.addNote(note.note_title || '', note.note_content || '', note.category ?? null);
  }

  deleteNote(id: number) {
    this.notesSubject.next(this.notesSubject.value.filter(n => n.id !== id));
  }

  moveNote(id: number, category: string | null) {
    this.updateNote(id, { category });
  }

  /** Share a note to another user (stubbed — PHP API later). */
  shareNote(note: Note, targetUsername: string) {
    // TODO: POST to /api/share.php { note_id, target_username }
    console.log(`Sharing note ${note.id} with ${targetUsername}`);
  }

  // ===== CATEGORIES =====

  addCategory(name: string): Category {
    const cat: Category = { id: Date.now(), name };
    this.categoriesSubject.next([...this.categoriesSubject.value, cat]);
    return cat;
  }




  // ===== AUTH (stub — replace with HttpClient calls to your PHP API later) =====

  // login(email, password) / register(email, password, username) / logout()
  // searchUser(username) etc.
  
/** Returns true on success. TODO: POST /api/login.php { email, password } */
login(email: string, password: string): boolean {
  // fake check: any non-empty credentials "succeed" for now
  if (!email || !password) return false;
  this._user = { id: 1, email, username: email.split('@')[0] };
  return true;
}

/** Returns true on success, false if username is taken. TODO: POST /api/register.php */
register(email: string, password: string, username: string): boolean {
  // fake uniqueness check against a small list
  const taken = ['alex_dev', 'admin', 'test'].includes(username.toLowerCase());
  if (taken) return false;
  this._user = { id: 1, email, username };
  return true;
}

logout() {
  // TODO: clear token
}

}