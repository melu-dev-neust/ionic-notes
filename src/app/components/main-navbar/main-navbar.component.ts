import { CommonModule } from "@angular/common";
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-main-navbar',
  templateUrl: './main-navbar.component.html',
  styleUrls: ['./main-navbar.component.scss'],
  imports: [CommonModule, RouterLink],
  template: `
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button routerLink="/my-notes" [color]="active === 'notes' ? 'primary' : 'medium'">
          <ion-icon slot="icon-only" name="document-text-outline"></ion-icon>
        </ion-button>
        <ion-button routerLink="/shared-notes" [color]="active === 'shared' ? 'primary' : 'medium'">
          <ion-icon slot="icon-only" name="share-social-outline"></ion-icon>
        </ion-button>
      </ion-buttons>
      <ion-buttons slot="end">
        <ion-button routerLink="/account-settings" [color]="active === 'account' ? 'primary' : 'medium'">
          <ion-icon slot="icon-only" name="person-circle-outline"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  `,
})
export class MainNavbarComponent implements OnInit {

    @Input() active: 'notes' | 'shared' | 'account' = 'notes';
    
    constructor() {}

    ngOnInit() {}
}
