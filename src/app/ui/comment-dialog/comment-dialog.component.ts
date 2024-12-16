import { Component, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PostService } from '../../service/http/createPost.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-comment-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatMenuModule],
  templateUrl: './comment-dialog.component.html',
  styleUrls: ['./comment-dialog.component.scss'],
})
export class CommentDialogComponent {
  currentUserId!: number;
  post: any;
  newComment: string = '';
  comments: any[] = [];
  editingCommentId: number | null = null;
  updatedText: string = '';

  @Output() commentUpdated = new EventEmitter<any>(); 

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CommentDialogComponent>,
    private postService: PostService
  ) {
    this.post = data.post;
  }

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.currentUserId = parseInt(userId, 10);
    }
    this.loadComments();
  }

  loadComments(): void {
    this.postService.getComments(this.post.id).subscribe({
      next: (response) => {
        this.comments = response.data || [];
      },
      error: (error) => {},
    });
  }

  onSaveComment(): void {
    if (!this.newComment.trim()) {
      return;
    }

    if (this.editingCommentId) {
      this.updateComment(this.editingCommentId, this.newComment);
    } else {
      this.addComment();
    }

    this.newComment = '';
    this.editingCommentId = null;
  }

  addComment(): void {
    const comment = {
      userName: this.post.userName,
      text: this.newComment,
      timestamp: new Date().toLocaleString(),
    };

    this.postService
      .addComment(this.post.id, this.currentUserId, comment.text)
      .subscribe({
        next: (response) => {
          this.loadComments();
          this.commentUpdated.emit(this.post);
        },
        error: (error) => {},
      });
  }

  updateComment(commentId: number, updatedText: string): void {
    this.postService
      .updateComment(commentId, updatedText, this.currentUserId)
      .subscribe({
        next: (response) => {
          this.loadComments();
          this.commentUpdated.emit(this.post);
        },
        error: (error) => {},
      });
  }

  onEditComment(comment: any): void {
    this.editingCommentId = comment.commentId;
    this.newComment = comment.comment;
  }

  onDeleteComment(comment: any): void {
    const index = this.comments.indexOf(comment);
    if (index > -1) {
      this.comments.splice(index, 1);
    }

    this.postService
      .deleteComment(this.post.id, comment.commentId, this.currentUserId)
      .subscribe({
        next: (response) => {
          this.commentUpdated.emit(this.post);
        },
        error: (error) => {
          this.comments.splice(index, 0, comment);
        },
      });
  }
}
