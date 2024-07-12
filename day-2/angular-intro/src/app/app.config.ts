import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { HoverComponent } from './hover/hover.component';
import { LifecycleExampleComponent } from './lifecycle-example/lifecycle-example.component';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideClientHydration(),
    // {provide: HoverComponent}
    {provide: LifecycleExampleComponent}
  ]
};
  