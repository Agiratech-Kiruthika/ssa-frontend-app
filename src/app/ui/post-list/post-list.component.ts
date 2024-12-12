import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PostService } from '../../service/http/createPost.service';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss',
})
export class PostListComponent implements OnInit {
  posts: any[] = [];
  isLoading: boolean=false;
 
  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.getPosts();
  }

  toggleLike(post: any): void {
    post.isLiked = !post.isLiked;
    post.likes += post.isLiked ? 1 : -1;
  }

  openComments(post: any): void {
    console.log(`Opening comments for post ID: ${post.id}`);
  }
  // getPosts(): void {
  //   const userId = 14;
  //   this.postService.getPost(userId).subscribe(
  //     (response) => {
  //       if (response && response.data) {
  //         this.posts = Array.isArray(response.data)
  //           ? response.data
  //           : [response.data];
  //         console.log('post', this.posts);
  //       } else {
  //         console.error(
  //           'Response does not contain a valid data field:',
  //           response
  //         );
  //       }
  //     },
  //     (error) => {
  //       console.error('Error fetching posts:', error);
  //     }
  //   );
  // }

   // Method to fetch all posts
  
  
  
   getPosts(): void {
    const pageNo = 0;       // Current page number
    const pageSize = 10;    // Number of posts per page
    const sortBy = 'createdAt';  // Sorting criteria (e.g., createdAt)
    const tags = '';        // Optional: filter by tags, can be a comma-separated string
  
    this.isLoading = true;
  
    this.postService.getPosts(pageNo, pageSize, sortBy, tags).subscribe(
      (response) => {
        if (response && response.data && response.data.content) {
          // Access the content array from the response data
          this.posts = response.data.content;
         

          console.log('Fetched posts:', this.posts);
        } else {
          console.error('Response does not contain valid data:', response);
        }
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching posts:', error);
        this.isLoading = false;
      }
    );
  }
  
  
}
