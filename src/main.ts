import { bootstrapApplication } from '@angular/platform-browser';
import {
  RouteReuseStrategy,
  provideRouter,
  withComponentInputBinding,
  withPreloading,
  PreloadAllModules,
} from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular';
import { documentTextOutline, shareSocialOutline, personCircleOutline,folderOutline, folderOpenOutline, add, arrowBack, trashOutline,bookOutline, checkmarkOutline,} from 'ionicons/icons';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { addIcons } from "ionicons";
import { provideHttpClient, withInterceptors  } from "@angular/common/http";

import { authInterceptor } from './app/interceptors/auth.interceptor';
addIcons({
    'document-text-outline': documentTextOutline,
    'share-social-outline': shareSocialOutline,
    'person-circle-outline': personCircleOutline,
    'folder-outline': folderOutline,
    'folder-open-outline': folderOpenOutline,
    'add': add,
    'arrow-back': arrowBack,
    'trash-outline': trashOutline,
    'book-outline': bookOutline,
    'checkmark-outline': checkmarkOutline,
});

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules), withComponentInputBinding()),
    provideHttpClient(withInterceptors([authInterceptor]))
  ],
});
