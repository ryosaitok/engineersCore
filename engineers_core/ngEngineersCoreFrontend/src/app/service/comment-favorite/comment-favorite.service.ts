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
      delete_flag: false,
    };
    return this.http.post<any>(this.commentFavoritesAPIUrl, body, this.httpOptions);
  }

  updateCommentFavorite(commentFavoriteId: number, userId: number, commentId: number, deleteFlag: boolean): Observable<any> {
    const url = this.commentFavoriteAPIUrl + commentFavoriteId + '/';
    const body = {
      user: userId,
      comment: commentId,
      delete_flag: deleteFlag
    };
    const jwtHeader = this.signinService.createJwtHeaderFromLocalStorage();
    return this.http.put<any>(url, body, {headers: jwtHeader});
  }
}
