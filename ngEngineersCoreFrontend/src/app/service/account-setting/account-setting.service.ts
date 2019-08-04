import {Injectable} from '@angular/core';
import {SigninService} from '../signin/signin.service';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountSettingService {

  HOST = 'http://127.0.0.1:8000/';
  AUTH_USER_UPDATE_API_URL = this.HOST + 'api/auth/user/update/';
  USER_API_URL = this.HOST + 'api/user/';
  USER_PROFILE_IMAGE_UPLOAD_API_URL = this.HOST + 'api/profile/image/upload/';
  httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  formDataHeaders = new HttpHeaders({
    // Content-Typeを指定すると画像ファイル送れない...?
    // 'Content-Type': 'multipart/form-data',
  });
  token: string;

  constructor(
    private http: HttpClient,
    private signinService: SigninService,
  ) {
  }

  updateAuthUser(userName: string): Observable<any> {
    const url = this.AUTH_USER_UPDATE_API_URL;
    const body = {username: userName};
    const httpHeaders = this.signinService.appendJwtHeader(this.httpHeaders);
    return this.http.put<any>(url, body, {headers: httpHeaders});
  }

  updateUser(accountName: string, userName: string, description: string): Observable<any> {
    const url = this.USER_API_URL + accountName + '/';
    const body = {account_name: accountName, user_name: userName, description};
    const httpHeaders = this.signinService.appendJwtHeader(this.httpHeaders);
    return this.http.put<any>(url, body, {headers: httpHeaders});
  }

  uploadProfileImage(userId: number, profileImage: File): Observable<any> {
    const url = this.USER_PROFILE_IMAGE_UPLOAD_API_URL;
    const formDataHeaders = this.signinService.appendJwtHeader(this.formDataHeaders);
    const formData = new FormData();
    formData.append('user', userId.toString());
    const fileName = userId.toString() + '_upload_file.png';
    formData.append('file', profileImage, fileName);
    return this.http.post<any>(url, formData, {headers: formDataHeaders});
  }
}
