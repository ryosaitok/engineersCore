import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  host = 'http://127.0.0.1:8000/';
  authUsersUrl = 'api/auth/users/';
  authUsersApiUrl = this.host + this.authUsersUrl;
  emailVerificationSendUrl = 'api/email/verification/send/';
  emailVerificationSendApiUrl = this.host + this.emailVerificationSendUrl;
  verifyEmailUrl = 'api/verify/email/';
  verifyEmailApiUrl = this.host + this.verifyEmailUrl;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };
  token: string;

  constructor(
    private http: HttpClient,
  ) { }

  // 認証ユーザーを新規登録する。
  registerUser(username, email, password): Observable<any> {
    const body = {username, email, password};
    return this.http.post<any>(this.authUsersApiUrl, body, this.httpOptions);
  }

  // 認証ユーザーを新規登録する。
  emailVerificationSend(email: string): Observable<any> {
    const body = {email};
    return this.http.post<any>(this.emailVerificationSendApiUrl, body, this.httpOptions);
  }

  // メールアドレス認証をトークンで行う。
  verifyEmail(token: string): Observable<any> {
    const body = {token};
    return this.http.post<any>(this.verifyEmailApiUrl, body, this.httpOptions);
  }
}
