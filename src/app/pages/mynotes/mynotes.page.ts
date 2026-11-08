// import { Component, inject, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { IonContent, IonHeader, IonTitle, IonToolbar, IonFab, IonFabButton, IonIcon, IonButton } from '@ionic/angular';
// import {
//   listOutline,
//   peopleOutline,
//   personCircleOutline,
//   folderOpenOutline,
//   add,
  
// } from 'ionicons/icons';
// import { addIcons } from "ionicons";
// import { NotesService } from "../../services/notes";

// @Component({
//   selector: 'app-mynotes',
//   templateUrl: './mynotes.page.html',
//   styleUrls: ['./mynotes.page.scss'],
//   imports: [IonButton, IonIcon, IonFabButton, IonFab, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule],
// })
// export class MynotesPage implements OnInit {
//     noteService = inject(NotesService);
//     notes: any[] = [];

  

//   constructor() {
//     this.noteService.getAllNotes(3).subscribe({
//                 next:(res)=>{
//                     console.log(res);
//                     this.notes= res;
//                 },
//                 error:(err)=>{
//                     console.log(err);
//                 }
//             })


//  addIcons({
//   listOutline,
//   peopleOutline,
//   personCircleOutline,
//   folderOpenOutline,
//   add
// });
//   }

//   ngOnInit() {}
// }
