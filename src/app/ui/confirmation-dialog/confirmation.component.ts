import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-logout-confirmation',
  standalone: true,
  imports: [],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.scss'
})
export class LogoutConfirmationComponent {
  constructor(
    public dialogRef: MatDialogRef<LogoutConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string; confirmButtonText: string; cancelButtonText: string }
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true); 
  }

  onCancel(): void {
    this.dialogRef.close(false); 
  }
}