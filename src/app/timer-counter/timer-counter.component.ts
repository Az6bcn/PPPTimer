import { TimerService } from './../timer.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription, BehaviorSubject } from 'rxjs';
import { TimeCounterType as TimeCounterType, CounterTypeEnum } from '../time-counter-type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-timer-counter',
  templateUrl: './timer-counter.component.html',
  styleUrls: ['./timer-counter.component.css']
})
export class TimerCounterComponent implements OnInit, OnDestroy {
  timeFG: FormGroup;

  timeFGValue: { SelectedOrderService: string, Time: string } = { SelectedOrderService: '', Time: '' };
  timeSub: Subscription;
  hoursSub: Subscription;
  minutesSub: Subscription;
  hoursToDisplay = 0;
  minutesToDisplay = 0;
  secondsToDisplay = 0;
  minutesToDisplayString = '00';
  hoursToDisplayString = '00';
  secondsToDisplayString = '00';
  selectedTime: string;
  selectedOrderService: string;
  selectedHours: string;
  selectedMinutes: string;
  selectedSeconds = '0';
  minutes$ = new BehaviorSubject<TimeCounterType>({ hours: 0, minutes: 0, counterType: CounterTypeEnum.Down } as TimeCounterType);
  hours$ = new BehaviorSubject<TimeCounterType>({ hours: 0, minutes: 0, counterType: CounterTypeEnum.Down } as TimeCounterType);
  isRed: boolean;
  isYellow: boolean;
  constructor(
    private timerService: TimerService,
    private router: Router
  ) { }

  ngOnInit() {
    // get data needed from the service
    this.timeSub = this.timerService.getTimer$()
      .subscribe(response => {
        if (response) {
          this.timeFG = response;
          this.timeFGValue.SelectedOrderService = this.timeFG.value.SelectedOrderService;
          this.timeFGValue.Time = this.timeFG.value.Time;

          this.selectedTime = this.timeFGValue.Time;
          this.selectedOrderService = this.timeFGValue.SelectedOrderService;

          [this.selectedHours, this.selectedMinutes, this.selectedSeconds] = this.selectedTime.split(':');

          this.runTimer();
        }
      });

    this.minutesSub = this.minutes$.subscribe(response => {
      if (response.counterType === CounterTypeEnum.Down) {
        this.minutesToDisplayString = this.getTwoDigitValue(response.minutes);
      } else {
        this.minutesToDisplay = this.minutesToDisplay + 1;
        this.minutesToDisplayString = this.getTwoDigitValue(response.minutes);
      }
    });

    this.hoursSub = this.hours$.subscribe(response => {
      if (response.counterType === CounterTypeEnum.Down) {
        this.hoursToDisplayString = this.getTwoDigitValue(response.hours);

      } else {
        this.hoursToDisplayString = this.getTwoDigitValue(response.hours);
      }
    });
  }

  runTimer() {
    const date = new Date();

    // add hours
    date.setHours(date.getHours() + parseInt(this.selectedHours, 10));
    // add minutes
    date.setMinutes(date.getMinutes() + parseInt(this.selectedMinutes, 10));
    // add seconds
    date.setSeconds(date.getSeconds() + parseInt(this.selectedSeconds, 10));


    const eightyPecentTime = (date.getTime() - new Date().getTime()) * 0.75;

    setInterval(x => {
      // get difference between countdown time and now as number of milliseconds since the Unix Epoch.
      const difference = date.getTime() - new Date().getTime();

      if (difference <= eightyPecentTime) {
        this.isYellow = true;
      }

      if (difference > 0) {
        // Time calculations for days, hours, minutes and seconds //https://esqsoft.com/javascript_examples/date-to-epoch.htm
        const day = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        if (this.hours$.getValue().hours !== hours) {
          this.hours$.next({ hours: 0, counterType: CounterTypeEnum.Down } as TimeCounterType);
        }

        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        if (this.minutes$.getValue().minutes !== minutes) {
          this.minutes$.next({ minutes, counterType: CounterTypeEnum.Down } as TimeCounterType);
        }

        this.secondsToDisplayString = this.getTwoDigitValue(Math.floor((difference % (1000 * 60)) / 1000));

      } else {
        this.isRed = true;
        // count up
        const differenceUp = new Date().getTime();

        // Time calculations for days, hours, minutes and seconds
        const day = Math.floor(differenceUp / (1000 * 60 * 60 * 24));
        const hours = Math.floor((differenceUp % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        if (this.hours$.getValue().hours !== hours) {
          this.hours$.next({ hours, counterType: CounterTypeEnum.Up } as TimeCounterType);
        }

        const minutes = Math.floor((differenceUp % (1000 * 60 * 60)) / (1000 * 60));
        if (this.minutes$.getValue().minutes !== minutes) {
          this.minutes$.next({ minutes, counterType: CounterTypeEnum.Up } as TimeCounterType);
        }

        this.secondsToDisplayString = this.getTwoDigitValue(Math.floor(Math.abs(difference % (1000 * 60)) / 1000));

      }
    }, 1000); // 10000ms = 1s

  }

  getTwoDigitValue(value: number) {
    if (value < 10 && value.toString().length !== 2) {
      return '0' + value;
    }
    return '' + value;
  }

  setMyClasses() {
    return {
      'redish-gradient': this.isRed,
      'yellowish-gradient': this.isYellow
    };
  }

  backMainPage() {
    this.router.navigate(['timer']);
    this.ngOnDestroy();
  }

  ngOnDestroy() {
    // unsubscribe
    this.timeSub.unsubscribe();
    this.minutesSub.unsubscribe();
    this.hoursSub.unsubscribe();

    clearInterval();
  }

}
