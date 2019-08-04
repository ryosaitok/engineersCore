import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookAuthorService {

  constructor(
    private http: HttpClient,
  ) {}

  HOST = 'http://127.0.0.1:8000/';
  BOOK_AUTHORS_API_URL = this.HOST + 'api/book/authors/';

  getBookAuthors(bookId): Observable<any> {
    return this.http.get<any>(this.BOOK_AUTHORS_API_URL + '?book_id=' + bookId);
  }

  getBookAuthor(id): Observable<any> {
    return this.http.get<any>(this.BOOK_AUTHORS_API_URL + id + '/');
  }
}
