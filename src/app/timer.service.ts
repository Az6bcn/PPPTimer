import { FormGroup } from '@angular/forms';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  private timeFG$ = new BehaviorSubject<FormGroup>(null);
  setTimerFGSub(data: FormGroup) {
    this.timeFG$.next(data);
  }

  getTimer$(): Observable<FormGroup> {
    return this.timeFG$.asObservable();
  }
}
