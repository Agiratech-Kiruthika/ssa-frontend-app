import { Component, OnInit } from '@angular/core';
import { SignupForm } from '../../../models/forms/signup.form';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SnackbarService } from '../../../service/utility/snackbar.service';
import { AuthService } from '../../../service/http/auth.service';
import { SignupService } from '../../../service/http/signup.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-user-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-signup.component.html',
  styleUrl: './user-signup.component.scss'
})
export class CreateAccountComponent implements OnInit {
  signupForm!: FormGroup<SignupForm>;
  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;
  errorMessages: { [key: string]: string } = {};
  isSubmitting: boolean = false; 

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackbarService: SnackbarService ,
    private signupService: SignupService,
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.signupForm.valueChanges.subscribe(() => {
      this.setErrorMessages();
    });
  }

  initializeForm() {
    this.signupForm = this.fb.group<SignupForm>(new SignupForm());
  }

  onSubmit() {
    this.isSubmitting = true;
    this.signupForm.markAllAsTouched();
    if (this.signupForm.invalid) {
      this.setErrorMessages();
      return;
    }

    const userData = this.signupForm.value;

    this.signupService.signup(userData).subscribe({
      next: (response) => {
        this.snackbarService.openSnackbar('Signup successful! You can now log in.');
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (error) => {
        this.snackbarService.openSnackbar('Signup failed. Please try again.', 'error');
        this.isSubmitting = false;
      }
    });
  }
  private setErrorMessages() {
    this.errorMessages = {};

    const controls = {
      username: this.signupForm.get('username'),
      email: this.signupForm.get('email'),
      password: this.signupForm.get('password'),
      confirmPassword: this.signupForm.get('confirmPassword'),
    };

    Object.entries(controls).forEach(([field, control]) => {
      if (control?.invalid && (control.touched || control.dirty)) {
        if (control.hasError('required')) {
          this.errorMessages[field] = `${this.capitalize(field)} is required.`;
        } else if (control.hasError('email')) {
          this.errorMessages[field] = 'Invalid email format.';
        } else if (control.hasError('minlength')) {
          this.errorMessages[field] = `${this.capitalize(field)} must be at least ${control.getError('minlength')?.requiredLength} characters.`;
        } else if (control.hasError('maxlength')) {
          this.errorMessages[field] = `${this.capitalize(field)} must be at most ${control.getError('maxlength')?.requiredLength} characters.`;
        }
      }
    });

    const password = this.signupForm.get('password')?.value;
    const confirmPassword = this.signupForm.get('confirmPassword')?.value;
  
    if (password && confirmPassword && password !== confirmPassword) {
      this.errorMessages['confirmPassword'] = 'Passwords do not match.';
    }

    if (password && !this.isPasswordStrong(password)) {
      this.errorMessages['password'] = 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.';
    }
  }

  private capitalize(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible; 
  }

  toggleConfirmPasswordVisibility() {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;  
  }
  

  isPasswordStrong(password: string): boolean {
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  }

}
