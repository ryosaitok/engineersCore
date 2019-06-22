import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

import {SigninService} from '../signin/signin.service';
import {HttpRequestService} from '../http-request/http-request.service';
import {ShelfComment} from '../../dto/shelf-comment/shelf-comment';
import {User} from '../../dto/user/user';
import {ShelfCommentReply} from '../../dto/shelf-comment/shelf-comment-reply';

@Injectable({
  providedIn: 'root'
})
export class ShelfCommentReplyService {

  host = 'http://127.0.0.1:8000/';
  shelfCommentReplyUrl = 'api/shelf/comment/reply/';
  shelfCommentReplyAPIUrl = this.host + this.shelfCommentReplyUrl;
  shelfCommentRepliesUrl = 'api/shelf/comment/replies/';
  shelfCommentRepliesAPIUrl = this.host + this.shelfCommentRepliesUrl;
  accountNameShelfCommentRepliesUrl = 'api/shelf/comment/replies/?account_name=';
  accountNameShelfCommentRepliesAPIUrl = this.host + this.accountNameShelfCommentRepliesUrl;
  shelfCommentReplyReportsUrl = 'api/shelf/comment/reply/reports/';
  shelfCommentReplyReportsAPIUrl = this.host + this.shelfCommentReplyReportsUrl;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(
    private http: HttpClient,
    private httpRequestService: HttpRequestService,
    private signinService: SigninService,
  ) {
  }

  getCommentReply(commentReplyId: number): Observable<any> {
    const url = this.shelfCommentReplyAPIUrl + commentReplyId + '/';
    return this.http.get<any>(url, this.httpOptions);
  }

  getUserCommentReplies(userId: number): Observable<any> {
    const url = this.shelfCommentRepliesAPIUrl + '?user_id=' + userId;
    return this.http.get<any>(url, this.httpOptions);
  }

  getCommentRepliesByAccountName(accountName: string): Observable<any> {
    const url = this.accountNameShelfCommentRepliesAPIUrl + accountName;
    return this.http.get<any>(url, this.httpOptions);
  }

  getCommentRepliesPagingByCommentId(shelfCommentId: number, page: number): Observable<any> {
    const url = this.shelfCommentRepliesAPIUrl + '?comment_id=' + shelfCommentId;
    this.httpRequestService.appendUrlConditions(url, null, page.toString());
    return this.http.get<any>(url, this.httpOptions);
  }

  registerCommentReply(userId: number, shelfCommentId: number, commentText: string, tweetFlag: boolean): Observable<any> {
    const body = {
      user: userId,
      comment: shelfCommentId,
      comment_text: commentText,
      tweet_flag: tweetFlag,
    };
    return this.http.post<any>(this.shelfCommentRepliesAPIUrl, body, this.httpOptions);
  }

  deleteCommentReply(commentReplyId: number): Observable<any> {
    const url = this.shelfCommentReplyAPIUrl + commentReplyId + '/';
    const jwtHeader = this.signinService.createJwtHeaderFromLocalStorage();
    return this.http.delete<any>(url, {headers: jwtHeader});
  }

  reportReply(userId: number, shelfCommentReplyId: number, reasonCode: string) {
    const url = this.shelfCommentReplyReportsAPIUrl;
    const body = {
      user: userId,
      shelf_comment_reply: shelfCommentReplyId,
      reason_code: reasonCode
    };
    return this.http.post<any>(url, body, this.httpOptions);
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
