import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

import {User} from '../../dto/user/user';
import {ShelfComment} from '../../dto/shelf-comment/shelf-comment';
import {SigninService} from '../signin/signin.service';

@Injectable({
  providedIn: 'root'
})
export class ShelfCommentService {

  HOST = 'http://127.0.0.1:8000/';
  SHELF_COMMENT_API_URL = this.HOST + 'api/shelf/comment/';
  SHELF_COMMENTS_API_URL = this.HOST + 'api/shelf/comments/';
  SHELF_ID_SHELF_COMMENTS_API_URL = this.HOST + 'api/shelf/comments/?shelf_id=';
  SHELF_COMMENT_REPORTS_API_URL = this.HOST + 'api/shelf/comment/reports/';
  httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(
    private http: HttpClient,
    private signinService: SigninService,
  ) {
  }

  getShelfComment(commentId: number): Observable<any> {
    const url = this.SHELF_COMMENT_API_URL + commentId + '/';
    return this.http.get<any>(url, {headers: this.httpHeaders});
  }

  getShelfComments(): Observable<any> {
    const url = this.SHELF_COMMENTS_API_URL;
    return this.http.get<any>(url, {headers: this.httpHeaders});
  }

  getShelfCommentsByShelfId(shelfId: number): Observable<any> {
    const url = this.SHELF_ID_SHELF_COMMENTS_API_URL + shelfId;
    return this.http.get<any>(url, {headers: this.httpHeaders});
  }

  getFilteredShelfComment(userId: number, shelfId: number): Observable<any> {
    const url = this.SHELF_COMMENTS_API_URL + '?user_id=' + userId + '&shelf_id=' + shelfId;
    return this.http.get<any>(url, {headers: this.httpHeaders});
  }

  registerShelfComment(userId: number, shelfId: number, comment: string, tweetFlag: boolean) {
    const body = {
      user: userId,
      shelf: shelfId,
      comment_text: comment,
      tweet_flag: tweetFlag,
    };
    const httpHeaders = this.signinService.appendJwtHeader(this.httpHeaders);
    return this.http.post<any>(this.SHELF_COMMENTS_API_URL, body, {headers: httpHeaders});
  }

  deleteShelfComment(commentId: number) {
    const url = this.SHELF_COMMENT_API_URL + commentId + '/';
    return this.http.delete<any>(url, {headers: this.httpHeaders});
  }

  reportComment(userId: number, shelfCommentId: number, reasonCode: string) {
    const url = this.SHELF_COMMENT_REPORTS_API_URL;
    const body = {
      user: userId,
      shelf_comment: shelfCommentId,
      reason_code: reasonCode
    };
    return this.http.post<any>(url, body, {headers: this.httpHeaders});
  }

  convertShelfComment(shelfComment: any): ShelfComment {
    const user = shelfComment.user;
    const userForComment = new User(user.id, user.user_name, user.account_name, user.description, user.profile_image_link);
    const shelfIdForComment = shelfComment.shelf;
    const favoriteUserCount = Object.keys(shelfComment.favorite_users).length;
    const replyUserCount = Object.keys(shelfComment.reply_users).length;
    return new ShelfComment(shelfComment.id, userForComment, shelfIdForComment, shelfComment.comment_text, shelfComment.comment_date,
      shelfComment.tweet_flag, shelfComment.favorite_users, favoriteUserCount, shelfComment.reply_users, replyUserCount,
      shelfComment.report_users, [], false);
  }

  convertShelfComments(shelfComments: any[]): ShelfComment[] {
    const convertedShelfComments = [];
    shelfComments.forEach(comment => {
      convertedShelfComments.push(this.convertShelfComment(comment));
    });
    return convertedShelfComments;
  }
}
