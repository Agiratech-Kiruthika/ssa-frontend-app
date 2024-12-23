import { Component, OnInit } from '@angular/core';
import { PostListComponent } from '../../../ui/post-list/post-list.component';
import { PostService } from '../../../service/http/createPost.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PostListComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  posts: any[] = [];
  isLoading: boolean = false;
  currentPage: number = 0;
  hasMoreData: boolean = true;

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.getAllPosts();
  }

  getAllPosts(): void {
    if (this.isLoading || !this.hasMoreData) return;

    this.isLoading = true;

    const pageNo = this.currentPage;
    const pageSize = 10;
    const sortBy = 'createdAt';
    const tags = '';
    this.postService.getPosts(pageNo, pageSize, sortBy, tags).subscribe(
      (response) => {
        if (response && response.data && response.data.content) {
          const newPosts = response.data.content;
          this.posts = [...this.posts, ...newPosts];

          if (newPosts.length < pageSize) {
            this.hasMoreData = false;
          } else {
            this.currentPage++;
          }
        } else {
          this.hasMoreData = false;
        }
        this.isLoading = false;
      },
      (error) => {
        console.error(error);
        this.isLoading = false; 
      }
    );
  }

  onScroll(event: any): void {
    const element = event.target;

    const bottom =
      element.scrollHeight - element.scrollTop <= element.clientHeight + 20;

    if (bottom && !this.isLoading && this.hasMoreData) {
      this.getAllPosts();
    }
  }
}
