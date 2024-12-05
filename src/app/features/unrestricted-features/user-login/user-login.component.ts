import { Component, OnInit } from '@angular/core';
import { LoginForm } from '../../../models/forms/login.form';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../service/http/auth.service';
import { SnackbarService } from '../../../service/utility/snackbar.service';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [ ReactiveFormsModule,CommonModule],
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.scss'
})
export class UserLoginComponent  implements OnInit {
  loginForm!: FormGroup<LoginForm>;
  passwordVisible: boolean = false;
  errorMessages: { [key: string]: string } = {};
  successMessage: string | null = null;
  isSubmitting: boolean = false; 

    
  constructor(
      private fb: FormBuilder,
      private authService: AuthService,
      private snackbarService: SnackbarService 
    ) {
    

      }
  
    ngOnInit() {
      this.initializeFormData();
  
      this.loginForm.valueChanges.subscribe(() => {
        this.setErrorMessages();
      });
    }
  

  initializeFormData() {
    this.loginForm = this.fb.group<LoginForm>(new LoginForm());
  }

  onSubmit() {
     this.isSubmitting = true;
     this.loginForm.markAllAsTouched();
     if(this.loginForm.invalid){
      this.isSubmitting = false; 
      return;
     }

     const { email, password } = this.loginForm.value;

     this.authService.login(email!, password!).subscribe({
       next: (response) => {
         this.successMessage = response.message;  
         this.errorMessages = {};
         this.snackbarService.openSnackbar(response.message, 'success'); 
         this.isSubmitting = false;  
         console.log(this.successMessage)
       },
       error: (error) => {
         this.errorMessages['login'] = error.message || 'Login failed! Please try again.';
         this.isSubmitting = false;  
         this.snackbarService.openSnackbar(this.errorMessages['login'], 'error'); 
         console.log(error.message)
       },
     });
   }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  private setErrorMessages() {
    this.errorMessages = {};
  
    const controls = {
      email: this.loginForm.get('email'),
      password: this.loginForm.get('password'),
    };
  
    Object.entries(controls).forEach(([field, control]) => {
      if (control?.invalid && (control.dirty || control.touched)) {
        if (control.hasError('required')) {
          this.errorMessages[field] = `${this.capitalize(field)} is required.`;
        }
      }
    });
  }
  
  private capitalize(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }
  

}
