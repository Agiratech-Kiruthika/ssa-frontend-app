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
  // posts = [
  //   {
  //     id: 1,
  //     username: 'JohnDoe',
  //     title: 'Sunset Views',
  //     image: 'assets/images/post4.jpg',
  //     likes: 120,
  //     comments: 12,
  //     caption: 'Loving the vibes!',
  //     isLiked:false
  //   },
  //   {
  //     id: 2,
  //     username: 'john_doe',
  //     title: 'adventure',
  //     image: '/assets/images/social-media.jpg',
  //     likes: 120,
  //     caption: 'Exploring the city lights ✨',
  //   },
  //   {
  //     id:3,
  //     username: 'jane_smith',
  //     title: 'adventure',
  //     image: 'assets/images/post2.jpg',
  //     likes: 345,
  //     caption: 'Beach vibes 🌊 #CaliforniaDreaming',
  //   },
  // ];

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
  getPosts(): void {
    const userId = 5;
    this.postService.getPost(userId).subscribe(
      (response) => {
        if (response && response.data) {
          this.posts = Array.isArray(response.data)
            ? response.data
            : [response.data];
          console.log('post', this.posts);
        } else {
          console.error(
            'Response does not contain a valid data field:',
            response
          );
        }
      },
      (error) => {
        console.error('Error fetching posts:', error);
      }
    );
  }
}
