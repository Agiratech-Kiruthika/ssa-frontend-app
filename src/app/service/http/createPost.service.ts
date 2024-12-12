import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

    return this.http.post(url, formData);
  }

  getPost(postId: number): Observable<any> {
    const url = `${environment.apiUrl}/post/get/${postId}`;
    return this.http.get(url);
  }
}
