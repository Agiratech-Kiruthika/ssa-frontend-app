import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss',
})
export class PostListComponent implements OnInit {
  posts = [
    {
      id: 1,
      username: 'JohnDoe',
      title: 'Sunset Views',
      image: 'assets/images/post4.jpg',
      likes: 120,
      comments: 12,
      caption: 'Loving the vibes!',
      isLiked:false
    },
    {
      id: 2,
      username: 'john_doe',
      title: 'adventure',
      image: '/assets/images/social-media.jpg',
      likes: 120,
      caption: 'Exploring the city lights ✨',
    },
    {
      id:3,
      username: 'jane_smith',
      title: 'adventure',
      image: 'assets/images/post2.jpg',
      likes: 345,
      caption: 'Beach vibes 🌊 #CaliforniaDreaming',
    },
  ];

  constructor() {}

  ngOnInit(): void {}

  toggleLike(post: any): void {
    post.isLiked = !post.isLiked; // Toggle the like status
    post.likes += post.isLiked ? 1 : -1; // Increment or decrement the like count
  }

  openComments(post: any): void {
    console.log(`Opening comments for post ID: ${post.id}`);
    // You can add a modal or navigate to a detailed comment section here
  }

}
