import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastController, IonHeader, IonToolbar, IonButton, IonItem, IonList, IonIcon, IonContent } from '@ionic/angular';
import { NotesService } from '../../services/notes';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [IonContent, IonIcon, IonList, IonItem, IonButton, IonToolbar, IonHeader, CommonModule, FormsModule, RouterLink],
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  email = '';
  password = '';
  username = '';

  constructor(
    private notesService: NotesService,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  register() {
    if (!this.email || !this.password || !this.username) {
      this.presentToast('Please fill in all fields');
      return;
    }
    if (this.notesService.register(this.email, this.password, this.username)) {
      this.router.navigate(['/my-notes']);
    } else {
      this.presentToast('That username is already taken');
    }
  }

  private async presentToast(msg: string) {
    const t = await this.toastCtrl.create({ message: msg, duration: 1800, color: 'danger' });
    await t.present();
  }
}