import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class BookService {

  constructor(
    private http: HttpClient,
  ) {}
  host = 'http://127.0.0.1:8000/';
  booksUrl = 'api/books/';
  titleBooksUrl = 'api/books/?title=';
  authorNameBooksUrl = 'api/books/?author_name=';
  bookUrl = 'api/book/';

  getBooks(): Observable<any> {
    return this.http.get<any>(this.host + this.booksUrl);
  }

  getBooksLikeTitle(title): Observable<any> {
    return this.http.get<any>(this.host + this.titleBooksUrl + title);
  }

  getBooksLikeAuthorName(authorName): Observable<any> {
    return this.http.get<any>(this.host + this.authorNameBooksUrl + authorName);
  }

  getBook(id): Observable<any> {
    return this.http.get<any>(this.host + this.bookUrl + id + '/');
  }
}
