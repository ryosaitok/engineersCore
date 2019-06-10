import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {User} from '../../dto/user/user';
import {HttpRequestService} from '../http-request/http-request.service';

@Injectable({providedIn: 'root'})
export class UserService {

  constructor(
    private http: HttpClient,
    private httpRequestService: HttpRequestService,
  ) {}
  host = 'http://127.0.0.1:8000/';
  userUrl = 'api/user/';
  userApiUrl = this.host + this.userUrl;
  usersUrl = 'api/users/';
  usersApiUrl = this.host + this.usersUrl;
  filteredUsersUrl = 'api/users/?user=';
  filteredUsersApiUrl = this.host + this.filteredUsersUrl;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  getUsers(): Observable<any> {
    return this.http.get<any>(this.usersApiUrl);
  }

  getUsersLikeName(user: string, sort: string, page: string): Observable<any> {
    let url = this.filteredUsersApiUrl + user;
    url = this.httpRequestService.appendUrlConditions(url, sort, page);
    return this.http.get<any>(url);
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

  convertUser(user: any): User {
    return new User(user.id, user.user_name, user.account_name, user.description, user.profile_image_link);
  }

  convertUsers(users: any[]): User[] {
    const convertedUsers = [];
    users.forEach(user => {
      convertedUsers.push(new User(user.id, user.user_name, user.account_name, user.description, user.profile_image_link));
    });
    return convertedUsers;
  }
}
