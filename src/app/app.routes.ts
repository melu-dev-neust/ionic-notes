import type { Routes } from '@angular/router';
import { authGuard, guestGuard } from './guards/auth-guard';

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
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/register/register.page').then((m) => m.RegisterPage),
  },
  {
    path: 'my-notes',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/my-notes/my-notes.page').then((m) => m.MyNotesPage),
  },
  {
    path: 'shared-notes',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/shared-notes/shared-notes.page').then((m) => m.SharedNotesPage),
  },
  {
    path: 'category',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/category/category.page').then((m) => m.CategoryPage),
  },
  {
    path: 'note-editor/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/note-editor/note-editor.page').then((m) => m.NoteEditorPage),
  },
  {
    path: 'account-settings',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/account-settings/account-settings.page').then((m) => m.AccountSettingsPage),
  },
];