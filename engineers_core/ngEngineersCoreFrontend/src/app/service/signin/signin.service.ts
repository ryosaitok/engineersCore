import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthUser} from '../../auth-user';

@Injectable({
  providedIn: 'root'
})
export class SigninService {

  host = 'http://127.0.0.1:8000/';
  userRegisterUrl = 'api/authuser/register/';
  userRegisterApiUrl = this.host + this.userRegisterUrl;
  authUrl = 'api/auth/';
  authApiUrl = this.host + this.authUrl;
  userUrl = 'api/auth/me/';
  authUserApiUrl = this.host + this.userUrl;
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

  // 認証ユーザーを新規登録する。
  registerUser(username, email, password): Observable<any> {
    const body = {
      username,
      email,
      password
    };
    return this.http.post<any>(this.userRegisterApiUrl, body, this.httpOptions);
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

  getLoggedInUser(): any {
    this.getAuthUser().subscribe(response => {
      return new AuthUser(response.user_id, response.account_name, response.email);
    }, error => {
      console.log('getLoggedInUserで認証ユーザー情報取得できませんでした。error: ' + error);
      return null;
    });
  }

  getAuthUser(): Observable<any> {
    const jwtHeader = this.createJwtHeaderFromLocalStorage();
    return this.http.get<any>(this.authUserApiUrl, {headers: jwtHeader});
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
