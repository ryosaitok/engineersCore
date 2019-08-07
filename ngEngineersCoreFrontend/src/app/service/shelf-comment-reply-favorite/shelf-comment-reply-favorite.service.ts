import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

import {SigninService} from '../signin/signin.service';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShelfCommentReplyFavoriteService {

  HOST = environment.apiUrl;
  SHELF_COMMENT_REPLY_FAVORITE_API_URL = this.HOST + 'api/shelf/comment/reply/favorite/';
  SHELF_COMMENT_REPLY_FAVORITES_API_URL = this.HOST + 'api/shelf/comment/reply/favorites/';
  ACCOUNT_NAME_SHELF_COMMENT_REPLY_FAVORITES_API_URL = this.HOST + 'api/shelf/comment/reply/favorites/?account_name=';
  httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(
    private http: HttpClient,
    private signinService: SigninService,
  ) {
  }

  getReplyFavorite(userId: number, shelfCommentReplyId: number): Observable<any> {
    const url = this.SHELF_COMMENT_REPLY_FAVORITES_API_URL + '?user_id=' + userId + '&comment_reply_id=' + shelfCommentReplyId;
    return this.http.get<any>(url, {headers: this.httpHeaders});
  }

  getUserReplyFavorites(userId: number): Observable<any> {
    const url = this.SHELF_COMMENT_REPLY_FAVORITES_API_URL + '?user_id=' + userId;
    return this.http.get<any>(url, {headers: this.httpHeaders});
  }

  getReplyFavoritesByAccountName(accountName: string): Observable<any> {
    const url = this.ACCOUNT_NAME_SHELF_COMMENT_REPLY_FAVORITES_API_URL + accountName;
    return this.http.get<any>(url, {headers: this.httpHeaders});
  }

  registerReplyFavorite(userId: number, shelfCommentReplyId: number): Observable<any> {
    const body = {user: userId, shelf_comment_reply: shelfCommentReplyId};
    const httpHeaders = this.signinService.appendJwtHeader(this.httpHeaders);
    return this.http.post<any>(this.SHELF_COMMENT_REPLY_FAVORITES_API_URL, body, {headers: httpHeaders});
  }

  deleteReplyFavorite(replyFavoriteId: number): Observable<any> {
    const url = this.SHELF_COMMENT_REPLY_FAVORITE_API_URL + replyFavoriteId + '/';
    const httpHeaders = this.signinService.appendJwtHeader(this.httpHeaders);
    return this.http.delete<any>(url, {headers: httpHeaders});
  }
}
