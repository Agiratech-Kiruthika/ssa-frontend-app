import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private http: HttpClient) {}

  createPost(formData: FormData, userId: number): Observable<any> {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const tags = formData.get('tags') as string;

    const url = `${
      environment.apiUrl
    }/post/createPost?title=${encodeURIComponent(
      title
    )}&description=${encodeURIComponent(
      description
    )}&userId=${userId}&tags=${encodeURIComponent(tags)}`;

    formData.delete('title');
    formData.delete('description');
    formData.delete('tags');

    return this.http.post(url, formData);
  }

  getPost(
    userId: number,
    pageNo: number,
    pageSize: number,
    sortBy: string,
    tags: string
  ): Observable<any> {
    const url = `${environment.apiUrl}/user/posts/${userId}`;
    const params = new HttpParams()
      .set('page_no', pageNo.toString())
      .set('page_size', pageSize.toString())
      .set('sort_by', sortBy)
      .set('tags', tags);

    return this.http.get<any>(url, { params });
  }

  getPosts(
    pageNo: number,
    pageSize: number,
    sortBy: string,
    tags: string = ''
  ): Observable<any> {
    const url = `${environment.apiUrl}/post/getAll`;

    const params = new HttpParams()
      .set('page_no', pageNo.toString())
      .set('page_size', pageSize.toString())
      .set('sort_by', sortBy)
      .set('tags', tags);

    return this.http.get<any>(url, { params });
  }

  deletePost(postId: number, userId: number): Observable<any> {
    const url = `${environment.apiUrl}/post/${postId}`;
    const params = new HttpParams().set('userId', userId.toString());

    return this.http.delete<any>(url, { params });
  }

  toggleLike(postId: number, userId: number): Observable<any> {
    const url = `${environment.apiUrl}/likes/post/${postId}`;
    const params = new HttpParams().set('userId', userId.toString());

    return this.http.post<any>(url, null, { params });
  }

  addComment(postId: number, userId: number, comment: string): Observable<any> {
    const url = `${environment.apiUrl}/comment/posts/${postId}`;
    const body = { userId: userId, comment: comment };

    return this.http.post<any>(url, body, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  getComments(postId: number): Observable<any> {
    const url = `${environment.apiUrl}/comment/post/${postId}`;
    return this.http.get<any>(url);
  }

  deleteComment(
    postId: number,
    commentId: number,
    userId: number
  ): Observable<any> {
    const url = `${environment.apiUrl}/comment/${postId}/comments/${commentId}?userId=${userId}`;
    return this.http.delete(url);
  }

  updateComment(
    commentId: number,
    comment: string,
    userId: number
  ): Observable<any> {
    const url = `${environment.apiUrl}/comment/${commentId}`;
    const body = { comment, userId };
    return this.http.patch(url, body);
  }

  sharePost(userId: number, postId: number, comment: string): Observable<any> {
    const url = `${environment.apiUrl}/share`;  
    const body = { userId, postId, comment };

    return this.http.post<any>(url, body, {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
