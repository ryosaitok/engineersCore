import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SigninService {

  HOST = 'http://127.0.0.1:8000/';
  AUTH_API_URL = this.HOST + 'api/auth/';
  AUTH_USERS_API_URL = this.HOST + 'api/auth/users/';
  EMAIL_AUTH_USER_API_URL = this.AUTH_USERS_API_URL + '?email=';
  AUTH_USER_ME_API_URL = this.HOST + 'api/auth/me/';
  PASSWORD_REMINDER_SEND_API_URL = this.HOST + 'api/password/reminder/send/';
  VERIFY_PASSWORD_REMINDER_API_URL = this.HOST + 'api/verify/password/reminder/';
  PASSWORD_RESET_API_URL = this.HOST + 'api/password/reset/';
  HTTP_OPTIONS = {
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
    return this.http.post<any>(this.AUTH_API_URL, body, this.HTTP_OPTIONS);
  }

  getAuthUser(): Observable<any> {
    const jwtHeader = this.createJwtHeaderFromLocalStorage();
    return this.http.get<any>(this.AUTH_USER_ME_API_URL, {headers: jwtHeader});
  }

  getAuthUsersByEmail(email: string): Observable<any> {
    const url = this.EMAIL_AUTH_USER_API_URL + email;
    return this.http.get<any>(url);
  }

  resetPassword(token: string, password: string): Observable<any> {
    const url = this.PASSWORD_RESET_API_URL + '?token=' + token;
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
    return this.http.post<any>(this.PASSWORD_REMINDER_SEND_API_URL, body, this.HTTP_OPTIONS);
  }

  // パスワードリマインダーメールの認証をトークンで行う。
  verifyPasswordReminder(token: string): Observable<any> {
    const email = 'email';
    // const body = {email, token};
    const url = this.VERIFY_PASSWORD_REMINDER_API_URL + '?token=' + token;
    return this.http.get<any>(url, this.HTTP_OPTIONS);
  }
}
