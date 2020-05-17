import { TimerService } from './../timer.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgSelectModel } from '../ng-select-model';
import { Title } from '@angular/platform-browser';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { NotifierService } from 'angular-notifier';
import { Router } from '@angular/router';
import { TimeValidatorFn } from '../time-validatorFn';
import { finalize } from 'rxjs/operators';
import { RecordTimer } from '../record-timer';
import { BehaviorSubject } from 'rxjs';


@Component({
  selector: 'app-timer-main',
  templateUrl: './timer-main.component.html',
  styleUrls: ['./timer-main.component.css']
})
export class TimerMainComponent implements OnInit, OnDestroy {

  constructor(
    private formBuilder: FormBuilder,
    private notifierService: NotifierService,
    private timerService: TimerService,
    private router: Router) {
  }


  get time() { return this.timeFG.get('Time'); }
  get selectedOrderService() { return this.timeFG.get('SelectedOrderService'); }
  get title() { return this.orderServiceFG.get('Title'); }
  get duration() { return this.orderServiceFG.get('Duration'); }

  logo = '../../assets/ppp_logo.png';
  timeFG: FormGroup;
  orderOfService: Array<NgSelectModel> = [];
  orderServiceFG: FormGroup;
  contents = [];
  disableGenerateBtn$ = new BehaviorSubject<boolean>(true);

  ngOnInit() {
    this.timeFG = this.buildForm(this.formBuilder);

    this.orderServiceFG = this.buildOrderServiceForm(this.formBuilder);

    this.timerService.getOrderService$()
      .subscribe(response => {
        this.orderOfService = response;
      });
  }

  buildForm(builder: FormBuilder) {
    return builder.group({
      SelectedOrderService: [''],
      Time: ['', Validators.required]
    });
  }

  buildOrderServiceForm(builder: FormBuilder) {
    return builder.group({
      Title: ['', Validators.required],
      Duration: ['', [Validators.required, TimeValidatorFn]]
    });
  }

  addOrderOfService(item: { Title: string, Duration: string }) {
    this.timerService.setOrderServiceSub({ value: item.Duration, label: item.Title } as NgSelectModel);
    this.orderServiceFG.reset();

    this.notifierService.notify('success', 'Added sucessfully');
  }

  isOrderServiceFGValid(): boolean {
    return this.orderServiceFG.invalid;
  }
  orderServiceSelected(item: NgSelectModel) {
    this.time.setValue(item.value);
    this.selectedOrderService.setValue(item.label);
  }

  isTimeValid() {
    return this.time.invalid;
  }
  startTimer() {
    this.timerService.setTimerFGSub(this.timeFG);
    this.router.navigate(['counter']);
  }

  stopTimer() {

  }

  generateReport() {
    this.contents = [];
    this.timerService.completeRecorderTimes();

    const fs = (window as any).require('fs');
    const path = (window as any).require('path');
    const date = new Date();
    const filepath = `C:/TimeReports/SundayTimeReport_${date.getDate()}_${date.getMonth()}_${date.getFullYear()}.txt`;
    const directory = 'C:/TimeReports';
    this.timerService.getRecorderTimes()
      .pipe(
        finalize(() => {

          if (!fs.existsSync(directory)) {
            fs.mkdir(directory, { recursive: true }, (err) => {
              if (err) {
                this.notifierService.notify('error', `${err.message}`);
                return;
              } else {
                fs.writeFileSync(filepath, this.contents.join(' \r\n '), (err2) => {
                  if (err2) {
                    this.notifierService.notify('error', `${err2.message}`);
                    return;
                  }
                });
              }
            });
          } else {
            fs.writeFileSync(filepath, this.contents.join(' \r\n '), (err2) => {
              if (err2) {
                this.notifierService.notify('error', `${err2.message}`);
                return;
              }
            });
          }
        })
      )
      .subscribe((response: RecordTimer) => {
        this.concatenateContent(response.title, response.time, response.extraTime);
      },
        error => console.log(error),
        () => this.notifierService.notify('success', 'The file has been succesfully saved')
      );
  }

  concatenateContent(title: string, time: string, extraTime: string) {
    const content = [title, ' ', `Time Allocated: ' ${time}`, ' ', `Exceeded by: ${extraTime}`].join('');
    this.contents.push(content);
  }

  checkBoxChanged(chckbox: HTMLInputElement) {
    if (chckbox.checked) {
      // disable generate report button
      this.disableGenerateBtn$.next(false);
      return;
    }
    this.disableGenerateBtn$.next(true);
  }

  ngOnDestroy(){
    this.timerService.unsubscribeRecord$();
  }
}
