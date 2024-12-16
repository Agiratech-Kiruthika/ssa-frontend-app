import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PostService } from '../../service/http/createPost.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { LogoutConfirmationComponent } from '../confirmation-dialog/confirmation.component';
import { CommentDialogComponent } from '../comment-dialog/comment-dialog.component';
import { RepostDialogComponent } from '../repost-dialog/repost-dialog.component';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
})
export class PostListComponent implements OnInit, OnChanges {
  @Input() posts: any[] = [];
  @Input() currentUserId!: number;
  @Output() likeToggled = new EventEmitter<any>();
  @Output() commentAdded = new EventEmitter<{ post: any; comment: string }>();
  @Output() postEdited = new EventEmitter<any>();

  searchQuery = '';
  filteredPosts: any[] = [];
  showRepostDialog: boolean = false;
  selectedPost: any = null;

  constructor(
    private postService: PostService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    const user = localStorage.getItem('userId');
    if (user) {
      this.currentUserId = parseInt(user, 10);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['posts'] && changes['posts'].currentValue) {
      this.filteredPosts = this.posts.map((post) => ({
        ...post,
        liked: post.liked === true 
      }));
    }
  }

  onToggleLike(post: any): void {
    if (!this.currentUserId) {
      console.error('User ID is not set. Cannot toggle like.');
      return;
    }

    this.postService.toggleLike(post.id, this.currentUserId).subscribe({
      next: (response: any) => {
        if (response?.status?.code === '1000') {
          post.liked = response.data;
          post.likes += post.liked ? 1 : -1;
        } else {
        }
      },
      error: (error) => {
        console.error('Error toggling like:', error);
      },
    });
  }

  openCommentDialog(post: any): void {
    const dialogRef = this.dialog.open(CommentDialogComponent, {
      width: 'auto',
      data: { post },
    });
  
    dialogRef.componentInstance.commentUpdated.subscribe((updatedPost: any) => {
      const index = this.posts.findIndex(p => p.id === updatedPost.id);
      if (index > -1) {
        this.posts[index] = updatedPost;
        this.filteredPosts = [...this.posts];
        console.log("this comment count ",this.filteredPosts)
        this.cdr.detectChanges();
      }
    });
  
    dialogRef.afterClosed().subscribe(() => {
    });
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
        this.deletePost(postId);
      }
    });
  }

  private deletePost(postId: number): void {
    if (!this.currentUserId) return;

    this.postService.deletePost(postId, this.currentUserId).subscribe({
      next: () => {
        this.posts = this.posts.filter((post) => post.id !== postId);
        this.filteredPosts = this.posts;
        this.snackBar.open('Post deleted successfully!', 'Close', { duration: 3000 });
      },
      error: (error) => {
        this.snackBar.open('Failed to delete the post.', 'Close', { duration: 3000 });
        console.error('Error deleting post:', error);
      },
    });
  }

  
  openRepostDialog(post: any): void {
   if (post.isReposted && post.sharedBy?.userId === this.currentUserId) {
      this.snackBar.open('You have already reposted this post.', 'Close', {
        duration: 3000,
        panelClass: ['snack-bar-warning'],
      });
      return; 
    }
  
    const dialogRef = this.dialog.open(RepostDialogComponent, {
      width: '500px',
      data: { post },
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.handleRepost(result, post);
      }
    });
  }
  

  private handleRepost(result: { post: any; comment: string }, post: any): void {
    console.log("post",post,this.currentUserId)
    if (post.isReposted && post.sharedBy?.userId === this.currentUserId) {
      this.snackBar.open('You have already reposted this post.', 'Close', {
        duration: 3000,
        panelClass: ['snack-bar-warning'],
      });
      return; 
    }
  
    this.postService.sharePost(this.currentUserId, post.id, result.comment).subscribe({
      next: (response: any) => {
        if (response?.status?.code === '1000') {
          post.shares = (post.shares || 0) + 1; 
          post.isReposted = true; 
          post.repostComment = result.comment; 
          post.sharedBy = { userId: this.currentUserId ,username: post.userName}; 
      
  
       
          this.snackBar.open('Post shared successfully!', 'Close', {
            duration: 3000,
            panelClass: ['snack-bar-success'],
          });
        } else {
          this.snackBar.open('Failed to share the post. Please try again.', 'Close', {
            duration: 3000,
            panelClass: ['snack-bar-error'],
          });
        }
      },
      error: (error) => {
        console.error('Failed to share the post:', error);
        this.snackBar.open('Failed to share the post. Please try again.', 'Close', {
          duration: 3000,
          panelClass: ['snack-bar-error'],
        });
      },
    });
  }
  
}
