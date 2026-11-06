import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastController, IonHeader, IonToolbar, IonButton, IonItem, IonList, IonIcon, IonContent } from '@ionic/angular';
import { NotesService } from '../../services/notes';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [IonContent, IonIcon, IonList, IonItem, IonButton, IonToolbar, IonHeader, CommonModule, FormsModule, RouterLink],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email = '';
  password = '';

  constructor(
    private notesService: NotesService,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  login() {
    if (this.notesService.login(this.email, this.password)) {
      this.router.navigate(['/my-notes']);
    } else {
      this.presentToast('Please enter your email and password');
    }
  }

  private async presentToast(msg: string) {
    const t = await this.toastCtrl.create({ message: msg, duration: 1800, color: 'danger' });
    await t.present();
  }
}