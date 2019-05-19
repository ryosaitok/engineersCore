import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {SigninService} from '../signin/signin.service';

@Injectable({
  providedIn: 'root'
})
export class InterestedBookService {

  host = 'http://127.0.0.1:8000/';
  interestedBooksUrl = 'api/interestedbooks/';
  interestedBooksAPIUrl = this.host + this.interestedBooksUrl;
  accountNameInterestedBooksUrl = 'api/interestedbooks/?account_name=';
  accountNameInterestedBooksAPIUrl = this.host + this.accountNameInterestedBooksUrl;
  interestedBookUrl = 'api/interestedbook/';
  interestedBookAPIUrl = this.host + this.interestedBookUrl;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(
    private http: HttpClient,
    private signinService: SigninService,
  ) { }

  getInterestedBook(userId: number, bookId: number): Observable<any> {
    const url = this.interestedBooksAPIUrl + '?user_id=' + userId + '&book_id=' + bookId;
    return this.http.get<any>(url, this.httpOptions);
  }

  getUserInterestedBook(userId: number): Observable<any> {
    const url = this.interestedBooksAPIUrl + '?user_id=' + userId;
    return this.http.get<any>(url, this.httpOptions);
  }

  getInterestedBookByAccountName(accountName: string): Observable<any> {
    const url = this.accountNameInterestedBooksAPIUrl + accountName;
    return this.http.get<any>(url, this.httpOptions);
  }

  getBookInterested(bookId: number): Observable<any> {
    const url = this.interestedBooksAPIUrl + '?book_id=' + bookId;
    return this.http.get<any>(url, this.httpOptions);
  }

  registerInterestedBook(userId: number, bookId: number): Observable<any> {
    const body = {
      user: userId,
      book: bookId,
      delete_flag: false,
    };
    return this.http.post<any>(this.interestedBooksAPIUrl, body, this.httpOptions);
  }

  updateInterestedBook(interestedBookId: number, userId: number, bookId: number, deleteFlag: boolean): Observable<any> {
    const url = this.interestedBookAPIUrl + interestedBookId + '/';
    const body = {
      user: userId,
      book: bookId,
      delete_flag: deleteFlag
    };
    const jwtHeader = this.signinService.createJwtHeaderFromLocalStorage();
    return this.http.put<any>(url, body, {headers: jwtHeader});
  }
}
