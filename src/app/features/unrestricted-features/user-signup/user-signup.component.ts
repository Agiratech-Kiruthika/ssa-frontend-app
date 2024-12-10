import { Component, OnInit } from '@angular/core';
import { SignupForm } from '../../../models/forms/signup.form';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SignupService } from '../../../service/http/signup.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { hasError } from '../../../service/utility/validator';

@Component({
  selector: 'app-user-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatSnackBarModule],
  templateUrl: './user-signup.component.html',
  styleUrl: './user-signup.component.scss',
})
export class CreateAccountComponent implements OnInit {
  signupForm!: FormGroup<SignupForm>;
  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private signupService: SignupService,
    private snackbar: MatSnackBar
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
      this.isSubmitting = false;
      this.snackbar.open('Please correct the errors in the form.', 'Close', {
        duration: 3000,
      });
      return;
    }

    const userData = this.signupForm.value;

    this.signupService.signup(userData).subscribe({
      next: (response) => {
        const successMessage = response.data || 'Signup successful!';

        this.snackbar.open(successMessage, 'Close', {
          duration: 4000,
        });

        this.signupForm.reset();
        this.isSubmitting = false;
        this.router.navigate(['/login']);
      },
      error: (error) => {
        const errorMessage =
          error?.error?.data || 'An error occurred. Please try again later.';

        this.snackbar.open(errorMessage, 'Close', {
          duration: 3000,
        });
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
