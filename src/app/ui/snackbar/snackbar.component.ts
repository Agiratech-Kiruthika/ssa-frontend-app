import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.scss'
})
export class SnackbarComponent implements OnInit {

  message: string = '';
  status: string = '';
  dismissLabel: string = 'X'; 

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
    private snackBarRef: MatSnackBarRef<SnackbarComponent>
  ) {}

  ngOnInit() {
    this.message = this.data?.message || 'Default message';
    this.status = this.data?.status || 'info'; 
  }

  dismiss() {
    this.snackBarRef.dismiss(); 
  }
}
