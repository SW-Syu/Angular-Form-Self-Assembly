import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { NzConfig, provideNzConfig } from 'ng-zorro-antd/core/config';
import { zh_TW } from 'ng-zorro-antd/i18n';
import { provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { icons } from './icons-provider';

import { routes } from './app.routes';

registerLocaleData(zh);

const ngZorroConfig: NzConfig = {
  message: { nzTop: 120 },
  notification: { nzTop: 240 }
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideNzIcons(icons),
    provideNzI18n(zh_TW),
    provideAnimationsAsync(),
    provideNzConfig(ngZorroConfig),
    importProvidersFrom(BrowserAnimationsModule, FormsModule, ReactiveFormsModule, DragDropModule)
  ]
};
