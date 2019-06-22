import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

import {SigninService} from '../signin/signin.service';

@Injectable({
  providedIn: 'root'
})
export class ShelfCommentFavoriteService {

  host = 'http://127.0.0.1:8000/';
  shelfCommentFavoriteUrl = 'api/shelf/comment/favorite/';
  shelfCommentFavoriteAPIUrl = this.host + this.shelfCommentFavoriteUrl;
  shelfCommentFavoritesUrl = 'api/shelf/comment/favorites/';
  shelfCommentFavoritesAPIUrl = this.host + this.shelfCommentFavoritesUrl;
  accountNameShelfCommentFavoritesUrl = 'api/shelf/comment/favorites/?account_name=';
  accountNameShelfCommentFavoritesAPIUrl = this.host + this.accountNameShelfCommentFavoritesUrl;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(
    private http: HttpClient,
    private signinService: SigninService,
  ) { }

  getCommentFavorite(userId: number, commentId: number): Observable<any> {
    const url = this.shelfCommentFavoritesAPIUrl + '?user_id=' + userId + '&comment_id=' + commentId;
    console.log('getCommentFavorite。url: ' + url);
    return this.http.get<any>(url, this.httpOptions);
  }

  getUserCommentFavorites(userId: number): Observable<any> {
    const url = this.shelfCommentFavoritesAPIUrl + '?user_id=' + userId;
    return this.http.get<any>(url, this.httpOptions);
  }

  getCommentFavoritesByAccountName(accountName: string): Observable<any> {
    const url = this.accountNameShelfCommentFavoritesAPIUrl + accountName;
    return this.http.get<any>(url, this.httpOptions);
  }

  registerCommentFavorite(userId: number, shelfCommentId: number): Observable<any> {
    const body = {
      user: userId,
      shelf_comment: shelfCommentId,
    };
    return this.http.post<any>(this.shelfCommentFavoritesAPIUrl, body, this.httpOptions);
  }

  deleteCommentFavorite(commentFavoriteId: number): Observable<any> {
    const url = this.shelfCommentFavoriteAPIUrl + commentFavoriteId + '/';
    const jwtHeader = this.signinService.createJwtHeaderFromLocalStorage();
    return this.http.delete<any>(url, {headers: jwtHeader});
  }
}
