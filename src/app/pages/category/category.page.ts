import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AlertController, ToastController, IonHeader, IonToolbar, IonTitle, IonButton, IonButtons, IonContent, IonList, IonItem, IonLabel, IonCard, IonIcon } from '@ionic/angular';
import { NotesService } from '../../services/notes';
import { Category } from '../../models/category';

@Component({
    selector: 'app-category',
    standalone: true,
    imports: [IonIcon, IonCard, IonLabel, IonItem, IonList, IonContent, IonButtons, IonButton, IonTitle, IonToolbar, IonHeader, CommonModule],
    templateUrl: './category.page.html',
    styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {
    categories: Category[] = [];
    deleteMode = false;
    selectedIds = new Set<number>();

    constructor(
        private notesService: NotesService,
        private router: Router,
        private alertCtrl: AlertController,
        private toastCtrl: ToastController,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.notesService.categories$.subscribe(c => {
            this.categories = c;
            this.cdr.markForCheck();
        });
    }

    ionViewWillEnter() {
        this.notesService.getAllCategories();
    }

    back() { this.router.navigate(['/my-notes']); }

    selectCategory(name: string) {
        this.notesService.setActiveCategory(name);
        this.router.navigate(['/my-notes']);
    }

    // ============== DELETE MODE ===============
    toggleDeleteMode() {
        this.deleteMode = !this.deleteMode;
        this.selectedIds.clear();
    }

    isSelected(c: Category): boolean {
        return this.selectedIds.has(Number(c.category_id));
    }

    //  ============== NORMAL MODE =============== filter by this folder. Delete mode: toggle selection
    onItemClick(c: Category) {
        if (!this.deleteMode) {
            this.selectCategory(c.category_name!);
            return;
        }
        const id = Number(c.category_id);
        if (this.selectedIds.has(id)) this.selectedIds.delete(id);
        else this.selectedIds.add(id);
    }

    async confirmDelete() {
        if (this.selectedIds.size === 0) return;

        const many = this.selectedIds.size > 1;
        const alert = await this.alertCtrl.create({
            header: many ? 'Delete Folders' : 'Delete Folder',
            cssClass: 'delete-alert',
            message: `Deleting ${many ? 'these folders' : 'this folder'} will also permanently delete all the notes inside ${many ? 'them' : 'it'}. This cannot be undone.`,
                buttons: [
                    { text: 'Cancel', role: 'cancel' },{text: 'Delete',role: 'destructive',handler: () => this.deleteSelected(),},
                ],
        });
        await alert.present();
    }

    private deleteSelected() {
        this.notesService.deleteCategories(Array.from(this.selectedIds)).subscribe({
            next: () => {
                this.deleteMode = false;
                this.selectedIds.clear();
                this.cdr.markForCheck();
                this.presentToast('Deleted');
            },
            error: (err) => this.presentToast(err?.error?.error ?? 'Could not delete folders'),
        });
    }

    // ============== NEW FOLDER ===============
    async newFolder() {
        const alert = await this.alertCtrl.create({
            header: 'New Folder',
            cssClass: 'new-folder-alert',
            inputs: [{ name: 'name', type: 'text', placeholder: 'Category name' }],
            buttons: [{ text: 'Cancel', role: 'cancel' }, {text: 'Create',
                handler: (data) => {
                    const name = data.name?.trim();
                    if (!name) return;
                    this.notesService.addCategory(name).subscribe({
                    error: (err) => this.presentToast(err?.error?.error ?? 'Could not create folder'),
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