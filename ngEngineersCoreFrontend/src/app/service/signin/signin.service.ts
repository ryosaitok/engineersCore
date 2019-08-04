import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SigninService {

  HOST = 'http://127.0.0.1:8000/';
  AUTH_API_URL = this.HOST + 'api/auth/';
  AUTH_USER_ME_API_URL = this.HOST + 'api/auth/me/';
  PASSWORD_REMINDER_SEND_API_URL = this.HOST + 'api/password/reminder/send/';
  VERIFY_PASSWORD_REMINDER_API_URL = this.HOST + 'api/verify/password/reminder/';
  PASSWORD_RESET_API_URL = this.HOST + 'api/password/reset/';
  httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

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
    return this.http.post<any>(this.AUTH_API_URL, body, {headers: this.httpHeaders});
  }

  getAuthUser(): Observable<any> {
    const httpHeaders = this.appendJwtHeader(this.httpHeaders);
    console.log('httpHeaders: ', httpHeaders);
    return this.http.get<any>(this.AUTH_USER_ME_API_URL, {headers: httpHeaders});
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

  createJwtAuthorization(): string {
    const token = this.getTokenFromLocalStorage();
    if (token !== null) {
      return 'JWT ' + token;
    } else {
      return 'JWT ';
    }
  }

  appendJwtHeader(headers: HttpHeaders): HttpHeaders {
    const authorization = this.createJwtAuthorization();
    return headers.set('Authorization', authorization);
  }

  // パスワードリマインダーメールを送信する。
  passwordReminderSend(email: string): Observable<any> {
    // tokenはサーバーサイド側で書き換えるので何を送ってもよい
    const token = 'token';
    const body = {email, token};
    return this.http.post<any>(this.PASSWORD_REMINDER_SEND_API_URL, body, {headers: this.httpHeaders});
  }

  // パスワードリマインダーメールの認証をトークンで行う。
  verifyPasswordReminder(token: string): Observable<any> {
    const email = 'email';
    // const body = {email, token};
    const url = this.VERIFY_PASSWORD_REMINDER_API_URL + '?token=' + token;
    return this.http.get<any>(url, {headers: this.httpHeaders});
  }
}
