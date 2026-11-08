import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MainNavbarComponent } from '../../components/main-navbar/main-navbar.component';
import { NotesService } from '../../services/notes';
import { SharedNote } from '../../models/shared-note';
import { IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from "@ionic/angular";

@Component({
  selector: 'app-shared-notes',
  standalone: true,
  imports: [IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonContent, CommonModule, MainNavbarComponent],
  templateUrl: './shared-notes.page.html',
  styleUrls: ['./shared-notes.page.scss'],
})
export class SharedNotesPage implements OnInit {
  sharedNotes: SharedNote[] = [];

  constructor(private notesService: NotesService, private router: Router) {}

  ngOnInit() {
    this.notesService.getAllSharedNotes();
    this.notesService.sharedNotes$.subscribe(n => (this.sharedNotes = n));
  }

  openNote(note: SharedNote) {
    this.router.navigate(['/note-editor', note.sharedNote_id], { queryParams: { shared: true } });
  }
}