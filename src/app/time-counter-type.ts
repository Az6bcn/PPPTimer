export interface TimeCounterType {
  hours: number;
  minutes: number;
  counterType: CounterTypeEnum;
}


export enum CounterTypeEnum {
  Up = 1,
  Down = 2
}
