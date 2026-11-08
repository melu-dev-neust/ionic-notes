import { Injectable } from '@angular/core';
import { Haptics, NotificationType } from '@capacitor/haptics';

@Injectable({ providedIn: 'root' })
export class HapticsService {
  /** Warning-style buzz for confirmation modals (delete, log out) */
  async warning() {
    try {
      await Haptics.notification({ type: NotificationType.Warning });
    } catch {
      // no vibration support (browser, or the phone has it turned off): ignore
    }
  }
}