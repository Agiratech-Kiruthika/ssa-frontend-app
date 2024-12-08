import { Component, OnInit } from '@angular/core';
import { LoginForm } from '../../../models/forms/login.form';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../service/http/auth.service';
import { SnackbarService } from '../../../service/utility/snackbar.service';
import { Router, RouterLink } from '@angular/router';
import { hasError } from '../../../service/utility/validator';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.scss',
})
export class UserLoginComponent implements OnInit {
  loginForm!: FormGroup<LoginForm>;
  passwordVisible: boolean = false;
  successMessage: string | null = null;
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackbarService: SnackbarService,
    private router: Router
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
        this.successMessage = response.message;
        this.snackbarService.openSnackbar(response.message, 'success');
        this.isSubmitting = false;
        this.router.navigate(['/create-post']);
      },
      error: (error) => {
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
