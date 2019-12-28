import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { CustomEventType, CustomEventTypeExtensions } from 'projects/amd-lib/src/public-api';

if (environment.production) {
  enableProdMode();
}

export function main(event) {
  return platformBrowserDynamic([{ provide: 'ConfigCustomEvent', useValue: event }]).bootstrapModule(AppModule);
}

document.addEventListener(CustomEventTypeExtensions.toString(CustomEventType.CREATE), (event: any) => {
  event.production = environment.production;
  main(event).catch(err => console.error(err));
});
