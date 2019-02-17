import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { CustomEventType } from './app/enums';

// depending on the env mode, enable prod mode or add debugging modules
if (process.env.ENV === 'build') {
  enableProdMode();
}

export function main(event) {
  return platformBrowserDynamic([{provide: 'ConfigCustomEvent', useValue: event }]).bootstrapModule(AppModule);
}

document.addEventListener(CustomEventType.toString(CustomEventType.CREATE), function(event) {
  main(event);
});
