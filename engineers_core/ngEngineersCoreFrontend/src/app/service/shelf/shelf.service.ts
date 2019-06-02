import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShelfService {

  host = 'http://127.0.0.1:8000/';
  shelfUrl = 'api/shelf/';
  shelfAPIUrl = this.host + this.shelfUrl;
  shelfsUrl = 'api/shelfs/';
  shelfsAPIUrl = this.host + this.shelfsUrl;
  bookIdShelfsUrl = 'api/shelfs/?book_id=';
  bookIdShelfsAPIUrl = this.host + this.bookIdShelfsUrl;
  shelfCdShelfsUrl = 'api/shelfs/?shelf_cd=';
  shelfCdShelfsAPIUrl = this.host + this.shelfCdShelfsUrl;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(
    private http: HttpClient,
  ) { }

  getShelf(shelfId: number): Observable<any> {
    const url = this.shelfAPIUrl + shelfId + '/';
    return this.http.get<any>(url, this.httpOptions);
  }

  getShelfs(): Observable<any> {
    const url = this.shelfsAPIUrl;
    return this.http.get<any>(url, this.httpOptions);
  }

  getShelfsByBookId(bookId: number): Observable<any> {
    const url = this.bookIdShelfsAPIUrl + bookId;
    return this.http.get<any>(url, this.httpOptions);
  }

  getShelfsByShelfCd(shelfCd: string): Observable<any> {
    const url = this.shelfCdShelfsAPIUrl + shelfCd;
    return this.http.get<any>(url, this.httpOptions);
  }
}
