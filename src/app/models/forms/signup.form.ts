import { FormControl, Validators } from '@angular/forms';
import {
  emailValidator,
  matchPasswordValidator,
  passwordValidator,
} from '../../service/utility/validator';

export interface ISignupForm {
  username: FormControl<string | null>;
  email: FormControl<string | null>;
  password: FormControl<string | null>;
  confirmPassword: FormControl<string | null>;
}

export class SignupForm implements ISignupForm {
  username = new FormControl('', [Validators.required]);

  email = new FormControl('', [Validators.required, emailValidator()]);

  password = new FormControl('', [Validators.required, passwordValidator()]);

  confirmPassword = new FormControl('', [
    Validators.required,
    matchPasswordValidator('password'),
  ]);
}
