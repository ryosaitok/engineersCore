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
  authUsersUrl = 'api/auth/users/';
  authUsersApiUrl = this.host + this.authUsersUrl;
  authUserByEmailApiUrl = this.authUsersApiUrl + '?email=';
  authUserMeUrl = 'api/auth/me/';
  authUserMeApiUrl = this.host + this.authUserMeUrl;
  passwordReminderSendUrl = 'api/password/reminder/send/';
  passwordReminderSendApiUrl = this.host + this.passwordReminderSendUrl;
  verifyPasswordReminderUrl = 'api/verify/password/reminder/';
  verifyPasswordReminderApiUrl = this.host + this.verifyPasswordReminderUrl;
  passwordResetUrl = 'api/password/reset/';
  passwordResetApiUrl = this.host + this.passwordResetUrl;
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

  resetPassword(token: string, password: string): Observable<any> {
    const url = this.passwordResetApiUrl + '?token=' + token;
    const body = {token, password};
    return this.http.put<any>(url, body);
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

  // パスワードリマインダーメールを送信する。
  passwordReminderSend(email: string): Observable<any> {
    // tokenはサーバーサイド側で書き換えるので何を送ってもよい
    const token = 'token';
    const body = {email, token};
    return this.http.post<any>(this.passwordReminderSendApiUrl, body, this.httpOptions);
  }

  // パスワードリマインダーメールの認証をトークンで行う。
  verifyPasswordReminder(token: string): Observable<any> {
    const email = 'email';
    // const body = {email, token};
    const url = this.verifyPasswordReminderApiUrl + '?token=' + token;
    return this.http.get<any>(url, this.httpOptions);
  }
}
