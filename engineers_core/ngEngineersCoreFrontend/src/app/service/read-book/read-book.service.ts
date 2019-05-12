import {Injectable} from '@angular/core';
import {SigninService} from '../signin/signin.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReadBookService {

  host = 'http://127.0.0.1:8000/';
  readBooksUrl = 'api/readbooks/';
  readBooksAPIUrl = this.host + this.readBooksUrl;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(
    private http: HttpClient,
  ) { }

  registerReadBook(userId: number, bookId: number, readDate: Date) {
    const body = {
      user_id: userId,
      book_id: bookId,
      read_date: readDate,
    };
    return this.http.post<any>(this.readBooksAPIUrl, body, this.httpOptions);
  }
}
