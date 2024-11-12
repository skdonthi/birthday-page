import { AbstractControl, ValidatorFn } from '@angular/forms';

export function numberRangeValidator(
  min: number,
  max: number,
  digits: number
): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (control.value === null || control.value === '') {
      return null; // Don't validate empty values to allow optional controls
    }

    const value = control.value;
    const pattern = new RegExp(`^\\d{${digits}}$`);

    if (!pattern.test(value)) {
      return { invalidFormat: { value: control.value } };
    }

    const numValue = parseInt(value, 10);
    if (numValue < min || numValue > max) {
      return { outOfRange: { value: control.value, min, max } };
    }

    return null;
  };
}
