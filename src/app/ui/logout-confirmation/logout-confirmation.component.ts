import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-logout-confirmation',
  standalone: true,
  imports: [],
  templateUrl: './logout-confirmation.component.html',
  styleUrl: './logout-confirmation.component.scss'
})
export class LogoutConfirmationComponent {
  constructor(private dialogRef: MatDialogRef<LogoutConfirmationComponent>) {}

  confirmLogout() {
    this.dialogRef.close(true); 
  }

  closeDialog() {
    this.dialogRef.close(false); 
  }
}