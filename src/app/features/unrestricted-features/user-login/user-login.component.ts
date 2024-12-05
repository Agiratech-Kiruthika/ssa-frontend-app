import { Component, OnInit } from '@angular/core';
import { LoginForm } from '../../../models/forms/login.form';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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

    
  constructor(
      private fb: FormBuilder
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
     this.loginForm.markAllAsTouched();
     if(this.loginForm.invalid){
      return
     }
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
