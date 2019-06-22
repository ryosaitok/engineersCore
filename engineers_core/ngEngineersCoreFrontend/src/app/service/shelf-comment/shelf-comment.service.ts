import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

import {User} from '../../dto/user/user';
import {ShelfComment} from '../../dto/shelf-comment/shelf-comment';

@Injectable({
  providedIn: 'root'
})
export class ShelfCommentService {

  host = 'http://127.0.0.1:8000/';
  shelfCommentUrl = 'api/shelf/comment/';
  shelfCommentAPIUrl = this.host + this.shelfCommentUrl;
  shelfCommentsUrl = 'api/shelf/comments/';
  shelfCommentsAPIUrl = this.host + this.shelfCommentsUrl;
  shelfIdShelfCommentsUrl = 'api/shelf/comments/?shelf_id=';
  shelfIdShelfCommentsAPIUrl = this.host + this.shelfIdShelfCommentsUrl;
  shelfCommentReportsUrl = 'api/shelf/comment/reports/';
  shelfCommentReportsAPIUrl = this.host + this.shelfCommentReportsUrl;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(
    private http: HttpClient,
  ) {
  }

  getShelfComment(commentId: number): Observable<any> {
    const url = this.shelfCommentAPIUrl + commentId + '/';
    return this.http.get<any>(url, this.httpOptions);
  }

  getShelfComments(): Observable<any> {
    const url = this.shelfCommentsAPIUrl;
    return this.http.get<any>(url, this.httpOptions);
  }

  getShelfCommentsByShelfId(shelfId: number): Observable<any> {
    const url = this.shelfIdShelfCommentsAPIUrl + shelfId;
    return this.http.get<any>(url, this.httpOptions);
  }

  getFilteredShelfComment(userId: number, shelfId: number): Observable<any> {
    const url = this.shelfCommentsAPIUrl + '?user_id=' + userId + '&shelf_id=' + shelfId;
    return this.http.get<any>(url, this.httpOptions);
  }

  registerShelfComment(userId: number, shelfId: number, comment: string, tweetFlag: boolean) {
    const body = {
      user: userId,
      shelf: shelfId,
      comment_text: comment,
      tweet_flag: tweetFlag,
    };
    return this.http.post<any>(this.shelfCommentsAPIUrl, body, this.httpOptions);
  }

  deleteShelfComment(commentId: number) {
    const url = this.shelfCommentAPIUrl + commentId + '/';
    return this.http.delete<any>(url, this.httpOptions);
  }

  reportComment(userId: number, shelfCommentId: number, reasonCode: string) {
    const url = this.shelfCommentReportsAPIUrl;
    const body = {
      user: userId,
      shelf_comment: shelfCommentId,
      reason_code: reasonCode
    };
    return this.http.post<any>(url, body, this.httpOptions);
  }

  convertShelfComments(shelfComments: any[]): ShelfComment[] {
    const convertedShelfComments = [];
    shelfComments.forEach(comment => {
      const user = comment.user;
      const userForComment = new User(user.id, user.user_name, user.account_name, user.description, user.profile_image_link);
      const shelfIdForComment = comment.shelf;
      const favoriteUserCount = Object.keys(comment.favorite_users).length;
      const replyUserCount = Object.keys(comment.reply_users).length;
      convertedShelfComments.push(
        new ShelfComment(comment.id, userForComment, shelfIdForComment, comment.comment_text, comment.comment_date,
          comment.tweet_flag, comment.favorite_users, favoriteUserCount, comment.reply_users, replyUserCount, comment.report_users)
      );
    });
    return convertedShelfComments;
  }

  convertShelfComment(shelfComment: any): ShelfComment {
    const user = shelfComment.user;
    const userForComment = new User(user.id, user.user_name, user.account_name, user.description, user.profile_image_link);
    const shelfIdForComment = shelfComment.shelf;
    const favoriteUserCount = Object.keys(shelfComment.favorite_users).length;
    const replyUserCount = Object.keys(shelfComment.reply_users).length;
    return new ShelfComment(shelfComment.id, userForComment, shelfIdForComment, shelfComment.comment_text, shelfComment.comment_date,
      shelfComment.tweet_flag, shelfComment.favorite_users, favoriteUserCount, shelfComment.reply_users, replyUserCount,
      shelfComment.report_users);
  }
}
