import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AlertController, IonHeader, IonToolbar, IonButtons, IonButton, IonContent, IonList, IonItem, IonLabel, IonIcon } from '@ionic/angular';
import { NotesService } from '../../services/notes';
import { Auth } from '../../services/auth';
import { HapticsService } from '../../services/haptics';

@Component({
    selector: 'app-account-settings',
    standalone: true,
    imports: [IonIcon, IonLabel, IonItem, IonList, IonContent, IonButton, IonButtons, IonToolbar, IonHeader, CommonModule],
    templateUrl: './account-settings.page.html',
    styleUrls: ['./account-settings.page.scss'],
    })
export class AccountSettingsPage {
    private haptics = inject(HapticsService);
    
    get user() { return this.auth.getUser(); }

        constructor(
        private auth: Auth,
        private notesService: NotesService,
        private router: Router,
        private alertCtrl: AlertController
    ) {}

    back() { this.router.navigate(['/my-notes']); }

    async logout() {
        const alert = await this.alertCtrl.create({
            header: 'Log Out',
            message: 'Are you sure?',
            cssClass: 'logout-alert',
            buttons: [
                { text: 'Cancel', role: 'cancel' },{text: 'Log Out', role: 'destructive',
                    handler: () => {
                        this.notesService.reset();
                        this.auth.logout();
                        this.router.navigate(['/login'], { replaceUrl: true });
                    },
                },
            ],
        });
        this.haptics.warning();
        await alert.present();
    }
}