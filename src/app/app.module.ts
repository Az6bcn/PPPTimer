import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // <-- here
import { RoundProgressModule } from 'angular-svg-round-progressbar'; // <-- here
import { TimerMainComponent } from './timer-main/timer-main.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NotifierModule } from 'angular-notifier';
import { TimerCounterComponent } from './timer-counter/timer-counter.component';


@NgModule({
   declarations: [
      AppComponent,
      TimerMainComponent,
      TimerCounterComponent
   ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      FormsModule,
      RoundProgressModule,
      ReactiveFormsModule,
      NgSelectModule,
      NotifierModule
   ],
   providers: [],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
