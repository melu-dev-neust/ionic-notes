import { Component, OnInit, OnDestroy, ChangeDetectorRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { AlertController, ActionSheetController, ToastController, IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonContent } from '@ionic/angular';
import { NotesService } from '../../services/notes';
import { Note } from '../../models/note';

@Component({
    selector: 'app-note-editor',
    imports: [IonContent, IonIcon, IonButton, IonButtons, IonToolbar, IonHeader, CommonModule, FormsModule],
    templateUrl: './note-editor.page.html',
    styleUrls: ['./note-editor.page.scss'],
})
export class NoteEditorPage implements OnInit {
    note: Note = {
        note_id: 0,
        user_id: 1,
        category_id: null,
        note_title: '',
        note_content: '',
        created_at: new Date().toISOString(),
    };
    isNew = false;
    editable = false;
    isShared = false;
    private original = '';

    //==========CONSTRUCTOR===========
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private notesService: NotesService,
        private alertCtrl: AlertController,
        private actionSheetCtrl: ActionSheetController,
        private toastCtrl: ToastController,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit() {
        const idParam = this.route.snapshot.paramMap.get('id');
        this.isShared = this.route.snapshot.queryParamMap.get('shared') === 'true';

        if (idParam === 'new' || idParam === null) {
            this.isNew = true;
            this.editable = true;
            this.note.category_id = this.notesService.getActiveCategoryId();
            return;
        }

        if (this.isShared) {
            const s = this.notesService.getSharedNote(+idParam);
        if (!s) { this.goBack(); return; }
            // map the shared note into the Note shape so the same template works
            this.note = {
                note_id: s.sharedNote_id,
                user_id: s.user_id,
                category_id: null,
                note_title: s.sharedNote_title,
                note_content: s.sharedNote_content,
                created_at: s.created_at,
            };
        } else {
            const existing = this.notesService.getNote(+idParam);
                if (!existing) { this.goBack(); return; }
                this.note = { ...existing };
            }
        this.editable = false;
        this.original = JSON.stringify(this.note);
    }

    enableEdit() {
        if (this.isShared) return;
        this.editable = true;
    }

    private isEmpty() {
        return !this.note.note_title.trim() && !this.note.note_content.trim();
    }



    //===================================================
    // Creates or updates on the server, then runs `after` 
    private saving = false;
        
    private persist(after: () => void) {
        if (this.saving) return; // ignore double taps while a save is in flight
        this.saving = true;

        const done = (saved: Note) => {
            this.saving = false;
            this.note = { ...saved };
            this.isNew = false;
            this.original = JSON.stringify(this.note);
            after();
            this.cdr.markForCheck();
        };
        const fail = (err: any) => {
            this.saving = false;
            this.presentToast(err?.error?.error ?? 'Could not save note');
        };

        if (this.isNew) {
            this.notesService
            .addNote(this.note.note_title, this.note.note_content, this.note.category_id)
            .subscribe({ next: done, error: fail });
        } else {
            this.notesService
            .updateNote(this.note.note_id, {
                note_title: this.note.note_title,
                note_content: this.note.note_content,
            })
            .subscribe({ next: done, error: fail });
        }
    }

    /** Save on back arrow */
    autosave() {
        if (this.isShared) { this.goBack(); return; }
        if (this.isEmpty()) { this.goBack(); return; }
        // skip the request if nothing changed
        if (!this.isNew && JSON.stringify(this.note) === this.original) { this.goBack(); return; }
        this.persist(() => this.goBack());
    }

    goBack() {
        this.router.navigate([this.isShared ? '/shared-notes' : '/my-notes']);
    }

    saveNote() {
        if (this.isShared) return;
        if (this.isEmpty()) { this.goBack(); return; }
        this.persist(() => (this.editable = false));
    }

  // ===== Navbar actions =====
    async share() {
        if (this.isShared) return;
        if (this.isNew) {
            this.presentToast('Save the note before sharing');
            return;
        }

        const alert = await this.alertCtrl.create({
        header: 'Share Note',
        cssClass: 'share-note-alert',
        message: 'Enter the username to share with',
        inputs: [{ name: 'username', type: 'text', placeholder: 'username' }],
        buttons: [
            { text: 'Cancel', role: 'cancel' },
            {
            text: 'Share',
            handler: (data) => {
                const username = data.username?.trim();
                if (!username) return;
                this.notesService.shareNote(this.note.note_id, username).subscribe({
                next: () => this.presentToast(`Shared with @${username}`),
                error: (err) => this.presentToast(err?.error?.error ?? 'Could not share note'),
                });
            },
            },
        ],
        });
        await alert.present();
    }

    async move() {
        if (this.isShared) return;
        this.notesService.categories$.pipe(take(1)).subscribe(async cats => {
        const buttons = [
            { text: 'No Category', handler: () => this.doMove(null) },
            ...cats.map(c => ({ text: c.category_name ?? '', handler: () => this.doMove(c.category_id) })),
            { text: 'Cancel', role: 'cancel' },
        ];

        const sheet = await this.actionSheetCtrl.create({ header: 'Move to folder',cssClass: 'move-folder-sheet', buttons });
        await sheet.present();
        });
    }

    private doMove(category_id: number | null) {
        if (this.isNew) {
            this.note.category_id = category_id; // not saved yet, just set it
        return;
        }

        this.notesService.moveNote(this.note.note_id, category_id).subscribe({
            next: () => {
                this.note.category_id = category_id;
                this.presentToast('Moved');
            },
            error: (err) => this.presentToast(err?.error?.error ?? 'Could not move note'),
        });
    }

    async confirmDelete() {
        const alert = await this.alertCtrl.create({
        header: 'Delete Note',
        cssClass: 'delete-note-alert',
        message: 'This cannot be undone.',
        buttons: [
            { text: 'Cancel', role: 'cancel' },
            {
            text: 'Delete',
            role: 'destructive',
            handler: () => {
                if (this.isNew) { this.goBack(); return; }
                const req = this.isShared
                ? this.notesService.deleteSharedNote(this.note.note_id)
                : this.notesService.deleteNote(this.note.note_id);
                req.subscribe({
                next: () => this.goBack(),
                error: (err) => this.presentToast(err?.error?.error ?? 'Could not delete note'),
                });
            },
            },
        ],
        });
        await alert.present();
    }

    private async presentToast(msg: string) {
        const t = await this.toastCtrl.create({ message: msg, duration: 1500 });
        await t.present();
    }
}