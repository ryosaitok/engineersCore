import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  HOST = 'http://127.0.0.1:8000/';
  AUTH_USER_REGISTER_API_URL = this.HOST + 'api/auth/user/register/';
  EMAIL_VERIFICATION_SEND_API_URL = this.HOST + 'api/email/verification/send/';
  VERIFY_EMAIL_API_URL = this.HOST + 'api/verify/email/';
  httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  token: string;

  constructor(
    private http: HttpClient,
  ) {
  }

  // 認証ユーザーを新規登録する。
  registerUser(username, email, password): Observable<any> {
    const body = {username, email, password};
    return this.http.post<any>(this.AUTH_USER_REGISTER_API_URL, body, {headers: this.httpHeaders});
  }

  // 認証メールを送信する。
  emailVerificationSend(email: string): Observable<any> {
    // tokenはサーバーサイド側で書き換えるので何を送ってもよい
    const token = 'token';
    const body = {email, token};
    return this.http.post<any>(this.EMAIL_VERIFICATION_SEND_API_URL, body, {headers: this.httpHeaders});
  }

  // メールアドレス認証をトークンで行う。
  verifyEmail(token: string): Observable<any> {
    const email = 'email';
    // const body = {email, token};
    const url = this.VERIFY_EMAIL_API_URL + '?token=' + token;
    return this.http.get<any>(url, {headers: this.httpHeaders});
  }
}
