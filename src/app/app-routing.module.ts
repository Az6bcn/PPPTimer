import { TimerCounterComponent } from './timer-counter/timer-counter.component';
import { TimerMainComponent } from './timer-main/timer-main.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: '', redirectTo: '/timer', pathMatch: 'full' },
  { path: 'timer', component: TimerMainComponent },
  { path: 'counter', component: TimerCounterComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
