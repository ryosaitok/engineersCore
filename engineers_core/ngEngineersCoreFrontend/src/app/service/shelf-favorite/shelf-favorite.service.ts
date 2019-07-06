import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

import {SigninService} from '../signin/signin.service';

@Injectable({
  providedIn: 'root'
})
export class ShelfFavoriteService {

  HOST = 'http://127.0.0.1:8000/';
  SHELF_FAVORITES_API_URL = this.HOST + 'api/shelf/favorites/';
  ACCOUNT_NAME_SHELF_FAVORITES_API_URL = this.HOST + 'api/shelf/favorites/?account_name=';
  SHELF_FAVORITE_API_URL = this.HOST + 'api/shelf/favorite/';
  httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(
    private http: HttpClient,
    private signinService: SigninService,
  ) {
  }

  getShelfFavorite(userId: number, shelfId: number): Observable<any> {
    const url = this.SHELF_FAVORITES_API_URL + '?user_id=' + userId + '&shelf_id=' + shelfId;
    console.log('getShelfFavorite。url: ' + url);
    return this.http.get<any>(url, {headers: this.httpHeaders});
  }

  getUserShelfFavorites(userId: number): Observable<any> {
    const url = this.SHELF_FAVORITES_API_URL + '?user_id=' + userId;
    return this.http.get<any>(url, {headers: this.httpHeaders});
  }

  getShelfFavoritesByAccountName(accountName: string): Observable<any> {
    const url = this.ACCOUNT_NAME_SHELF_FAVORITES_API_URL + accountName;
    return this.http.get<any>(url, {headers: this.httpHeaders});
  }

  registerShelfFavorite(userId: number, shelfId: number): Observable<any> {
    const body = {
      user: userId,
      shelf: shelfId,
    };
    const httpHeaders = this.signinService.appendJwtHeader(this.httpHeaders);
    return this.http.post<any>(this.SHELF_FAVORITES_API_URL, body, {headers: httpHeaders});
  }

  deleteShelfFavorite(shelfFavoriteId: number): Observable<any> {
    const url = this.SHELF_FAVORITE_API_URL + shelfFavoriteId + '/';
    const httpHeaders = this.signinService.appendJwtHeader(this.httpHeaders);
    return this.http.delete<any>(url, {headers: httpHeaders});
  }
}
