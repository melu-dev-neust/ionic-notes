import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { MainNavbarComponent } from '../../components/main-navbar/main-navbar.component';
import { NotesService } from '../../services/notes';
import { Note } from '../../models/note';
import { Category } from '../../models/category';
import { IonContent, IonCardContent, IonCard, IonButton, IonIcon, IonCardHeader, IonCardTitle, IonFab, IonFabButton } from "@ionic/angular";

@Component({
    selector: 'app-my-notes',
    imports: [IonFabButton, IonFab, IonCardTitle, IonCardHeader, IonIcon, IonButton, IonCard, IonCardContent, IonContent, CommonModule, MainNavbarComponent],
    templateUrl: './my-notes.page.html',
    styleUrls: ['./my-notes.page.scss'],
})
export class MyNotesPage implements OnInit {
    categories: Category[] = [];
    notes: Note[] = [];
    activeCategory = 'All';
    filteredNotes: Note[] = [];

    constructor(private notesService: NotesService, private router: Router,private cdr: ChangeDetectorRef) {}

    ngOnInit() {
        // console.log('my-notes init')
        // this.notesService.getAllNotes();
        // this.notesService.getAllCategories();

        this.notesService.categories$.subscribe(c => {
            this.categories = c;
            this.applyFilter();
        });

        this.notesService.notes$.subscribe(n => {
            this.notes = n;
            this.applyFilter();
        });

        this.notesService.activeCategory$.subscribe(c => {
            this.activeCategory = c;
            this.applyFilter();
        });
    }

    // runs every time the page is shown, not just when it is first created
    ionViewWillEnter() {
        this.notesService.getAllNotes();
        this.notesService.getAllCategories();
    }

    applyFilter() {
        if (this.activeCategory === 'All') {
            this.filteredNotes = this.notes;
        } else {
            const selectedCategory = this.categories.find(c => c.category_name === this.activeCategory);
            this.filteredNotes = selectedCategory ? this.notes.filter(n => Number(n.category_id) === Number(selectedCategory.category_id)) : [];
        }
        this.cdr.markForCheck();
    }

    selectCategory(name: string) {
        // clicking a category card filters notes here
        this.notesService.setActiveCategory(this.activeCategory === name ? 'All' : name);
    }

    openNote(note: Note) {
        this.router.navigate(['/note-editor', note.note_id]);
    }

    addNote() {
        // passing no id navigates to editor in "new" mode, category auto-applies
        this.router.navigate(['/note-editor', 'new']);
    }

    goToFolders() {
        this.router.navigate(['/category']);
    }
}
