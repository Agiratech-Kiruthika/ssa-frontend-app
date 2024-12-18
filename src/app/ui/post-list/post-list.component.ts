import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  OnInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PostService } from '../../service/http/createPost.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { LogoutConfirmationComponent } from '../confirmation-dialog/confirmation.component';
import { CommentDialogComponent } from '../comment-dialog/comment-dialog.component';
import { RepostDialogComponent } from '../repost-dialog/repost-dialog.component';
import { RouterLink } from '@angular/router';



@Component({
  selector: 'app-post-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  likedPostIds: number[] = [];

  repostedPosts: any[] = []; 
  normalPosts: any[] = [];
  currentIndex: number = 0;
  currentPostIndex: number = 0;
  currentSlide = 0;

  constructor(
    private postService: PostService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const user = localStorage.getItem('userId');
    if (user) {
      this.currentUserId = parseInt(user, 10);
    }
    console.log("post",this.posts)
    this.fetchUserLikedPosts();
   
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['posts'] && changes['posts'].currentValue) {
      this.filteredPosts = this.posts.map((post) => ({
        ...post,
        liked: this.likedPostIds.includes(post.id),
      }));
      
    }
  }


 // Method to go to the previous slide
prevSlide() {
  if (this.posts.length > 0 && this.posts[0].images.length > 0) {
    if (this.currentSlide > 0) {
      this.currentSlide--;
    } else {
      this.currentSlide = this.posts[0].images.length - 1; // Loop back to the last image
    }
  }
}

// Method to go to the next slide
nextSlide() {
  if (this.posts.length > 0 && this.posts[0].images.length > 0) {
    if (this.currentSlide < this.posts[0].images.length - 1) {
      this.currentSlide++;
    } else {
      this.currentSlide = 0; // Loop back to the first image
    }
  }
}

// Method to go to a specific slide
goToSlide(index: number) {
  if (this.posts.length > 0 && this.posts[0].images.length > 0) {
    this.currentSlide = index;
  }
}

  

  onToggleLike(post: any): void {
    if (!this.currentUserId) {
      return;
    }

    if (post.liked) {
      this.postService.toggleLike(post.id, this.currentUserId).subscribe({
        next: (response: any) => {
          if (response?.status?.code === '1000') {
            post.liked = false;
            post.likes = Math.max(0, post.likes - 1);
          }
        },
        error: (error) => {},
      });
    } else {
      this.postService.toggleLike(post.id, this.currentUserId).subscribe({
        next: (response: any) => {
          if (response?.status?.code === '1000') {
            post.liked = true;
            post.likes += 1;
          }
        },
        error: (error) => {},
      });
    }
  }

  openCommentDialog(post: any): void {
    const dialogRef = this.dialog.open(CommentDialogComponent, {
      width: 'auto',
      data: { post },
    });

    dialogRef.afterClosed().subscribe(() => {});
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
        this.snackBar.open('Post deleted successfully!', 'Close', {
          duration: 3000,
        });
      },
      error: (error) => {
        this.snackBar.open('Failed to delete the post.', 'Close', {
          duration: 3000,
        });
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

  private handleRepost(
    result: { post: any; comment: string },
    post: any
  ): void {
    console.log('post', post, this.currentUserId);
    if (post.isReposted && post.sharedBy?.userId === this.currentUserId) {
      this.snackBar.open('You have already reposted this post.', 'Close', {
        duration: 3000,
        panelClass: ['snack-bar-warning'],
      });
      return;
    }

    this.postService
      .sharePost(this.currentUserId, post.id, result.comment)
      .subscribe({
        next: (response: any) => {
          if (response?.status?.code === '1000') {
            post.shares = (post.shares || 0) + 1;
            post.isReposted = true;
            post.repostComment = result.comment;
            post.sharedBy = {
              userId: this.currentUserId,
              username: post.userName,
            };

            this.snackBar.open('Post shared successfully!', 'Close', {
              duration: 3000,
              panelClass: ['snack-bar-success'],
            });
          } else {
            this.snackBar.open(
              'Failed to share the post. Please try again.',
              'Close',
              {
                duration: 3000,
                panelClass: ['snack-bar-error'],
              }
            );
          }
        },
        error: (error) => {
          console.error('Failed to share the post:', error);
          this.snackBar.open(
            'Failed to share the post. Please try again.',
            'Close',
            {
              duration: 3000,
              panelClass: ['snack-bar-error'],
            }
          );
        },
      });
  }

  fetchUserLikedPosts(): void {
    const pageNo = 0;
    const pageSize = 10;
    this.likedPostIds = [];

    this.loadLikedPosts(pageNo, pageSize);
  }

  loadLikedPosts(pageNo: number, pageSize: number): void {
    this.postService
      .getLikedPosts(this.currentUserId, pageNo, pageSize)
      .subscribe(
        (response: any) => {

          if (response?.data?.posts && Array.isArray(response.data.posts)) {
            this.likedPostIds = [
              ...this.likedPostIds,
              ...response.data.posts.map((post: any) => post.id),
            ];

            if (response.data.posts.length === pageSize) {
              this.loadLikedPosts(pageNo + 1, pageSize);
            } else {
              this.updatePostLikeStatus();
            }
          } else {
            this.likedPostIds = [];
            this.updatePostLikeStatus();
          }
        },
        (error: any) => {
          this.likedPostIds = [];
          this.updatePostLikeStatus();
        }
      );
  }

  updatePostLikeStatus(): void {
    this.filteredPosts = this.posts.map((post) => ({
      ...post,
      liked: this.likedPostIds.includes(post.id),
    }));
  }
}
