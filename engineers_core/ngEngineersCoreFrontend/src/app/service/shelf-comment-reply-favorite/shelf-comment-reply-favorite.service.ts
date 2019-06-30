import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

import {SigninService} from '../signin/signin.service';

@Injectable({
  providedIn: 'root'
})
export class ShelfCommentReplyFavoriteService {

  HOST = 'http://127.0.0.1:8000/';
  SHELF_COMMENT_REPLY_FAVORITE_API_URL = this.HOST + 'api/shelf/comment/reply/favorite/';
  SHELF_COMMENT_REPLY_FAVORITES_API_URL = this.HOST + 'api/shelf/comment/reply/favorites/';
  ACCOUNT_NAME_SHELF_COMMENT_REPLY_FAVORITES_API_URL = this.HOST + 'api/shelf/comment/reply/favorites/?account_name=';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(
    private http: HttpClient,
    private signinService: SigninService,
  ) { }

  getReplyFavorite(userId: number, shelfCommentReplyId: number): Observable<any> {
    const url = this.SHELF_COMMENT_REPLY_FAVORITES_API_URL + '?user_id=' + userId + '&comment_reply_id=' + shelfCommentReplyId;
    console.log('getReplyFavorite。url: ' + url);
    return this.http.get<any>(url, this.httpOptions);
  }

  getUserReplyFavorites(userId: number): Observable<any> {
    const url = this.SHELF_COMMENT_REPLY_FAVORITES_API_URL + '?user_id=' + userId;
    return this.http.get<any>(url, this.httpOptions);
  }

  getReplyFavoritesByAccountName(accountName: string): Observable<any> {
    const url = this.ACCOUNT_NAME_SHELF_COMMENT_REPLY_FAVORITES_API_URL + accountName;
    return this.http.get<any>(url, this.httpOptions);
  }

  registerReplyFavorite(userId: number, shelfCommentReplyId: number): Observable<any> {
    const body = {user: userId, shelf_comment_reply: shelfCommentReplyId};
    console.log('userId: ' + userId + ' shelfCommentReplyId: ' + shelfCommentReplyId);
    return this.http.post<any>(this.SHELF_COMMENT_REPLY_FAVORITES_API_URL, body, this.httpOptions);
  }

  deleteReplyFavorite(replyFavoriteId: number): Observable<any> {
    const url = this.SHELF_COMMENT_REPLY_FAVORITE_API_URL + replyFavoriteId + '/';
    const jwtHeader = this.signinService.createJwtHeaderFromLocalStorage();
    return this.http.delete<any>(url, {headers: jwtHeader});
  }
}
