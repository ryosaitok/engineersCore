import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class UserService {

  constructor(
    private http: HttpClient,
  ) {}
  host = 'http://127.0.0.1:8000/';
  userUrl = 'api/user/';
  userApiUrl = this.host + this.userUrl;
  usersUrl = 'api/users/';
  usersApiUrl = this.host + this.usersUrl;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  getUsers(): Observable<any> {
    return this.http.get<any>(this.usersApiUrl);
  }

  registerUser(authUserId: number, accountName: string, userName: string, description: string, imageLink: string): Observable<any> {
    const body = {
      auth_user: authUserId,
      user_name: userName,
      account_name: accountName,
      description,
      profile_image_link: imageLink,
    };
    return this.http.post<any>(this.usersApiUrl, body, this.httpOptions);
  }

  getUser(userAccountName): Observable<any> {
    return this.http.get<any>(this.userApiUrl + userAccountName + '/');
  }
}
