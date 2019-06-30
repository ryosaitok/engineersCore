import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {BookComment} from '../../dto/book-comment/book-comment';
import {HttpRequestService} from '../http-request/http-request.service';
import {BookService} from '../book/book.service';
import {UserService} from '../user/user.service';
import {SigninService} from '../signin/signin.service';

@Injectable({providedIn: 'root'})
export class BookCommentService {

  HOST = 'http://127.0.0.1:8000/';
  BOOK_COMMENT_API_URL = this.HOST + 'api/book/comment/';
  BOOK_COMMENTS_API_URL = this.HOST + 'api/book/comments/';
  BOOK_ID_BOOK_COMMENTS_API_URL = this.HOST + 'api/book/comments/?book_id=';
  ACCOUNT_NAME_BOOK_COMMENTS_API_URL = this.HOST + 'api/book/comments/?account_name=';
  TITLE_BOOK_COMMENTS_API_URL = this.HOST + 'api/book/comments/?title=';
  AUTHOR_BOOK_COMMENTS_API_URL = this.HOST + 'api/book/comments/?author=';
  USER_BOOK_COMMENTS_API_URL = this.HOST + 'api/book/comments/?user=';
  BOOK_COMMENT_REPORTS_API_URL = this.HOST + 'api/book/comment/reports/';
  HTTP_OPTIONS = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(
    private http: HttpClient,
    private httpRequestService: HttpRequestService,
    private signinService: SigninService,
    private bookService: BookService,
    private userService: UserService,
  ) {
  }

  getBookComment(commentId: number): Observable<any> {
    return this.http.get<any>(this.BOOK_COMMENT_API_URL + commentId + '/');
  }

  getBookComments(): Observable<any> {
    return this.http.get<any>(this.BOOK_COMMENTS_API_URL);
  }

  getBookCommentPaging(sort: string, page: string): Observable<any> {
    let url = this.BOOK_COMMENTS_API_URL;
    url = this.httpRequestService.addUrlConditions(url, sort, page);
    return this.http.get<any>(url);
  }

  getBookCommentsByBookId(bookId: number): Observable<any> {
    return this.http.get<any>(this.BOOK_ID_BOOK_COMMENTS_API_URL + bookId);
  }

  getBookCommentsByAccountName(userId: string): Observable<any> {
    return this.http.get<any>(this.ACCOUNT_NAME_BOOK_COMMENTS_API_URL + userId);
  }

  /**
   * 本のタイトルでLIKE検索し、ユーザー/本のデータを持ったコメント一覧を取得する。
   * @param title 本のタイトル
   */
  getBookCommentsByTitle(title: string): Observable<any> {
    return this.http.get<any>(this.TITLE_BOOK_COMMENTS_API_URL + title, this.HTTP_OPTIONS);
  }

  /**
   * 本の著者名でLIKE検索し、ユーザー/本のデータを持ったコメント一覧を取得する。
   * @param authorName 本の著者名
   */
  getBookCommentsByAuthorName(authorName: string): Observable<any> {
    return this.http.get<any>(this.AUTHOR_BOOK_COMMENTS_API_URL + authorName, this.HTTP_OPTIONS);
  }

  /**
   * ユーザー名orユーザーアカウント名でLIKE検索し、ユーザー/本のデータを持ったコメント一覧を取得する。
   * @param user ユーザー検索語
   */
  getBookCommentsByUser(user: string): Observable<any> {
    return this.http.get<any>(this.USER_BOOK_COMMENTS_API_URL + user, this.HTTP_OPTIONS);
  }

  registerBookComment(userId: number, bookId: number, comment: string, readDate: Date) {
    const body = {user: userId, book: bookId, comment_text: comment, read_date: readDate};
    return this.http.post<any>(this.BOOK_COMMENTS_API_URL, body, this.HTTP_OPTIONS);
  }

  deleteComment(commentId: number): Observable<any> {
    const url = this.BOOK_COMMENT_API_URL + commentId + '/';
    const jwtHeader = this.signinService.createJwtHeaderFromLocalStorage();
    return this.http.delete<any>(url, {headers: jwtHeader});
  }

  reportComment(userId: number, bookCommentId: number, reasonCode: string) {
    const url = this.BOOK_COMMENT_REPORTS_API_URL;
    const body = {user: userId, book_comment: bookCommentId, reason_code: reasonCode};
    return this.http.post<any>(url, body, this.HTTP_OPTIONS);
  }

  convertBookComment(bookComment: any): BookComment {
    const userForComment = this.userService.convertUser(bookComment.user);
    const bookForComment = this.bookService.convertBook(bookComment.book);
    const favoriteUsers = bookComment.favorite_users;
    const favoriteUserCount = Object.keys(favoriteUsers).length;
    const replyUsers = bookComment.reply_users;
    const replyUserCount = Object.keys(replyUsers).length;
    return new BookComment(bookComment.id, userForComment, bookForComment, bookComment.comment_text,
      bookComment.comment_date, bookComment.tweet_flag, favoriteUsers, favoriteUserCount, replyUsers, replyUserCount,
      bookComment.report_users);
  }

  convertBookComments(bookComments: any[]): BookComment[] {
    const convertedBookComments = [];
    bookComments.forEach(comment => {
      const bookComment = this.convertBookComment(comment);
      convertedBookComments.push(bookComment);
    });
    return convertedBookComments;
  }
}
