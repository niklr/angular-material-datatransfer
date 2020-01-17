import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

export function main(event) {
  return platformBrowserDynamic([{ provide: 'ConfigCustomEvent', useValue: event }]).bootstrapModule(AppModule);
}

document.addEventListener('github:niklr/angular-material-datatransfer.create', (event: any) => {
  event.production = environment.production;
  main(event).catch(err => console.error(err));
});
