/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TimerMainComponent } from './timer-main.component';

describe('TimerMainComponent', () => {
  let component: TimerMainComponent;
  let fixture: ComponentFixture<TimerMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimerMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimerMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
