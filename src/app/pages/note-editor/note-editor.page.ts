import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ActionSheetController, ToastController, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent } from '@ionic/angular';
import { NotesService } from '../../services/notes';
import { Note } from '../../models/note';

@Component({
  selector: 'app-note-editor',
  imports: [IonContent, IonIcon, IonButton, IonButtons, IonTitle, IonToolbar, IonHeader, CommonModule, FormsModule],
  templateUrl: './note-editor.page.html',
  styleUrls: ['./note-editor.page.scss'],
})
export class NoteEditorPage implements OnInit, OnDestroy {
  note: Note = {
    id: 0,
    note_title: '',
    note_content: '',
    category: null,
    created_at: new Date().toISOString(),
  };
  isNew = false;
  editable = false;
  isShared = false;
  private original: string = '';

  @ViewChild('titleInput') titleInput!: ElementRef<HTMLInputElement>;
  @ViewChild('contentInput') contentInput!: ElementRef<HTMLTextAreaElement>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private notesService: NotesService,
    private alertCtrl: AlertController,
    private actionSheetCtrl: ActionSheetController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.isShared = this.route.snapshot.queryParamMap.get('shared') === 'true';

    if (idParam === 'new' || idParam === null) {
      this.isNew = true;
      this.editable = true;
      this.note.category =
        this.notesService.getActiveCategory() === 'All'
          ? null
          : this.notesService.getActiveCategory();
    } else {
      const existing = this.notesService.getNote(+idParam);
      if (existing) {
        this.note = { ...existing };
        this.editable = false;
      }
      this.original = JSON.stringify(this.note);
    }
  }

  ngOnDestroy() {}

  /** Clicking the title or content flips into editable mode */
  enableEdit() {
    if (this.isShared) return;
    this.editable = true;
    setTimeout(() => this.titleInput?.nativeElement.focus());
  }

  /** Save on back arrow (also called when leaving) */
  autosave() {
    if (this.isShared) return;
    if (!this.note.note_title.trim() && !this.note.note_content.trim()) {
      // do not save empty notes
      this.goBack();
      return;
    }
    if (this.isNew) {
      const saved = this.notesService.addNote(
        this.note.note_title,
        this.note.note_content,
        this.note.category
      );
      this.note.id = saved.id;
      this.isNew = false;
    } else {
      this.notesService.updateNote(this.note.id, {
        note_title: this.note.note_title,
        note_content: this.note.note_content,
      });
    }
    this.original = JSON.stringify(this.note);
    this.goBack();
  }

  goBack() {
    this.router.navigate([this.isShared ? '/shared-notes' : '/my-notes']);
  }

  // ===== Navbar actions =====

  async share() {
    const alert = await this.alertCtrl.create({
      header: 'Share Note',
      message: 'Enter the username to share with',
      inputs: [{ name: 'username', type: 'text', placeholder: 'username' }],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Share',
          handler: (data) => {
            if (data.username?.trim()) {
              this.notesService.shareNote(this.note, data.username.trim());
              this.presentToast(`Shared with @${data.username.trim()}`);
            }
          },
        },
      ],
    });
    await alert.present();
  }

  async move() {
    this.notesService.categories$.subscribe(async cats => {
      const buttons = [
        { text: 'No Category', handler: () => this.doMove(null) },
        ...cats.map(c => ({ text: c.name, handler: () => this.doMove(c.name) })),
        { text: 'Cancel', role: 'cancel' },
      ];
      const sheet = await this.actionSheetCtrl.create({
        header: 'Move to folder',
        buttons,
      });
      await sheet.present();
    });
  }

  private doMove(category: string | null) {
    if (!this.note.id) {
      this.note.category = category; // not saved yet, just set it
      return;
    }
    this.notesService.moveNote(this.note.id, category);
    this.note.category = category;
    this.presentToast('Moved');
  }

  async confirmDelete() {
    const alert = await this.alertCtrl.create({
      header: 'Delete Note',
      message: 'This cannot be undone.',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            if (this.note.id) this.notesService.deleteNote(this.note.id);
            this.goBack();
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