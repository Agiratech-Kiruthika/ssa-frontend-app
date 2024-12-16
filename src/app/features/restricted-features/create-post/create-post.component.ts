import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import Compressor from 'compressorjs';
import { PostService } from '../../../service/http/createPost.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule, FormsModule],
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss'],
})
export class CreatePostComponent {
  postForm: FormGroup;
  selectedImages: any[] = [];
  selectedTags: string[] = [];
  loading = false; 

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private postService: PostService,
    private router: Router 
  ) {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      tags: [[]],
      images: [[]],
    });
  }

  onImageSelected(event: any): void {
    const files = event.target.files;
  
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
  
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        this.snackBar.open(
          'Only JPG, JPEG, and PNG files are allowed!',
          'Close',
          { duration: 3000 }
        );
        return;
      }
  
      if (file.size > 5 * 1024 * 1024) {
        this.snackBar.open('File size exceeds 5MB!', 'Close', {
          duration: 3000,
        });
        return;
      }
  
      new Compressor(file, {
        quality: 0.8,
        maxWidth: 5867,
        maxHeight: 3911,
        success: (compressedFile) => {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            // Show the image preview immediately after selection
            this.selectedImages.push({
              url: e.target.result,
              file: compressedFile,
            });
  
            this.postForm.get('images')?.setValue(this.selectedImages);
  
            this.cdr.detectChanges();
          };
          reader.onerror = (error) => {
            console.error('FileReader error:', error);
            this.snackBar.open('Error reading image file', 'Close', {
              duration: 3000,
            });
          };
          reader.readAsDataURL(compressedFile);
        },
        error: (err) => {
          console.error('Image compression failed', err);
        },
      });
    }
  }
  

  removeImage(image: any): void {
    this.selectedImages = this.selectedImages.filter((i) => i !== image);
    this.postForm.get('images')?.setValue(this.selectedImages);
  }

  addTag(): void {
    const tag = this.postForm.get('tags')?.value.trim();
    if (tag && !this.selectedTags.includes(tag)) {
      this.selectedTags.push(tag);
      this.postForm.get('tags')?.setValue('');
    }
  }

  removeTag(tag: string): void {
    this.selectedTags = this.selectedTags.filter((t) => t !== tag);
    this.postForm.get('tags')?.setValue(this.selectedTags);
  }

  postContent(): void {
    if (
      this.postForm.valid &&
      this.selectedImages.length > 0 &&
      this.selectedTags.length > 0
    ) {
      this.loading = true;
      const formData = new FormData();

      this.postForm.get('tags')?.setValue(this.selectedTags);

      formData.append('title', this.postForm.get('title')?.value);
      formData.append('description', this.postForm.get('description')?.value);

      formData.append('tags', this.selectedTags.join(','));

      this.selectedImages.forEach((image) => {
        formData.append('images', image.file, image.file.name);
      });

      const userId = localStorage.getItem('userId') as unknown as number;

      this.postService.createPost(formData, userId).subscribe(
        (response) => {
          this.snackBar.open('Post created successfully!', 'Close', {
            duration: 3000,
          });
          this.router.navigate(['/home']);
        },
        (error) => {
          console.error('Error creating post:', error);
          this.snackBar.open(
            'Failed to create post. Please try again.',
            'Close',
            { duration: 3000 }
          );
        }
      );
    } else {
      this.snackBar.open(
        'Please fill all required fields and add images and tags!',
        'Close',
        { duration: 3000 }
      );
    }
  }
}
