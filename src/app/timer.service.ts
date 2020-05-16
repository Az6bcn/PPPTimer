import { RecordTimer } from './record-timer';
import { NgSelectModel } from './ng-select-model';
import { FormGroup } from '@angular/forms';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  private timeFG$ = new BehaviorSubject<FormGroup>(null);
  private orderOfServiceSub = new BehaviorSubject<Array<NgSelectModel>>([]);
  private recordTimeSub = new ReplaySubject<RecordTimer>(20);
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

  setRecordTimer(record: RecordTimer) {
    this.recordTimeSub.next(record);
  }

  /**
   * Returns the last nth values, where n in this case is 20
   */
  getRecorderTimes() {
    return this.recordTimeSub.asObservable();
  }

  completeRecorderTimes(){
    this.recordTimeSub.complete();
  }
}
