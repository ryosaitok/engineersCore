import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {HttpRequestService} from '../http-request/http-request.service';

@Injectable({providedIn: 'root'})
export class BookService {

  constructor(
    private http: HttpClient,
    private httpRequestService: HttpRequestService
  ) {
  }

  host = 'http://127.0.0.1:8000/';
  booksUrl = 'api/books/';
  titleBooksUrl = 'api/books/?title=';
  authorNameBooksUrl = 'api/books/?author=';
  bookUrl = 'api/book/';

  getBooks(): Observable<any> {
    return this.http.get<any>(this.host + this.booksUrl);
  }

  getBooksLikeTitle(title, sort, page): Observable<any> {
    let url = this.host + this.titleBooksUrl + title;
    url = this.httpRequestService.appendUrlConditions(url, sort, page);
    return this.http.get<any>(url);
  }

  getBooksLikeAuthorName(authorName, sort, page): Observable<any> {
    let url = this.host + this.authorNameBooksUrl + authorName;
    url = this.httpRequestService.appendUrlConditions(url, sort, page);
    return this.http.get<any>(url);
  }

  getBook(id): Observable<any> {
    return this.http.get<any>(this.host + this.bookUrl + id + '/');
  }
}
