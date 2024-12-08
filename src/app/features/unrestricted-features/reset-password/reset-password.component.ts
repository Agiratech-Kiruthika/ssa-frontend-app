import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  isOtpSent: boolean = false;
  emailForm: FormGroup;
  resetPasswordForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.resetPasswordForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  get emailError() {
    const email = this.emailForm.get('email');
    if (email?.hasError('required')) return 'Email is required.';
    if (email?.hasError('email')) return 'Invalid email address.';
    return '';
  }

  get otpError() {
    const otp = this.resetPasswordForm.get('otp');
    if (otp?.hasError('required')) return 'OTP is required.';
    if (otp?.hasError('minlength')) return 'OTP must be 6 characters.';
    return '';
  }

  get newPasswordError() {
    const password = this.resetPasswordForm.get('newPassword');
    if (password?.hasError('required')) return 'Password is required.';
    if (password?.hasError('minlength'))
      return 'Password must be at least 8 characters.';
    return '';
  }

  get confirmPasswordError() {
    const confirmPassword = this.resetPasswordForm.get('confirmPassword');
    const newPassword = this.resetPasswordForm.get('newPassword')?.value;
    if (confirmPassword?.hasError('required'))
      return 'Confirm password is required.';
    if (confirmPassword?.value !== newPassword)
      return 'Passwords do not match.';
    return '';
  }

  sendOtp() {
    if (this.emailForm.valid) {
      // Trigger OTP API
      console.log('OTP sent to:', this.emailForm.get('email')?.value);
      this.isOtpSent = true;
    }
  }

  resetPassword() {
    if (this.resetPasswordForm.valid) {
      console.log('Reset Password:', this.resetPasswordForm.value);
      // Trigger Reset Password API
    }
  }
}
