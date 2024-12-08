import { Component, OnInit } from '@angular/core';
import { SignupForm } from '../../../models/forms/signup.form';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SnackbarService } from '../../../service/utility/snackbar.service';
import { AuthService } from '../../../service/http/auth.service';
import { SignupService } from '../../../service/http/signup.service';
import { HttpClientModule } from '@angular/common/http';
import { hasError } from '../../../service/utility/validator';

@Component({
  selector: 'app-user-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './user-signup.component.html',
  styleUrl: './user-signup.component.scss',
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
    private snackbarService: SnackbarService,
    private signupService: SignupService
  ) {}

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.signupForm = this.fb.group<SignupForm>(new SignupForm());
  }

  onSubmit() {
    this.isSubmitting = true;
    this.signupForm.markAllAsTouched();
    if (this.signupForm.invalid) {
      return;
    }

    const userData = this.signupForm.value;

    this.signupService.signup(userData).subscribe({
      next: (response) => {
        this.snackbarService.openSnackbar(
          'Signup successful! You can now log in.'
        );
        this.signupForm.reset();
        this.isSubmitting = false;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (error) => {
        this.snackbarService.openSnackbar(
          'Signup failed. Please try again.',
          'error'
        );
        this.isSubmitting = false;
      },
    });
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleConfirmPasswordVisibility() {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  get hasError() {
    return hasError;
  }

  getErrorMessage(controlName: string): string | null {
    const control = this.signupForm.get(controlName);
    if (!control) return null;

    const errorMessages: { [key: string]: { [key: string]: string } } = {
      email: {
        required: 'Email is required.',
        invalidEmail: 'Invalid email address.',
      },
      password: {
        required: 'Password is required.',
        minLength: 'Password must be at least 8 characters long.',
        upperCase: 'Password must contain at least one uppercase letter.',
        lowerCase: 'Password must contain at least one lowercase letter.',
        specialCharacter:
          'Password must include at least one special character.',
        noSpaces: 'Password cannot contain spaces.',
      },
    };

    const controlErrors = errorMessages[controlName];
    if (!controlErrors) return null;

    for (const error in control.errors) {
      if (controlErrors[error]) {
        return controlErrors[error];
      }
    }

    return null;
  }
}
