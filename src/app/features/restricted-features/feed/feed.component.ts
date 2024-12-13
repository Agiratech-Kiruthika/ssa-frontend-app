import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PostListComponent } from '../../../ui/post-list/post-list.component';
import { PostService } from '../../../service/http/createPost.service';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, FormsModule, PostListComponent],
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
})
export class FeedComponent implements OnInit {
  posts: any[] = [];
  isLoading: boolean = false;

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.getPosts();
  }

  getPosts(): void {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      return;
    }

    const pageNo = 0;
    const pageSize = 10;
    const sortBy = 'createdAt';
    const tags = '';

    this.isLoading = true;

    this.postService
      .getPost(parseInt(userId, 10), pageNo, pageSize, sortBy, tags)
      .subscribe(
        (response) => {
          if (response && response.data) {
            this.posts = response.data.content;
          } else {
            console.error('Invalid response structure:', response);
          }
          this.isLoading = false;
        },
        (error) => {
          console.error('Error fetching posts:', error);
          this.isLoading = false;
        }
      );
  }

  toggleLike(post: any): void {
    post.liked = !post.liked;
  }

  addComment(post: any, comment: string): void {
    if (comment.trim()) {
      post.comments = post.comments || [];
      post.comments.push(comment);
      console.log(`Comment added to post:`, post);
    }
  }

  editPost(post: any): void {
    const newTitle = prompt('Edit Post Title', post.title);
    if (newTitle && newTitle.trim()) {
      post.title = newTitle;
      console.log(`Post title edited:`, post);
    }
  }
}
