import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserService} from "../user/user.service";

@Injectable({
  providedIn: 'root'
})
export class SigninService {

  host = 'http://127.0.0.1:8000/';
  authUrl = 'api/auth/';
  userUrl = 'api/auth/me/';
  authApiUrl = this.host + this.authUrl;
  authUserApiUrl = this.host + this.userUrl;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };
  token: string;

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) {
  }

  // 認証トークンを取得する。
  getAuthToken(username, password): Observable<any> {
    this.httpOptions.headers.set('username', username);
    this.httpOptions.headers.set('password', password);
    const body = {
      username,
      password
    };
    return this.http.post<any>(this.authApiUrl, body, this.httpOptions);
  }

  getLoginUser(): Observable<any> {
    const token = this.getTokenFromLocalStorage();
    if (token !== null) {
      const jwtHeader = this.createJwtHeader(token);
      return this.http.get<any>(this.authUserApiUrl, jwtHeader);
    }
  }

  getLoginUserAccountNameDeprecated(): string {
    return localStorage.getItem('accountName');
  }

  getLoginUserIdDeprecated(): Observable<any> {
    const accountName = localStorage.getItem('accountName');
    return this.userService.getUser(accountName);
  }

  // LocalStorageから認証トークンを取得する
  getTokenFromLocalStorage(): string {
    return localStorage.getItem('authToken');
  }

  createJwtHeader(token: string): any {
    console.log('\'JWT \' + token: ' + 'JWT ' + token);
   　return new HttpHeaders({
      Authorization: 'JWT ' + token
    });
  }
}
