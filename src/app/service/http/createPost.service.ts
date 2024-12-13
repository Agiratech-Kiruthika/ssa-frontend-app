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
}
