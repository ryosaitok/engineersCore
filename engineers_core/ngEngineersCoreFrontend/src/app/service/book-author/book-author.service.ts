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
  host = 'http://127.0.0.1:8000/';
  bookAuthorsUrl = 'api/bookauthors/';
  bookAuthorsApiUrl = this.host + this.bookAuthorsUrl;

  getBookAuthors(bookId): Observable<any> {
    return this.http.get<any>(this.bookAuthorsApiUrl + '?book_id=' + bookId);
  }

  getBookAuthor(id): Observable<any> {
    return this.http.get<any>(this.bookAuthorsApiUrl + id + '/');
  }
}
