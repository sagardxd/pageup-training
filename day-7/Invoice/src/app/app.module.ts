import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormComponent } from './components/form/form.component';
import { SubTotalComponent } from './components/sub-total/sub-total.component';
import { HoverHighlightDirective } from './custom-directives/hover-highlight.directive';

@NgModule({
  declarations: [
    AppComponent,
    FormComponent,
    SubTotalComponent,
    HoverHighlightDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
