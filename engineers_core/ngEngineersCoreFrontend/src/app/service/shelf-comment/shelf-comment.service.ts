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
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(
    private http: HttpClient,
  ) {
  }

  getShelfComment(shelfId: number): Observable<any> {
    const url = this.shelfCommentAPIUrl + shelfId + '/';
    return this.http.get<any>(url, this.httpOptions);
  }

  getShelfComments(): Observable<any> {
    const url = this.shelfCommentsAPIUrl;
    return this.http.get<any>(url, this.httpOptions);
  }

  convertShelfComments(shelfComments: any[]): ShelfComment[] {
    const convertedShelfComments = [];
    shelfComments.forEach(comment => {
      const user = comment.user;
      const userForComment = new User(user.id, user.user_name, user.account_name, user.description, user.profile_image_link);
      const shelfIdForComment = comment.shelf;
      const favoriteUserCount = Object.keys(comment.favorite_users).length;
      convertedShelfComments.push(
        new ShelfComment(comment.id, userForComment, shelfIdForComment, comment.comment_text, comment.comment_date,
          comment.tweet_flag, comment.favorite_users, favoriteUserCount)
      );
    });
    return convertedShelfComments;
  }

  getShelfCommentsByShelfId(shelfId: number): Observable<any> {
    const url = this.shelfIdShelfCommentsAPIUrl + shelfId;
    return this.http.get<any>(url, this.httpOptions);
  }
}
