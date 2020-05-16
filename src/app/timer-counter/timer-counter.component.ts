import { RecordTimer } from './../record-timer';
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
  dateForCountUp: any;
  minutes = 0;
  hours = 0;
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

          if (this.selectedTime) {
            [this.selectedHours, this.selectedMinutes, this.selectedSeconds] = this.selectedTime.split(':');
          }


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


    const eightyPecentTime = (date.getTime() - new Date().getTime()) * 0.83;

    setInterval(x => {
      // get difference between countdown time and now as number of milliseconds since the Unix Epoch.
      const difference = date.getTime() - new Date().getTime();

      if (difference <= eightyPecentTime) {
        this.isYellow = true;
      }

      if (difference > 0) {
        // Time calculations for days, hours, minutes and seconds //https://esqsoft.com/javascript_examples/date-to-epoch.htm
        // 1000 * 60 * 60 * 24 : days in seconds === 86400s

        /**
         * difference in ms:
         * difference to seconds = difference / 1000
         * difference in minutes = difference to seconds / 60
         * difference in hours = difference to minutes / 60
         * difference in days = difference to minutes / 24
         *
         * difference in ms:
         * difference in days (from ms) = difference / (1000 * 60 * 60 * 24)
         * difference in hours (from days) = (difference % (1000 * 60 * 60 * 24) / (1000 * 60 * 60))
         * difference in minutes (from hours) = (difference % (1000 * 60 * 60) / (1000 * 60)
         */

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
        if (!this.dateForCountUp) {
          this.dateForCountUp = this.getNewDateForCountUp(false);
        }
        const differenceUp = this.dateForCountUp.getTime();
        // const differenceUp = new Date().getTime();

        const seconds = Math.floor(Math.abs(difference % (1000 * 60)) / 1000);

        // Time calculations for days, hours, minutes and seconds

        if (seconds === 59) {
          this.minutes = this.minutes + 1;
          if (this.minutes === 59) {
            this.hours = this.hours + 1;
            const hours = this.hours;
            this.hours$.next({ hours, counterType: CounterTypeEnum.Up } as TimeCounterType);
          }

          const minutes = this.minutes;
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

  getNewDateForCountUp(isBackToMainPage: boolean) {
    const date = new Date();

    if (isBackToMainPage) {
      const hours = this.hours$.getValue().counterType === CounterTypeEnum.Up ? this.hours$.getValue().hours : 0;
      const mins = this.minutes$.getValue().counterType === CounterTypeEnum.Up ? this.minutes$.getValue().minutes : 0;
      date.setHours(hours);
      date.setMinutes(mins);
      date.setSeconds(0);

      return date;
    }

    date.setUTCHours(0);
    date.setUTCMinutes(0);
    date.setUTCSeconds(0);

    return date;
  }
  backMainPage() {
    // set timer
    const date = this.getNewDateForCountUp(true);
    const extraTime = `${date.getHours()}h: ${date.getMinutes()}mns: ${this.secondsToDisplayString}s`;
    this.timerService.setRecordTimer({ title: this.selectedOrderService, time: this.selectedTime, extraTime } as RecordTimer);

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
