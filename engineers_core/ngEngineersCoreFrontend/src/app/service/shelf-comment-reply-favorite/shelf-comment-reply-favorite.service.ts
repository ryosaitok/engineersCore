import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

import {SigninService} from '../signin/signin.service';

@Injectable({
  providedIn: 'root'
})
export class ShelfCommentReplyFavoriteService {

  host = 'http://127.0.0.1:8000/';
  shelfCommentReplyFavoriteUrl = 'api/shelf/comment/reply/favorite/';
  shelfCommentReplyFavoriteAPIUrl = this.host + this.shelfCommentReplyFavoriteUrl;
  shelfCommentReplyFavoritesUrl = 'api/shelf/comment/reply/favorites/';
  shelfCommentReplyFavoritesAPIUrl = this.host + this.shelfCommentReplyFavoritesUrl;
  accountNameShelfCommentReplyFavoritesUrl = 'api/shelf/comment/reply/favorites/?account_name=';
  accountNameShelfCommentReplyFavoritesAPIUrl = this.host + this.accountNameShelfCommentReplyFavoritesUrl;
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
    const url = this.shelfCommentReplyFavoritesAPIUrl + '?user_id=' + userId + '&comment_reply_id=' + shelfCommentReplyId;
    console.log('getReplyFavorite。url: ' + url);
    return this.http.get<any>(url, this.httpOptions);
  }

  getUserReplyFavorites(userId: number): Observable<any> {
    const url = this.shelfCommentReplyFavoritesAPIUrl + '?user_id=' + userId;
    return this.http.get<any>(url, this.httpOptions);
  }

  getReplyFavoritesByAccountName(accountName: string): Observable<any> {
    const url = this.accountNameShelfCommentReplyFavoritesAPIUrl + accountName;
    return this.http.get<any>(url, this.httpOptions);
  }

  registerReplyFavorite(userId: number, shelfCommentReplyId: number): Observable<any> {
    const body = {
      user: userId,
      shelf_comment_reply: shelfCommentReplyId,
    };
    console.log('userId: ' + userId + ' shelfCommentReplyId: ' + shelfCommentReplyId);
    return this.http.post<any>(this.shelfCommentReplyFavoritesAPIUrl, body, this.httpOptions);
  }

  deleteReplyFavorite(replyFavoriteId: number): Observable<any> {
    const url = this.shelfCommentReplyFavoriteAPIUrl + replyFavoriteId + '/';
    const jwtHeader = this.signinService.createJwtHeaderFromLocalStorage();
    return this.http.delete<any>(url, {headers: jwtHeader});
  }
}
