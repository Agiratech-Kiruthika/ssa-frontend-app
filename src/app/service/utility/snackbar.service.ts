import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../../ui/snackbar/snackbar.component';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  openSnackbar(
    message: string,
    status: string = 'info',
    icon: string = 'info',
    duration: number = 4000
  ) {
    return this.snackBar.openFromComponent(SnackbarComponent, {
      data: { message, status, icon },
      duration: duration,
    });
  }
}
