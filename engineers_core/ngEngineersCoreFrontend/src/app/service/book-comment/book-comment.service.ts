import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class BookCommentService {

  constructor(
    private http: HttpClient,
  ) {}
  host = 'http://127.0.0.1:8000/';
  bookCommentUrl = 'api/bookcomment/';
  bookCommentAPIUrl = this.host + this.bookCommentUrl;
  bookCommentsUrl = 'api/bookcomments/?book_id=';
  bookCommentsAPIUrl = this.host + this.bookCommentsUrl;

  getBookComment(bookId: string): Observable<any> {
    return this.http.get<any>(this.bookCommentAPIUrl + bookId + '/');
  }

  getBookComments(bookId: string): Observable<any> {
    return this.http.get<any>(this.bookCommentsAPIUrl + bookId);
  }
}
