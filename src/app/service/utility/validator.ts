import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

export function emailValidator(): ValidatorFn {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return (control: AbstractControl): ValidationErrors | null =>
    control.value && !emailRegex.test(control.value)
      ? { invalidEmail: true }
      : null;
}

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value || '';

    const errors: ValidationErrors = {};

    if (value.length < 8) {
      errors['minLength'] = true;
    }
    if (!/[A-Z]/.test(value)) {
      errors['upperCase'] = true;
    }
    if (!/[a-z]/.test(value)) {
      errors['lowerCase'] = true;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      errors['specialCharacter'] = true;
    }
    if (/\s/.test(value)) {
      errors['noSpaces'] = true;
    }

    return Object.keys(errors).length ? errors : null;
  };
}

export function hasError(
  form: FormGroup,
  controlName: string,
  errorName: string,
  submitted: boolean
): boolean {
  const control = form.get(controlName);
  return !!(
    control &&
    (control.touched || submitted) &&
    control.errors?.[errorName]
  );
}

export function matchPasswordValidator(passwordField: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const form = control.parent;
    if (!form) {
      return null;
    }

    const password = form.get(passwordField)?.value;
    const confirmPassword = control.value;

    return password && confirmPassword && password !== confirmPassword
      ? { passwordsMismatch: true }
      : null;
  };
}
