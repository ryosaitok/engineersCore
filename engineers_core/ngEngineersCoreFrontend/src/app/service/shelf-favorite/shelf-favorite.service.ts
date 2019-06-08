import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {SigninService} from '../signin/signin.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShelfFavoriteService {

  host = 'http://127.0.0.1:8000/';
  shelfFavoritesUrl = 'api/shelf/favorites/';
  shelfFavoritesAPIUrl = this.host + this.shelfFavoritesUrl;
  accountNameShelfFavoritesUrl = 'api/shelf/favorites/?account_name=';
  accountNameShelfFavoritesAPIUrl = this.host + this.accountNameShelfFavoritesUrl;
  shelfFavoriteUrl = 'api/shelf/favorite/';
  shelfFavoriteAPIUrl = this.host + this.shelfFavoriteUrl;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(
    private http: HttpClient,
    private signinService: SigninService,
  ) { }

  getShelfFavorite(userId: number, shelfId: number): Observable<any> {
    const url = this.shelfFavoritesAPIUrl + '?user_id=' + userId + '&shelf_id=' + shelfId;
    console.log('getShelfFavorite。url: ' + url);
    return this.http.get<any>(url, this.httpOptions);
  }

  getUserShelfFavorites(userId: number): Observable<any> {
    const url = this.shelfFavoritesAPIUrl + '?user_id=' + userId;
    return this.http.get<any>(url, this.httpOptions);
  }

  getShelfFavoritesByAccountName(accountName: string): Observable<any> {
    const url = this.accountNameShelfFavoritesAPIUrl + accountName;
    return this.http.get<any>(url, this.httpOptions);
  }

  registerShelfFavorite(userId: number, shelfId: number): Observable<any> {
    const body = {
      user: userId,
      shelf: shelfId,
    };
    return this.http.post<any>(this.shelfFavoritesAPIUrl, body, this.httpOptions);
  }

  deleteShelfFavorite(shelfFavoriteId: number): Observable<any> {
    const url = this.shelfFavoriteAPIUrl + shelfFavoriteId + '/';
    const jwtHeader = this.signinService.createJwtHeaderFromLocalStorage();
    return this.http.delete<any>(url, {headers: jwtHeader});
  }
}
