import { TimerService } from './../timer.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-timer-counter',
  templateUrl: './timer-counter.component.html',
  styleUrls: ['./timer-counter.component.css']
})
export class TimerCounterComponent implements OnInit, OnDestroy {
  timeFG: FormGroup;

  timeFGValue: { SelectedOrderService: string, Time: string } = { SelectedOrderService: '', Time: '' };
  timeSub: Subscription;
  hoursToDisplay: number;
  minutesToDisplay: number;
  secondsToDisplay: number;

  selectedTime: string;
  selectedHours: string;
  selectedMinutes: string;
  selectedSeconds: string;

  constructor(private timerService: TimerService) { }

  ngOnInit() {
    // get data needed from the service
    this.timeSub = this.timerService.getTimer$()
      .subscribe(response => {
        if (response) {
          this.timeFG = response;
          this.timeFGValue.SelectedOrderService = this.timeFG.value.SelectedOrderService;
          this.timeFGValue.Time = this.timeFG.value.Time;

          this.selectedTime = this.timeFGValue.Time;

          [this.selectedHours, this.selectedMinutes, this.selectedSeconds] = this.selectedTime.split(':');

          this.runTimer();
        }

      });
  }

  runTimer() {

  }

  ngOnDestroy() {
    // unsubscribe
    this.timeSub.unsubscribe();
  }
}
