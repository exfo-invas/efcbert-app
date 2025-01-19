import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {FormsModule} from "@angular/forms";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({ declarations: [
        AppComponent,
        DashboardComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        FormsModule], providers: [
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule { }

/*providePrimeNG({ theme: {
    preset: Aura
  }}),
  provideAnimationsAsync()*/
