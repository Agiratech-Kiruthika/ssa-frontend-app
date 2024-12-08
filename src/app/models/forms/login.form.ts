import { FormControl, Validators } from '@angular/forms';
import { emailValidator } from '../../service/utility/validator';

export interface ILoginForm {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}

export class LoginForm implements ILoginForm {
  email = new FormControl('', [Validators.required, emailValidator()]);

  password = new FormControl('', [Validators.required]);
}
