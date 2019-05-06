import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class UserService {

  constructor(
    private http: HttpClient,
  ) {}
  host = 'http://127.0.0.1:8000/';
  userUrl = 'api/user/';
  usersUrl = 'api/users/';

  getUsers(): Observable<any> {
    return this.http.get<any>(this.host + this.usersUrl);
  }

  getUser(userAccountName): Observable<any> {
    return this.http.get<any>(this.host + this.userUrl + userAccountName + '/');
  }
}
