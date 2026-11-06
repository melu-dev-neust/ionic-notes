import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonFab, IonFabButton, IonIcon, IonButton } from '@ionic/angular';
import {
  listOutline,
  peopleOutline,
  personCircleOutline,
  folderOpenOutline,
  add,
  
} from 'ionicons/icons';
import { addIcons } from "ionicons";

@Component({
  selector: 'app-mynotes',
  templateUrl: './mynotes.page.html',
  styleUrls: ['./mynotes.page.scss'],
  imports: [IonButton, IonIcon, IonFabButton, IonFab, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule],
})
export class MynotesPage implements OnInit {
  constructor() {
 addIcons({
  listOutline,
  peopleOutline,
  personCircleOutline,
  folderOpenOutline,
  add
});
  }

  ngOnInit() {}
}
