import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'my-notes',
    pathMatch: 'full',
  },
//   {
//     path: 'mynotes',
//     loadComponent: () => import('./pages/mynotes/mynotes.page').then((m) => m.MynotesPage),
//   },
  {
    path: 'my-notes',
    loadComponent: () => import('./pages/my-notes/my-notes.page').then((m) => m.MyNotesPage),
  },
  {
    path: 'shared-notes',
    loadComponent: () => import('./pages/shared-notes/shared-notes.page').then((m) => m.SharedNotesPage),
  },
  {
    path: 'category',
    loadComponent: () => import('./pages/category/category.page').then((m) => m.CategoryPage),
  },
  {
    path: 'note-editor/:id',
    loadComponent: () => import('./pages/note-editor/note-editor.page').then((m) => m.NoteEditorPage),
  },
//   {
//     path: 'account-settings',
//     loadComponent: () => import('./pages/account-settings/account-settings.page').then((m) => m.AccountSettingsPage),
//   },
//   {
//     path: 'login',
//     loadComponent: () => import('./pages/login/login.page').then((m) => m.LoginPage),
//   },
//   {
//     path: 'register',
//     loadComponent: () => import('./pages/register/register.page').then((m) => m.RegisterPage),
//   },
];
