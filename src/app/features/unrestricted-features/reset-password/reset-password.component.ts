import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import {
  emailValidator,
  hasError,
  matchPasswordValidator,
  passwordValidator,
} from '../../../service/utility/validator';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  emailForm: FormGroup;
  otpForm: FormGroup;
  resetPasswordForm: FormGroup;
  isOtpSent = false;
  isOtpVerified = false;
  otpTimer = 60;
  remainingTime = this.otpTimer;
  resendOtpDisabled = false;
  otpSubscription: Subscription | null = null;
  passwordVisible = false;
  confirmPasswordVisible = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, emailValidator()]],
    });

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.resetPasswordForm = this.fb.group({
      password: [
        '',
        [Validators.required, Validators.minLength(8), passwordValidator()],
      ],
      confirmPassword: [
        '',
        [Validators.required, matchPasswordValidator('password')],
      ],
    });
  }

  ngOnInit() {}

  sendOtp() {
    if (this.emailForm.invalid) return;

    console.log('Sending OTP to:', this.emailForm.get('email')?.value);

    this.isOtpSent = true;
    this.resendOtpDisabled = true;
    this.startOtpTimer();
    const message = this.isOtpSent
      ? 'OTP resent successfully.'
      : 'OTP sent successfully.';
    this.snackBar.open(message, 'Close', {
      duration: 3000,
    });
  }

  startOtpTimer() {
    this.stopOtpTimer();

    this.remainingTime = this.otpTimer;
    this.otpSubscription = interval(1000).subscribe(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
      } else {
        this.stopOtpTimer();
        this.resendOtpDisabled = false;
      }
    });
  }

  stopOtpTimer() {
    if (this.otpSubscription) {
      this.otpSubscription.unsubscribe();
      this.otpSubscription = null;
    }
  }

  verifyOtp() {
    const enteredOtp = this.otpForm.get('otp')?.value;

    if (enteredOtp === '123456') {
      this.isOtpVerified = true;
      this.stopOtpTimer();

      this.snackBar.open('OTP verified successfully.', 'Close', {
        duration: 3000,
      });
    } else {
      this.snackBar.open('Invalid OTP. Please try again.', 'Close', {
        duration: 3000,
      });
    }
  }

  resetPassword() {
    if (this.resetPasswordForm.invalid) return;

    this.snackBar.open('Password reset successfully.', 'Close', {
      duration: 3000,
    });
    this.router.navigate(['/login']);
  }

  handleBackNavigation() {
    if (this.isOtpVerified) {
      this.isOtpVerified = false;
      this.isOtpSent = true;
    } else if (this.isOtpSent) {
      this.isOtpSent = false;
    } else {
      this.router.navigate(['/login']);
    }
  }

  getErrorMessage(): string {
    const control = this.resetPasswordForm.get('password');
    if (control?.touched && control.errors) {
      if (control.errors['required']) return 'Password is required.';
      if (control.errors['minlength'])
        return 'Password must be at least 8 characters long.';
      if (control.errors['upperCase'])
        return 'Password must contain at least one uppercase letter.';
      if (control.errors['lowerCase'])
        return 'Password must contain at least one lowercase letter.';
      if (control.errors['specialCharacter'])
        return 'Password must include at least one special character.';
      if (control.errors['noSpaces']) return 'Password cannot contain spaces.';
    }
    return '';
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

  ngOnDestroy() {
    this.stopOtpTimer();
  }
}
