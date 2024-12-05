import { FormControl, Validators } from '@angular/forms';

export interface ILoginForm {
  email: FormControl<string | null >;
  password: FormControl<string | null>;
}

export class LoginForm implements ILoginForm {
  email = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  password = new FormControl('', [
    Validators.required,
  ]);
}
