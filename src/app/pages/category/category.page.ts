import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AlertController, IonHeader, IonToolbar, IonTitle, IonButton, IonButtons, IonContent, IonList, IonItem, IonLabel, IonCard, IonIcon } from '@ionic/angular';
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

  constructor(
    private notesService: NotesService,
    private router: Router,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.notesService.categories$.subscribe(c => (this.categories = c));
  }

  back() { this.router.navigate(['/my-notes']); }

  selectCategory(name: string) {
    this.notesService.setActiveCategory(name);
    this.router.navigate(['/my-notes']);
  }

  async newFolder() {
    const alert = await this.alertCtrl.create({
      header: 'New Folder',
      inputs: [{ name: 'name', type: 'text', placeholder: 'Category name' }],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Create',
          handler: (data) => {
            if (data.name?.trim()) this.notesService.addCategory(data.name.trim());
          },
        },
      ],
    });
    await alert.present();
  }
}