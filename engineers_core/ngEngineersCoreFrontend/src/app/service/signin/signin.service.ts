import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SigninService {

  host = 'http://127.0.0.1:8000/';
  authUrl = 'api/auth/';
  authApiUrl = this.host + this.authUrl;
  authUserUrl = 'api/auth/user/';
  authUserApiUrl = this.host + this.authUserUrl;
  authUsersUrl = 'api/auth/users/';
  authUsersApiUrl = this.host + this.authUsersUrl;
  authUserByEmailApiUrl = this.authUsersApiUrl + '?email=';
  authUserMeUrl = 'api/auth/me/';
  authUserMeApiUrl = this.host + this.authUserMeUrl;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };
  token: string;

  constructor(
    private http: HttpClient,
  ) {
  }

  // 認証トークンを取得する。
  getAuthToken(username, password): Observable<any> {
    console.log('username: ' + username);
    console.log('password: ' + password);
    const body = {
      username,
      password
    };
    return this.http.post<any>(this.authApiUrl, body, this.httpOptions);
  }

  getAuthUser(): Observable<any> {
    const jwtHeader = this.createJwtHeaderFromLocalStorage();
    return this.http.get<any>(this.authUserMeApiUrl, {headers: jwtHeader});
  }

  getAuthUsersByEmail(email: string): Observable<any> {
    const url = this.authUserByEmailApiUrl + email;
    return this.http.get<any>(url);
  }

  updatePassword(authUserId: number, password: string): Observable<any> {
    const url = this.authUserApiUrl + authUserId + '/';
    const body = {password};
    const jwtHeader = this.createJwtHeaderFromLocalStorage();
    return this.http.put<any>(url, body, {headers: jwtHeader});
  }

  // LocalStorageから認証トークンを取得する
  getTokenFromLocalStorage(): string {
    return localStorage.getItem('authToken');
  }

  createJwtHeaderFromLocalStorage(): HttpHeaders {
    const token = this.getTokenFromLocalStorage();
    if (token !== null) {
      return this.createJwtHeader(token);
    }
  }

  createJwtHeader(token: string): HttpHeaders {
    const authorization = 'JWT ' + token;
    return new HttpHeaders({
      Authorization: authorization
    });
  }
}
