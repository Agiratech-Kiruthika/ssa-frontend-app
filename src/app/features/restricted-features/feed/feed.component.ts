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
  currentPage: number = 0; 
  hasMoreData: boolean = true; 

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.getPosts();
  }

 
  getPosts(): void {
    if (this.isLoading || !this.hasMoreData) return; // Prevent loading if already fetching or no more data

    this.isLoading = true;
    const userId = localStorage.getItem('userId');
    if (!userId) {
      this.isLoading = false;
      return;
    }

    const pageNo = this.currentPage;
    const pageSize = 10;
    const sortBy = 'createdAt';
    const tags = '';

    this.postService
      .getPost(parseInt(userId, 10), pageNo, pageSize, sortBy, tags)
      .subscribe(
        (response) => {
          if (response && response.data) {
            const newPosts = response.data.content;
            this.posts = [...this.posts, ...newPosts]; 

            if (newPosts.length < pageSize) {
              this.hasMoreData = false;
            } else {
              this.currentPage++; 
            }
          } else {
          }
          this.isLoading = false;
        },
        (error) => {
          this.isLoading = false;
        }
      );
  }


  onScroll(event: any): void {
    const bottom = event.target.scrollHeight === event.target.scrollTop + event.target.clientHeight;
    if (bottom && !this.isLoading && this.hasMoreData) {
      this.getPosts(); 
    }
  }


 

}
