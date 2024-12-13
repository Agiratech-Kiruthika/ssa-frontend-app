import { Component, OnInit } from '@angular/core';
import { PostListComponent } from '../../../ui/post-list/post-list.component';
import { PostService } from '../../../service/http/createPost.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PostListComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  posts: any[] = [];
  isLoading: boolean = false;

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.getAllPosts();
  }

  getAllPosts(): void {
    this.isLoading = true;

    const pageNo = 0; 
    const pageSize = 10; 
    const sortBy = 'createdAt'; 
    const tags = '';

    this.postService.getPosts(pageNo, pageSize, sortBy, tags).subscribe(
      (response) => {
        if (response && response.data && response.data.content) {
          this.posts = response.data.content;
          console.log('Fetched all posts:', this.posts);
        } else {
          console.error('Invalid response:', response);
        }
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching all posts:', error);
        this.isLoading = false;
      }
    );
  }
}
