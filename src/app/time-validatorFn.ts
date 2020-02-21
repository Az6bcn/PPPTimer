import { AbstractControl, ValidationErrors } from '@angular/forms';

export function TimeValidatorFn(control: AbstractControl): ValidationErrors | null {

  if (control.valid) {
    const value = control.value;

    const splitted = value.split(':');

    if (splitted.length !== 3) { return { invalidTime: 'Please enter time in HH:MM:SS format' }; }
    if (splitted[0] as number < 0 || splitted[0] as number > 24) { return { invalidTime: 'Enter values between 1 - 24 for hours' }; }

    if (splitted[1] as number < 0 || splitted[1] as number > 59) { return { invalidTime: 'Enter values between 1 - 59 for minutes' }; }

    if (splitted[2] as number < 0 || splitted[2] as number > 59) { return { invalidTime: 'Enter values between 1 - 59 for seconds' }; }

    return null;
  }
}
