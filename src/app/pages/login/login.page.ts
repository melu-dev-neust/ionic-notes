import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastController, IonButton, IonItem, IonList, IonIcon, IonContent, IonInput } from '@ionic/angular';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [IonContent, IonIcon, IonList, IonItem, IonButton, IonInput, CommonModule, FormsModule, RouterLink],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email = '';
  password = '';
  loading = false;

  constructor(
    private auth: Auth,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  login() {
    if (!this.email.trim() || !this.password) {
      this.presentToast('Please enter your email and password');
      return;
    }

    this.loading = true;
    this.auth.login(this.email.trim(), this.password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/my-notes'], { replaceUrl: true });
      },
      error: (err) => {
        this.loading = false;
        this.presentToast(err?.error?.error ?? (err.status === 0 ? 'Cannot reach the server' : 'Could not log in'));
      },
    });
  }

  private async presentToast(msg: string) {
    const t = await this.toastCtrl.create({ message: msg, duration: 1800, color: 'danger' });
    await t.present();
  }
}