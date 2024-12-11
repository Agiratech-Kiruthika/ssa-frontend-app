import { CommonModule } from '@angular/common'; 

import { Component } from '@angular/core'; 

import { FormsModule } from '@angular/forms';
import { PostListComponent } from "../../../ui/post-list/post-list.component"; 

 
 

@Component({ 

selector: 'app-feed', 

standalone: true, 

imports: [CommonModule, FormsModule, PostListComponent], 

templateUrl: './feed.component.html', 

styleUrl: './feed.component.scss' 

}) 

export class FeedComponent { 

 
 

posts = [ 

{ 

title: "Post Title 1", 

description: "Description of the post", 

imageUrl: "/assets/images/social-media.jpg", 

comments: ["Great post!", "Interesting read."], 

liked: false // Add the liked property to track the like status 

}, 

{ 

title: "Post Title 2", 

description: "Another description", 

imageUrl: "/assets/images/social-media.jpg", 

comments: ["Nice post!", "I learned a lot."], 

liked: false // Same for the second post 

} 

]; 

 
 

newComment: string = ''; 

 
 

// Toggle Like functionality 

toggleLike(post: any) { 

post.liked = !post.liked; 

} 

 
 

// Add Comment functionality 

addComment(post: any) { 

if (this.newComment.trim()) { 

post.comments.push(this.newComment); 

this.newComment = ''; // Reset comment input 

} 

} 

 
 

// Edit Post functionality 

editPost(post: any) { 

const newTitle = prompt('Edit Post Title', post.title); 

if (newTitle && newTitle.trim()) { 

post.title = newTitle; 

} 

} 

} 

 
 
 
 
 

 