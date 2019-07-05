import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

import {SigninService} from '../signin/signin.service';

@Injectable({
  providedIn: 'root'
})
export class CommentFavoriteService {

  HOST = 'http://127.0.0.1:8000/';
  COMMENT_FAVORITES_API_URL = this.HOST + 'api/comment/favorites/';
  ACCOUNT_NAME_COMMENT_FAVORITES_API_URL = this.HOST + 'api/comment/favorites/?account_name=';
  COMMENT_FAVORITE_API_URL = this.HOST + 'api/comment/favorite/';
  httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(
    private http: HttpClient,
    private signinService: SigninService,
  ) {
  }

  getCommentFavorite(userId: number, commentId: number): Observable<any> {
    const url = this.COMMENT_FAVORITES_API_URL + '?user_id=' + userId + '&comment_id=' + commentId;
    return this.http.get<any>(url, {headers: this.httpHeaders});
  }

  getUserCommentFavorites(userId: number): Observable<any> {
    const url = this.COMMENT_FAVORITES_API_URL + '?user_id=' + userId;
    return this.http.get<any>(url, {headers: this.httpHeaders});
  }

  getCommentFavoritesByAccountName(accountName: string): Observable<any> {
    const url = this.ACCOUNT_NAME_COMMENT_FAVORITES_API_URL + accountName;
    return this.http.get<any>(url, {headers: this.httpHeaders});
  }

  registerCommentFavorite(userId: number, commentId: number): Observable<any> {
    const body = {
      user: userId,
      comment: commentId,
    };
    return this.http.post<any>(this.COMMENT_FAVORITES_API_URL, body, {headers: this.httpHeaders});
  }

  deleteCommentFavorite(commentFavoriteId: number): Observable<any> {
    const url = this.COMMENT_FAVORITE_API_URL + commentFavoriteId + '/';
    const httpHeaders = this.signinService.appendJwtHeader(this.httpHeaders);
    return this.http.delete<any>(url, {headers: httpHeaders});
  }
}
