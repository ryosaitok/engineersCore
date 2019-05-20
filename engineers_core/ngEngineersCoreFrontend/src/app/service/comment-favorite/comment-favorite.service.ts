import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {SigninService} from '../signin/signin.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentFavoriteService {

  host = 'http://127.0.0.1:8000/';
  commentFavoritesUrl = 'api/commentfavorites/';
  commentFavoritesAPIUrl = this.host + this.commentFavoritesUrl;
  accountNameCommentFavoritesUrl = 'api/commentfavorites/?account_name=';
  accountNameCommentFavoritesAPIUrl = this.host + this.accountNameCommentFavoritesUrl;
  commentFavoriteUrl = 'api/commentfavorite/';
  commentFavoriteAPIUrl = this.host + this.commentFavoriteUrl;
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
    const url = this.commentFavoritesAPIUrl + '?user_id=' + userId + '&comment_id=' + commentId;
    console.log('getCommentFavorite。url: ' + url);
    return this.http.get<any>(url, this.httpOptions);
  }

  getUserCommentFavorites(userId: number): Observable<any> {
    const url = this.commentFavoritesAPIUrl + '?user_id=' + userId;
    return this.http.get<any>(url, this.httpOptions);
  }

  getCommentFavoritesByAccountName(accountName: string): Observable<any> {
    const url = this.accountNameCommentFavoritesAPIUrl + accountName;
    return this.http.get<any>(url, this.httpOptions);
  }

  registerCommentFavorite(userId: number, commentId: number): Observable<any> {
    const body = {
      user: userId,
      comment: commentId,
    };
    return this.http.post<any>(this.commentFavoritesAPIUrl, body, this.httpOptions);
  }

  deleteCommentFavorite(commentFavoriteId: number): Observable<any> {
    const url = this.commentFavoriteAPIUrl + commentFavoriteId + '/';
    const jwtHeader = this.signinService.createJwtHeaderFromLocalStorage();
    return this.http.delete<any>(url, {headers: jwtHeader});
  }
}
