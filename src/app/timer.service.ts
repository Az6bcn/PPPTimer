import { NgSelectModel } from './ng-select-model';
import { FormGroup } from '@angular/forms';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  private timeFG$ = new BehaviorSubject<FormGroup>(null);
  private orderOfServiceSub = new BehaviorSubject<Array<NgSelectModel>>([]);
  setTimerFGSub(data: FormGroup) {
    this.timeFG$.next(data);
  }

  getTimer$(): Observable<FormGroup> {
    return this.timeFG$.asObservable();
  }

  setOrderServiceSub(data: NgSelectModel) {

    const response = this.orderOfServiceSub.getValue();

    if (response.length > 0) {
      const newArray = [...response, data];
      this.orderOfServiceSub.next(newArray);
      return;
    }

    const item = [] as Array<NgSelectModel>;
    item.push(data);
    this.orderOfServiceSub.next(item);
  }

  getOrderService$(): Observable<Array<NgSelectModel>> {
    return this.orderOfServiceSub.asObservable();
  }
}
