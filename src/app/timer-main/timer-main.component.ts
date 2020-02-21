import { TimerService } from './../timer.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { NgSelectModel } from '../ng-select-model';
import { Title } from '@angular/platform-browser';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { NotifierService } from 'angular-notifier';
import { Router } from '@angular/router';
import { TimeValidatorFn } from '../time-validatorFn';

@Component({
  selector: 'app-timer-main',
  templateUrl: './timer-main.component.html',
  styleUrls: ['./timer-main.component.css']
})
export class TimerMainComponent implements OnInit {

  logo = '../../assets/ppp_logo.png';
  timeFG: FormGroup;
  orderOfService: Array<NgSelectModel> = [];
  orderServiceFG: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private notifierService: NotifierService,
    private timerService: TimerService,
    private router: Router) {
  }

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

  get time() { return this.timeFG.get('Time'); }
  get selectedOrderService() { return this.timeFG.get('SelectedOrderService'); }
  get title() { return this.orderServiceFG.get('Title'); }
  get duration() { return this.orderServiceFG.get('Duration'); }
}
