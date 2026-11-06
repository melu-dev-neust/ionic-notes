import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AlertController, IonHeader, IonToolbar, IonButtons, IonButton, IonContent, IonList, IonItem, IonLabel, IonIcon } from '@ionic/angular';
import { NotesService } from '../../services/notes';

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [IonIcon, IonLabel, IonItem, IonList, IonContent, IonButton, IonButtons, IonToolbar, IonHeader, CommonModule],
  templateUrl: './account-settings.page.html',
  styleUrls: ['./account-settings.page.scss'],
})
export class AccountSettingsPage {
  user = this.notesService.getUser();

  constructor(
    private notesService: NotesService,
    private router: Router,
    private alertCtrl: AlertController
  ) {}

  back() { this.router.navigate(['/my-notes']); }

  async changePassword() {
    const alert = await this.alertCtrl.create({
      header: 'Change Password',
      inputs: [
        { name: 'old', type: 'password', placeholder: 'Current password' },
        { name: 'new', type: 'password', placeholder: 'New password' },
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Save', handler: () => console.log('TODO: POST /api/change-password.php') },
      ],
    });
    await alert.present();
  }

  async logout() {
    const alert = await this.alertCtrl.create({
      header: 'Log Out',
      message: 'Are you sure?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Log Out',
          role: 'destructive',
         handler: () => {
            this.notesService.logout();
            this.router.navigate(['/login']);
            },
        },
      ],
    });
    await alert.present();
  }
}