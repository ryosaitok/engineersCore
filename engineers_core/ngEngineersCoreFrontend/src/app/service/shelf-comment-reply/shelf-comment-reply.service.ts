import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

import {SigninService} from '../signin/signin.service';
import {HttpRequestService} from '../http-request/http-request.service';
import {User} from '../../dto/user/user';
import {ShelfCommentReply} from '../../dto/shelf-comment/shelf-comment-reply';

@Injectable({
  providedIn: 'root'
})
export class ShelfCommentReplyService {

  HOST = 'http://127.0.0.1:8000/';
  SHELF_COMMENT_REPLY_API_URL = this.HOST + 'api/shelf/comment/reply/';
  SHELF_COMMENT_REPLIES_API_URL = this.HOST + 'api/shelf/comment/replies/';
  ACCOUNT_NAME_SHELF_COMMENT_REPLIES_API_URL = this.HOST + 'api/shelf/comment/replies/?account_name=';
  SHELF_COMMENT_REPLY_REPORTS_API_URL = this.HOST + 'api/shelf/comment/reply/reports/';
  httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(
    private http: HttpClient,
    private httpRequestService: HttpRequestService,
    private signinService: SigninService,
  ) {
  }

  getCommentReply(commentReplyId: number): Observable<any> {
    const url = this.SHELF_COMMENT_REPLY_API_URL + commentReplyId + '/';
    return this.http.get<any>(url, {headers: this.httpHeaders});
  }

  getUserCommentReplies(userId: number): Observable<any> {
    const url = this.SHELF_COMMENT_REPLIES_API_URL + '?user_id=' + userId;
    return this.http.get<any>(url, {headers: this.httpHeaders});
  }

  getCommentRepliesByAccountName(accountName: string): Observable<any> {
    const url = this.ACCOUNT_NAME_SHELF_COMMENT_REPLIES_API_URL + accountName;
    return this.http.get<any>(url, {headers: this.httpHeaders});
  }

  getCommentRepliesPagingByCommentId(shelfCommentId: number, page: number): Observable<any> {
    const url = this.SHELF_COMMENT_REPLIES_API_URL + '?comment_id=' + shelfCommentId;
    this.httpRequestService.appendUrlConditions(url, null, page.toString());
    return this.http.get<any>(url, {headers: this.httpHeaders});
  }

  registerCommentReply(userId: number, shelfCommentId: number, commentText: string, tweetFlag: boolean): Observable<any> {
    const body = {user: userId, comment: shelfCommentId, comment_text: commentText, tweet_flag: tweetFlag,};
    return this.http.post<any>(this.SHELF_COMMENT_REPLIES_API_URL, body, {headers: this.httpHeaders});
  }

  deleteCommentReply(commentReplyId: number): Observable<any> {
    const url = this.SHELF_COMMENT_REPLY_API_URL + commentReplyId + '/';
    const httpHeaders = this.signinService.appendJwtHeader(this.httpHeaders);
    return this.http.delete<any>(url, {headers: httpHeaders});
  }

  reportReply(userId: number, shelfCommentReplyId: number, reasonCode: string) {
    const url = this.SHELF_COMMENT_REPLY_REPORTS_API_URL;
    const body = {user: userId, shelf_comment_reply: shelfCommentReplyId, reason_code: reasonCode};
    return this.http.post<any>(url, body, {headers: this.httpHeaders});
  }

  convertShelfCommentReply(shelfCommentReply: any): ShelfCommentReply {
    const user = shelfCommentReply.user;
    const userForReply = new User(user.id, user.user_name, user.account_name, user.description, user.profile_image_link);
    const shelfCommentForReply = shelfCommentReply.shelf_comment;
    const favoriteUserCount = Object.keys(shelfCommentReply.favorite_users).length;
    return new ShelfCommentReply(shelfCommentReply.id, userForReply, shelfCommentForReply, shelfCommentReply.comment_text,
      shelfCommentReply.comment_date, shelfCommentReply.tweet_flag, shelfCommentReply.favorite_users, favoriteUserCount,
      shelfCommentReply.report_users);
  }

  convertShelfCommentReplies(shelfCommentReplies: ShelfCommentReply[]): ShelfCommentReply[] {
    const convertedShelfCommentReplies = [];
    shelfCommentReplies.forEach(reply => {
      convertedShelfCommentReplies.push(
        this.convertShelfCommentReply(reply)
      );
    });
    return convertedShelfCommentReplies;
  }
}
