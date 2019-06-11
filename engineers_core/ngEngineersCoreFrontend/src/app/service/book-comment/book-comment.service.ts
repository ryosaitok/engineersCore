import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {BookComment} from '../../dto/book-comment/book-comment';
import {HttpRequestService} from '../http-request/http-request.service';
import {BookService} from '../book/book.service';
import {UserService} from '../user/user.service';

@Injectable({providedIn: 'root'})
export class BookCommentService {

  host = 'http://127.0.0.1:8000/';
  bookCommentUrl = 'api/bookcomment/';
  bookCommentAPIUrl = this.host + this.bookCommentUrl;
  filteredBookCommentsUrl = 'api/bookcomments/?book_id=';
  filteredBookCommentsAPIUrl = this.host + this.filteredBookCommentsUrl;
  accountNameFilteredBookCommentsUrl = 'api/bookcomments/?account_name=';
  accountNameFilteredBookCommentsAPIUrl = this.host + this.accountNameFilteredBookCommentsUrl;
  filteredBookCommentsByTitleUrl = 'api/bookcomments/?title=';
  filteredBookCommentsByTitleAPIUrl = this.host + this.filteredBookCommentsByTitleUrl;
  filteredBookCommentsByAuthorUrl = 'api/bookcomments/?author=';
  filteredBookCommentsByAuthorAPIUrl = this.host + this.filteredBookCommentsByAuthorUrl;
  filteredBookCommentsByUserUrl = 'api/bookcomments/?user=';
  filteredBookCommentsByUserAPIUrl = this.host + this.filteredBookCommentsByUserUrl;
  bookCommentsUrl = 'api/bookcomments/';
  bookCommentsAPIUrl = this.host + this.bookCommentsUrl;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(
    private http: HttpClient,
    private httpRequestService: HttpRequestService,
    private bookService: BookService,
    private userService: UserService,
  ) {
  }

  getBookComment(commentId: number): Observable<any> {
    return this.http.get<any>(this.bookCommentAPIUrl + commentId + '/');
  }

  getBookComments(): Observable<any> {
    return this.http.get<any>(this.bookCommentsAPIUrl);
  }

  getBookCommentPaging(sort: string, page: string): Observable<any> {
    let url = this.bookCommentsAPIUrl;
    url = this.httpRequestService.addUrlConditions(url, sort, page);
    return this.http.get<any>(url);
  }

  getBookCommentsByBookId(bookId: number): Observable<any> {
    return this.http.get<any>(this.filteredBookCommentsAPIUrl + bookId);
  }

  getBookCommentsByAccountName(userId: string): Observable<any> {
    return this.http.get<any>(this.accountNameFilteredBookCommentsAPIUrl + userId);
  }

  /**
   * 本のタイトルでLIKE検索し、ユーザー/本のデータを持ったコメント一覧を取得する。
   * @param title 本のタイトル
   */
  getBookCommentsByTitle(title: string): Observable<any> {
    return this.http.get<any>(this.filteredBookCommentsByTitleAPIUrl + title, this.httpOptions);
  }

  /**
   * 本の著者名でLIKE検索し、ユーザー/本のデータを持ったコメント一覧を取得する。
   * @param authorName 本の著者名
   */
  getBookCommentsByAuthorName(authorName: string): Observable<any> {
    return this.http.get<any>(this.filteredBookCommentsByAuthorAPIUrl + authorName, this.httpOptions);
  }

  /**
   * ユーザー名orユーザーアカウント名でLIKE検索し、ユーザー/本のデータを持ったコメント一覧を取得する。
   * @param user ユーザー検索語
   */
  getBookCommentsByUser(user: string): Observable<any> {
    return this.http.get<any>(this.filteredBookCommentsByUserAPIUrl + user, this.httpOptions);
  }

  registerBookComment(userId: number, bookId: number, comment: string, readDate: Date) {
    const body = {
      user: userId,
      book: bookId,
      comment_text: comment,
      read_date: readDate,
    };
    return this.http.post<any>(this.bookCommentsAPIUrl, body, this.httpOptions);
  }

  convertBookComment(bookComment: any): BookComment {
    const userForComment = this.userService.convertUser(bookComment.user);
    const bookForComment = this.bookService.convertBook(bookComment.book);
    const favoriteUsers = bookComment.favorite_users;
    const favoriteUserCount = Object.keys(favoriteUsers).length;
    const replyUsers = bookComment.reply_users;
    const replyUserCount = Object.keys(replyUsers).length;
    return new BookComment(bookComment.id, userForComment, bookForComment, bookComment.comment_text,
      bookComment.comment_date, bookComment.tweet_flag, favoriteUsers, favoriteUserCount, replyUsers, replyUserCount);
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
