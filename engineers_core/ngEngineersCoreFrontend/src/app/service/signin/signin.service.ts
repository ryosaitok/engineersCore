import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SigninService {

  host = 'http://127.0.0.1:8000/';
  authUrl = 'api/auth/jwt/create/';
  userUrl = 'api/auth/users/me/';
  authApiUrl = this.host + this.authUrl;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };
  token: string;

  constructor(
    private cookieService: CookieService,
    private http: HttpClient) { }

  // 認証トークンを取得する。
  getAuthToken(username, password): string {
    this.httpOptions.headers.set('username', username);
    this.httpOptions.headers.set('password', password);
    const body = {
      username,
      password
    };
    this.http.post<any>(this.authApiUrl, body, this.httpOptions).subscribe(response => {
      this.token = response.access;
    });
    const tokenUser = {
      token: this.token,
      username
    };
    return JSON.stringify(tokenUser);
  }

  getLoginUser(): Observable<any> {
    return this.http.post<any>(this.userUrl, this.httpOptions);
  }

  // 認証状態かどうか
  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    return token !== null;
  }
}
