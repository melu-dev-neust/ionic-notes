    import { Component, HostListener, computed, inject, signal } from '@angular/core';
    import { toSignal } from '@angular/core/rxjs-interop';
    import { CommonModule } from '@angular/common';
    import { Router } from '@angular/router';
    import { MainNavbarComponent } from '../../components/main-navbar/main-navbar.component';
    import { NotesService } from '../../services/notes';
    import { SharedNote } from '../../models/shared-note';
    import { distributeMasonry, masonryColumnCount } from '../../utils/masonry';
    import { IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from "@ionic/angular";

    @Component({
    selector: 'app-shared-notes',
    standalone: true,
    imports: [IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonContent, CommonModule, MainNavbarComponent],
    templateUrl: './shared-notes.page.html',
    styleUrls: ['./shared-notes.page.scss'],
    })
    export class SharedNotesPage {
    private notesService = inject(NotesService);
    private router = inject(Router);

    private sharedNotes = toSignal(this.notesService.sharedNotes$, { initialValue: [] as SharedNote[] });
    private columnCount = signal(masonryColumnCount());

    // recalculated automatically whenever the notes or the column count change
    columns = computed(() =>
        distributeMasonry(
        this.sharedNotes(),
        this.columnCount(),
        n => ({ title: n.sharedNote_title, content: n.sharedNote_content })
        )
    );

    // runs every time the page is shown
    ionViewWillEnter() {
        this.notesService.getAllSharedNotes();
    }

    @HostListener('window:resize')
    onResize() {
        this.columnCount.set(masonryColumnCount());
    }

    openNote(note: SharedNote) {
        this.router.navigate(['/note-editor', note.sharedNote_id], { queryParams: { shared: true } });
    }
    }