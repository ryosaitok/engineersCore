import {Injectable} from '@angular/core';
import {SigninService} from '../signin/signin.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountSettingService {

  HOST = 'http://127.0.0.1:8000/';
  AUTH_USER_API_URL = this.HOST + 'api/auth/user/';
  ACCOUNT_NAME_AUTH_USERS_API_URL = this.HOST + 'api/auth/users/?account_name=';
  USER_API_URL = this.HOST + 'api/user/';
  USER_PROFILE_IMAGE_UPLOAD_API_URL = this.HOST + 'api/profile/image/upload/';
  httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  formDataHeaders = new HttpHeaders({
    'Content-Type': 'multipart/form-data',
  });
  token: string;

  constructor(
    private http: HttpClient,
    private signinService: SigninService,
  ) {
  }

  getAuthUser(accountName: string): Observable<any> {
    const url = this.ACCOUNT_NAME_AUTH_USERS_API_URL + accountName;
    const httpHeaders = this.signinService.appendJwtHeader(this.httpHeaders);
    return this.http.get<any>(url, {headers: httpHeaders});
  }

  updateAuthUser(userName: string): Observable<any> {
    const url = this.AUTH_USER_API_URL;
    const httpHeaders = this.signinService.appendJwtHeader(this.httpHeaders);
    const body = {username: userName};
    return this.http.put<any>(url, body, {headers: httpHeaders});
  }

  updateUser(userId: number, accountName: string, userName: string, description: string,
             profileImageLink: string): Observable<any> {
    const url = this.USER_API_URL + userId + '/';
    const httpHeaders = this.signinService.appendJwtHeader(this.httpHeaders);
    const body = {account_name: accountName, user_name: userName, description, profile_image_link: profileImageLink};
    return this.http.put<any>(url, body, {headers: httpHeaders});
  }

  updateProfileImage(userId: number, profileImage: FormData): Observable<any> {
    const url = this.USER_PROFILE_IMAGE_UPLOAD_API_URL;
    const formDataHeaders = this.signinService.appendJwtHeader(this.formDataHeaders);
    const body = {user_id: userId, profile_image: profileImage};
    return this.http.put<any>(url, body, {headers: formDataHeaders});
  }
}
