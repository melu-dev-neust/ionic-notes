import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IonToolbar, IonIcon,IonButton, IonHeader } from '@ionic/angular';

@Component({
    selector: 'app-main-navbar',
    standalone: true,
    imports: [IonHeader, CommonModule, RouterLink, IonToolbar, IonIcon, IonButton],
    templateUrl: './main-navbar.component.html',
    styleUrls: ['./main-navbar.component.scss'],
})
export class MainNavbarComponent {
    @Input() active: 'notes' | 'shared' | 'account' = 'notes';
}