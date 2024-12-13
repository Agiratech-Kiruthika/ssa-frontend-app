import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http'; // Import HttpClient
import { PostService } from '../../service/http/createPost.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { LogoutConfirmationComponent } from '../confirmation-dialog/confirmation.component';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
})
export class PostListComponent implements OnInit, OnChanges {
  @Input() posts: any[] = [];
  @Output() likeToggled = new EventEmitter<any>();
  @Output() commentAdded = new EventEmitter<{ post: any; comment: string }>();
  @Output() postEdited = new EventEmitter<any>();

  searchQuery = '';
  filteredPosts: any[] = [];
  currentUserId!: number;

  constructor(
    private http: HttpClient,
    private postService: PostService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const user = localStorage.getItem('userId');

    if (user) {
      this.currentUserId = parseInt(user, 10);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['posts'] && changes['posts'].currentValue) {
      this.filteredPosts = [...this.posts];
    }
  }

  onToggleLike(post: any): void {
    this.likeToggled.emit(post);
  }

  onAddComment(post: any, comment: string): void {
    this.commentAdded.emit({ post, comment });
  }

  onEditPost(post: any): void {
    this.postEdited.emit(post);
  }

  onSearch(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredPosts = this.posts.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.tags.some((tag: string) => tag.toLowerCase().includes(query))
    );
  }
  onDeletePost(postId: number): void {
    const dialogRef = this.dialog.open(LogoutConfirmationComponent, {
      width: '400px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete this post?',
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
      },
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Proceed with deletion
        const userId = this.currentUserId;
        if (!userId) {
          return;
        }
  
        this.postService.deletePost(postId, userId).subscribe({
          next: (response: any) => {
            if (response) {
              this.posts = this.posts.filter((post) => post.id !== postId);
              this.filteredPosts = this.posts;
  
              this.snackBar.open('Post deleted successfully!', 'Close', {
                duration: 3000,
              });
            }
          },
          error: (error) => {
            this.snackBar.open('Failed to delete the post.', 'Close', {
              duration: 3000,
            });
          },
        });
      }
    });
  }
}
