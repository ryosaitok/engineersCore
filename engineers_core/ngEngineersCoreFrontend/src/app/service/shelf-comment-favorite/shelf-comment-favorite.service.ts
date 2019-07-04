import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

import {SigninService} from '../signin/signin.service';

@Injectable({
  providedIn: 'root'
})
export class ShelfCommentFavoriteService {

  HOST = 'http://127.0.0.1:8000/';
  SHELF_COMMENT_FAVORITE_API_URL = this.HOST + 'api/shelf/comment/favorite/';
  SHELF_COMMENT_FAVORITES_API_URL = this.HOST + 'api/shelf/comment/favorites/';
  ACCOUNT_NAME_SHELF_COMMENT_FAVORITES_API_URL = this.HOST + 'api/shelf/comment/favorites/?account_name=';
  httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(
    private http: HttpClient,
    private signinService: SigninService,
  ) {
  }

  getCommentFavorite(userId: number, commentId: number): Observable<any> {
    const url = this.SHELF_COMMENT_FAVORITES_API_URL + '?user_id=' + userId + '&comment_id=' + commentId;
    console.log('getCommentFavorite。url: ' + url);
    return this.http.get<any>(url, {headers: this.httpHeaders});
  }

  getUserCommentFavorites(userId: number): Observable<any> {
    const url = this.SHELF_COMMENT_FAVORITES_API_URL + '?user_id=' + userId;
    return this.http.get<any>(url, {headers: this.httpHeaders});
  }

  getCommentFavoritesByAccountName(accountName: string): Observable<any> {
    const url = this.ACCOUNT_NAME_SHELF_COMMENT_FAVORITES_API_URL + accountName;
    return this.http.get<any>(url, {headers: this.httpHeaders});
  }

  registerCommentFavorite(userId: number, shelfCommentId: number): Observable<any> {
    const body = {
      user: userId,
      shelf_comment: shelfCommentId,
    };
    return this.http.post<any>(this.SHELF_COMMENT_FAVORITES_API_URL, body, {headers: this.httpHeaders});
  }

  deleteCommentFavorite(commentFavoriteId: number): Observable<any> {
    const url = this.SHELF_COMMENT_FAVORITE_API_URL + commentFavoriteId + '/';
    const httpHeaders = this.signinService.appendJwtHeader(this.httpHeaders);
    return this.http.delete<any>(url, {headers: httpHeaders});
  }
}
