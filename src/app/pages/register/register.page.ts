import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastController, IonButton, IonItem, IonList, IonIcon, IonContent, IonInput } from '@ionic/angular';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [IonContent, IonIcon, IonList, IonItem, IonButton, IonInput, CommonModule, FormsModule, RouterLink],
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  email = '';
  password = '';
  username = '';
  loading = false;

  constructor(
    private auth: Auth,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  register() {
    const username = this.username.trim();
    const email = this.email.trim();

    if (!email || !this.password || !username) {
      this.presentToast('Please fill in all fields');
      return;
    }
    if (this.password.length < 6) {
      this.presentToast('Password must be at least 6 characters');
      return;
    }

    this.loading = true;
    this.auth.register(email, this.password, username).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/my-notes'], { replaceUrl: true });
      },
      error: (err) => {
        this.loading = false;
        this.presentToast(err?.error?.error ?? (err.status === 0 ? 'Cannot reach the server' : 'Could not create account'));
      },
    });
  }

  private async presentToast(msg: string) {
    const t = await this.toastCtrl.create({ message: msg, duration: 1800, color: 'danger' });
    await t.present();
  }
}