import { FormControl, Validators } from '@angular/forms';

export interface ISignupForm {
  username: FormControl<string | null>;
  email: FormControl<string | null>;
  password: FormControl<string | null>;
  confirmPassword: FormControl<string | null>;
}

export class SignupForm implements ISignupForm {
  username = new FormControl('', [
    Validators.required,
    Validators.minLength(4), 
  ]);

  email = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  password = new FormControl('', [
    Validators.required,
    Validators.minLength(8), 
  ]);

  confirmPassword = new FormControl('', [
    Validators.required,
  ]);
}
