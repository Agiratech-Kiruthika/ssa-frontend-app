import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, Input, NgModule, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-repost-dialog',
  standalone: true,
  imports: [CommonModule,FormsModule,MatDialogModule ],
  templateUrl: './repost-dialog.component.html',
  styleUrl: './repost-dialog.component.scss'
})
export class RepostDialogComponent {
  repostComment: string = '';

  constructor(
    public dialogRef: MatDialogRef<RepostDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onCancel(): void {
    this.dialogRef.close(null);
  }

  onConfirm(): void {
    this.dialogRef.close({
      post: this.data.post,
      comment: this.repostComment,
    });
  }
}
