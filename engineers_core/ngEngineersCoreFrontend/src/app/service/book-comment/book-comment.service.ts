import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {SigninService} from '../signin/signin.service';

@Injectable({providedIn: 'root'})
export class BookCommentService {

  host = 'http://127.0.0.1:8000/';
  bookCommentUrl = 'api/bookcomment/';
  bookCommentAPIUrl = this.host + this.bookCommentUrl;
  filteredBookCommentsUrl = 'api/bookcomments/?book_id=';
  filteredBookCommentsAPIUrl = this.host + this.filteredBookCommentsUrl;
  filteredBookCommentsByTitleUrl = 'api/bookcomments/?title=';
  filteredBookCommentsByTitleAPIUrl = this.host + this.filteredBookCommentsByTitleUrl;
  bookCommentsUrl = 'api/bookcomments/';
  bookCommentsAPIUrl = this.host + this.bookCommentsUrl;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(
    private http: HttpClient,
  ) {}

  getBookComment(bookId: string): Observable<any> {
    return this.http.get<any>(this.bookCommentAPIUrl + bookId + '/');
  }

  getBookComments(bookId: string): Observable<any> {
    return this.http.get<any>(this.filteredBookCommentsAPIUrl + bookId);
  }

 /**
　 * 本のタイトルでLIKE検索し、ユーザー/本のデータを持ったコメント一覧を取得する。
　 * @param title 本のタイトル
 　*/
  getBookCommentsByTitle(title: string): Observable<any> {
    return this.http.get<any>(this.filteredBookCommentsByTitleAPIUrl + title, this.httpOptions);
  }

  registerBookComment(userId: number, bookId: number, comment: string) {
    const body = {
      user: userId,
      book: bookId,
      comment_text: comment,
      delete_flag: false,
    };
    return this.http.post<any>(this.bookCommentsAPIUrl, body, this.httpOptions);
  }
}
