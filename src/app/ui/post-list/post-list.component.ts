import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
})
export class PostListComponent implements OnChanges {
  @Input() posts: any[] = []; 
  @Output() likeToggled = new EventEmitter<any>();
  @Output() commentAdded = new EventEmitter<{ post: any; comment: string }>();
  @Output() postEdited = new EventEmitter<any>();

  searchQuery = '';
  filteredPosts: any[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['posts'] && changes['posts'].currentValue) {
      this.filteredPosts = [...this.posts];
    }
  }

  onToggleLike(post: any): void {
    this.likeToggled.emit(post);
  }

  onAddComment(post: any, comment: string): void {
    this.commentAdded.emit({ post, comment });
  }

  onEditPost(post: any): void {
    this.postEdited.emit(post);
  }

  onSearch(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredPosts = this.posts.filter(
      post =>
        post.title.toLowerCase().includes(query) ||
        post.tags.some((tag: string) => tag.toLowerCase().includes(query))
    );
  }
}
