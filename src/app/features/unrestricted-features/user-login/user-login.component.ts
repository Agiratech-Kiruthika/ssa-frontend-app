import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LoginForm } from '../../../models/forms/login.form';
import { AuthService } from '../../../service/http/auth.service';
import { hasError } from '../../../service/utility/validator';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, MatSnackBarModule],
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.scss',
})
export class UserLoginComponent implements OnInit {
  loginForm!: FormGroup<LoginForm>;
  passwordVisible = false;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this.initializeFormData();
  }

  initializeFormData() {
    this.loginForm = this.fb.group<LoginForm>(new LoginForm());
  }

  onSubmit() {
    this.isSubmitting = true;
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      this.isSubmitting = false;
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService.login(email!, password!).subscribe({
      next: (response) => {
        this.snackbar.open("Login Successfully", 'Close', {
          duration: 3000,
        });
        this.isSubmitting = false;
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.snackbar.open("Invalid Credentials", 'Close', {
          duration: 3000,
        });
        this.isSubmitting = false;
      },
    });
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  get hasError() {
    return hasError;
  }

  getErrorMessage(controlName: string): string | null {
    const control = this.loginForm.get(controlName);

    if (control?.hasError('required')) {
      return 'Email is required.';
    }

    if (control?.hasError('invalidEmail')) {
      return 'Invalid email address.';
    }

    return null;
  }
}
