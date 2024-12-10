import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { hasError } from '../../../service/utility/validator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.scss',
})
export class CreatePostComponent {
  currentStep = 1;
  createPostForm: FormGroup;
  imageError: string | null = null;
  fileName: string | null = null;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.createPostForm = this.fb.group({
      image: [null, Validators.required],
      title: ['', [Validators.required, Validators.minLength(6)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      tags: ['', Validators.required],
    });
  }

  isStepValid(): boolean {
    const currentControl = this.getCurrentControlName();
    return currentControl
      ? this.createPostForm.get(currentControl)?.valid ?? false
      : true;
  }

  getCurrentControlName(): string | null {
    switch (this.currentStep) {
      case 1:
        return 'image';
      case 2:
        return 'title';
      case 3:
        return 'description';
      case 4:
        return 'tags';
      default:
        return null;
    }
  }

  nextStep() {
    if (this.currentStep < 4) {
      this.currentStep++;
    } else {
      this.submitPost();
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onImageSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const validExtensions = ['image/jpeg', 'image/png', 'image/jpg'];
      const maxSize = 5 * 1024 * 1024;

      if (!validExtensions.includes(file.type)) {
        this.imageError = 'Only JPG, JPEG, and PNG files are allowed.';
        this.createPostForm.get('image')?.setValue(null);
        this.fileName = null;
      } else if (file.size > maxSize) {
        this.imageError = 'File size exceeds 5MB.';
        this.createPostForm.get('image')?.setValue(null);
        this.fileName = null;
      } else {
        this.imageError = null;
        this.createPostForm.get('image')?.setValue(file);
        this.fileName = file.name;
      }
    }
  }

  submitPost() {
    if (this.createPostForm.valid) {
      console.log('Form Submitted:', this.createPostForm.value);
      this.snackBar.open('Post created successfully!', 'Close', {
        duration: 3000, 
       });
    }
  }


  resetImage(imageInput: HTMLInputElement) {
    imageInput.value = '';
    this.createPostForm.get('image')?.setValue(null);
    this.fileName = null;
    this.imageError = null;
  }

  get hasError() {
    return hasError;
  }
}
