import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

import {User} from '../../dto/user/user';
import {BookCommentReply} from '../../dto/book-comment/book-comment-reply';
import {HttpRequestService} from '../http-request/http-request.service';
import {SigninService} from '../signin/signin.service';

@Injectable({
  providedIn: 'root'
})
export class BookCommentReplyService {


  HOST = 'http://127.0.0.1:8000/';
  BOOK_COMMENT_REPLY_API_URL = this.HOST + 'api/book/comment/reply/';
  BOOK_COMMENT_REPLIES_API_URL = this.HOST + 'api/book/comment/replies/';
  ACCOUNT_NAME_BOOK_COMMENT_REPLIES_API_URL = this.HOST + 'api/book/comment/replies/?account_name=';
  BOOK_COMMENT_REPLY_REPORTS_API_URL = this.HOST + 'api/book/comment/reply/reports/';
  httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(
    private http: HttpClient,
    private httpRequestService: HttpRequestService,
    private signinService: SigninService,
  ) {
  }

  getCommentReply(bookCommentReplyId: number): Observable<any> {
    const url = this.BOOK_COMMENT_REPLY_API_URL + bookCommentReplyId + '/';
    return this.http.get<any>(url, {headers: this.httpHeaders});
  }

  getUserCommentReplies(userId: number): Observable<any> {
    const url = this.BOOK_COMMENT_REPLIES_API_URL + '?user_id=' + userId;
    return this.http.get<any>(url, {headers: this.httpHeaders});
  }

  getCommentRepliesByAccountName(accountName: string): Observable<any> {
    const url = this.ACCOUNT_NAME_BOOK_COMMENT_REPLIES_API_URL + accountName;
    return this.http.get<any>(url, {headers: this.httpHeaders});
  }

  getCommentRepliesPagingByCommentId(bookCommentId: number, page: number): Observable<any> {
    const url = this.BOOK_COMMENT_REPLIES_API_URL + '?comment_id=' + bookCommentId;
    this.httpRequestService.appendUrlConditions(url, null, page.toString());
    return this.http.get<any>(url, {headers: this.httpHeaders});
  }

  registerCommentReply(userId: number, bookCommentId: number, commentText: string, tweetFlag: boolean): Observable<any> {
    const body = {user: userId, comment: bookCommentId, comment_text: commentText, tweet_flag: tweetFlag,};
    return this.http.post<any>(this.BOOK_COMMENT_REPLIES_API_URL, body, {headers: this.httpHeaders});
  }

  deleteCommentReply(bookCommentReplyId: number): Observable<any> {
    const url = this.BOOK_COMMENT_REPLY_API_URL + bookCommentReplyId + '/';
    const httpHeaders = this.signinService.appendJwtHeader(this.httpHeaders);
    return this.http.delete<any>(url, {headers: httpHeaders});
  }

  reportReply(userId: number, bookCommentReplyId: number, reasonCode: string) {
    const url = this.BOOK_COMMENT_REPLY_REPORTS_API_URL;
    const body = {user: userId, book_comment_reply: bookCommentReplyId, reason_code: reasonCode};
    return this.http.post<any>(url, body, {headers: this.httpHeaders});
  }

  convertBookCommentReply(bookCommentReply: any): BookCommentReply {
    const user = bookCommentReply.user;
    const userForReply = new User(user.id, user.user_name, user.account_name, user.description, user.profile_image_link);
    const bookCommentForReply = bookCommentReply.book_comment;
    const favoriteUserCount = Object.keys(bookCommentReply.favorite_users).length;
    return new BookCommentReply(bookCommentReply.id, userForReply, bookCommentForReply, bookCommentReply.comment_text,
      bookCommentReply.comment_date, bookCommentReply.tweet_flag, bookCommentReply.favorite_users, favoriteUserCount,
      bookCommentReply.report_users);
  }

  convertBookCommentReplies(bookCommentReplies: BookCommentReply[]): BookCommentReply[] {
    const convertedBookCommentReplies = [];
    bookCommentReplies.forEach(reply => {
      convertedBookCommentReplies.push(
        this.convertBookCommentReply(reply)
      );
    });
    return convertedBookCommentReplies;
  }
}
