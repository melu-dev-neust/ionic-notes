import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MainNavbarComponent } from '../../components/main-navbar/main-navbar.component';
import { NotesService } from '../../services/notes';
import { Note } from '../../models/note';
import { IonHeader, IonToolbar, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from "@ionic/angular";

@Component({
  selector: 'app-shared-notes',
  standalone: true,
  imports: [IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonContent, IonToolbar, IonHeader, CommonModule, MainNavbarComponent],
  templateUrl: './shared-notes.page.html',
  styleUrls: ['./shared-notes.page.scss'],
})
export class SharedNotesPage implements OnInit {
  sharedNotes: Note[] = [];

  constructor(private notesService: NotesService, private router: Router) {}

  ngOnInit() {
    this.notesService.sharedNotes$.subscribe(n => (this.sharedNotes = n));
  }

  openNote(note: Note) {
    // shared notes open read-only-ish; you can add sharing metadata later
    this.router.navigate(['/note-editor', note.id], { queryParams: { shared: true } });
  }
}