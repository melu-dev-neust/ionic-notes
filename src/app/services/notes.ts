import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Note } from '../models/note';
import { SharedNote } from '../models/shared-note';
import { Category } from '../models/category';

@Injectable({ providedIn: 'root' })
export class NotesService {
  private http = inject(HttpClient);

  private readonly api = 'http://localhost/api/ionic-notes-api/api/notes.php';
  private readonly userId = 1; // hardcoded until login exists

  // ===== REACTIVE STATE =====
  private notesSubject = new BehaviorSubject<Note[]>([]);
  notes$ = this.notesSubject.asObservable();

  private sharedSubject = new BehaviorSubject<SharedNote[]>([]);
  sharedNotes$ = this.sharedSubject.asObservable();

  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  categories$ = this.categoriesSubject.asObservable();

  // Currently selected category filter by name ('All' = no filter)
  private activeCategorySubject = new BehaviorSubject<string>('All');
  activeCategory$ = this.activeCategorySubject.asObservable();

  setActiveCategory(name: string) {
    this.activeCategorySubject.next(name);
  }

  getActiveCategory(): string {
    return this.activeCategorySubject.value;
  }

  /** category_id of the active filter, or null when 'All' */
  getActiveCategoryId(): number | null {
    const name = this.getActiveCategory();
    if (name === 'All') return null;
    return this.categoriesSubject.value.find(c => c.category_name === name)?.category_id ?? null;
  }

  // ===== LOADERS =====
  getAllNotes() {
    this.http.get<Note[]>(`${this.api}?type=my-notes&userId=${this.userId}`).subscribe({
      next: res => this.notesSubject.next(res),
      error: err => console.error(err),
    });
  }

  getAllSharedNotes() {
    this.http.get<SharedNote[]>(`${this.api}?type=shared-notes&userId=${this.userId}`).subscribe({
      next: res => this.sharedSubject.next(res),
      error: err => console.error(err),
    });
  }

  getAllCategories() {
    this.http.get<Category[]>(`${this.api}?type=categories&userId=${this.userId}`).subscribe({
      next: res => this.categoriesSubject.next(res),
      error: err => console.error(err),
    });
  }

  // ===== NOTES =====
  getNote(id: number): Note | undefined {
    return this.notesSubject.value.find(n => n.note_id === id);
  }
  
  getSharedNote(id: number): SharedNote | undefined {
  return this.sharedSubject.value.find(s => s.sharedNote_id === id);
}

  /** Create a note. Category defaults to the active filter if not given. */
  addNote(note_title: string, note_content: string, category_id?: number | null): Observable<Note> {
    const body = {
      user_id: this.userId,
      category_id: category_id !== undefined ? category_id : this.getActiveCategoryId(),
      note_title: note_title || 'Untitled',
      note_content,
    };
    return this.http.post<Note>(`${this.api}?type=note`, body).pipe(
      tap(created => this.notesSubject.next([created, ...this.notesSubject.value]))
    );
  }

  updateNote(id: number, changes: Partial<Note>): Observable<Note> {
    const current = this.getNote(id);
    // API expects title, content and category_id on every PUT, so merge with the current note
    const body = {
      note_title: changes.note_title ?? current?.note_title ?? 'Untitled',
      note_content: changes.note_content ?? current?.note_content ?? '',
      category_id: changes.category_id !== undefined ? changes.category_id : (current?.category_id ?? null),
    };
    return this.http.put<Note>(`${this.api}?type=note&id=${id}`, body).pipe(
      tap(updated =>
        this.notesSubject.next(this.notesSubject.value.map(n => (n.note_id === id ? updated : n)))
      )
    );
  }

  /** Autosave for the editor: creates if there's no note_id, otherwise updates. */
  saveNote(note: Partial<Note>): Observable<Note> {
    if (note.note_id) {
      return this.updateNote(note.note_id, note);
    }
    return this.addNote(note.note_title || '', note.note_content || '', note.category_id);
  }

  deleteNote(id: number) {
    return this.http.delete(`${this.api}?type=note&id=${id}`).pipe(
      tap(() => this.notesSubject.next(this.notesSubject.value.filter(n => n.note_id !== id)))
    );
  }

  moveNote(id: number, category_id: number | null) {
    return this.updateNote(id, { category_id });
  }

  // ===== SHARING =====
  shareNote(note_id: number, target_username: string) {
    return this.http.post<{ shared: boolean }>(`${this.api}?type=share`, { note_id, target_username });
    // errors come back as err.error.error (e.g. "User not found", "Already shared with this user")
  }

  deleteSharedNote(id: number) {
    return this.http.delete(`${this.api}?type=shared-note&id=${id}`).pipe(
      tap(() => this.sharedSubject.next(this.sharedSubject.value.filter(s => s.sharedNote_id !== id)))
    );
  }

  // ===== CATEGORIES =====
  deleteCategories(ids: number[]) {
  return this.http
    .delete(`${this.api}?type=category&ids=${ids.join(',')}&userId=${this.userId}`)
    .pipe(
      tap(() => {
        // if the active filter is one of the deleted folders, go back to 'All'
        const activeId = this.getActiveCategoryId();
        if (activeId !== null && ids.includes(Number(activeId))) {
          this.setActiveCategory('All');
        }
        this.categoriesSubject.next(
          this.categoriesSubject.value.filter(c => !ids.includes(Number(c.category_id)))
        );
        // their notes are deleted too
        this.notesSubject.next(
          this.notesSubject.value.filter(
            n => n.category_id == null || !ids.includes(Number(n.category_id))
          )
        );
      })
    );
}

  addCategory(category_name: string): Observable<Category> {
    return this.http
      .post<Category>(`${this.api}?type=category`, { user_id: this.userId, category_name })
      .pipe(tap(cat => this.categoriesSubject.next([...this.categoriesSubject.value, cat])));
  }
}