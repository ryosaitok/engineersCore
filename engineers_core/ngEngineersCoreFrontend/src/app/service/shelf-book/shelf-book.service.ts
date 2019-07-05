import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

import {ShelfBook} from '../../dto/shelf-book/shelf-book';
import {SigninService} from '../signin/signin.service';

@Injectable({
  providedIn: 'root'
})
export class ShelfBookService {

  HOST = 'http://127.0.0.1:8000/';
  SHELF_BOOK_API_URL = this.HOST + 'api/shelf/book/';
  SHELF_BOOKS_API_URL = this.HOST + 'api/shelf/books/';
  SHELF_ID_SHELF_BOOKS_API_URL = this.HOST + 'api/shelf/books/?shelf_id=';
  SHELF_BOOKS_BULK_API_URL = this.HOST + 'api/shelf/books/bulk/';
  httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(
    private http: HttpClient,
    private signinService: SigninService,
  ) {
  }

  getShelfBook(commentId: number): Observable<any> {
    const url = this.SHELF_BOOK_API_URL + commentId + '/';
    return this.http.get<any>(url, {headers: this.httpHeaders});
  }

  getShelfBooks(): Observable<any> {
    const url = this.SHELF_BOOKS_API_URL;
    return this.http.get<any>(url, {headers: this.httpHeaders});
  }

  getShelfBooksByShelfId(shelfId: number): Observable<any> {
    const url = this.SHELF_ID_SHELF_BOOKS_API_URL + shelfId;
    return this.http.get<any>(url, {headers: this.httpHeaders});
  }

  registerShelfBook(shelfId: number, bookId: number, displayOrder: number) {
    const body = {
      shelf: shelfId,
      book: bookId,
      display_order: displayOrder
    };
    const httpHeaders = this.signinService.appendJwtHeader(this.httpHeaders);
    return this.http.post<any>(this.SHELF_BOOKS_API_URL, body, {headers: httpHeaders});
  }

  bulkRegisterShelfBooks(shelfBooks: ShelfBook[]) {
    const body = [];
    shelfBooks.forEach(shelfBook => {
      body.push({
        shelf: shelfBook.shelfId,
        book: shelfBook.bookId,
        display_order: shelfBook.displayOrder
      });
    });
    const httpHeaders = this.signinService.appendJwtHeader(this.httpHeaders);
    return this.http.post<any>(this.SHELF_BOOKS_BULK_API_URL, body, {headers: httpHeaders});
  }

  deleteShelfBook(shelfBookId: number) {
    const url = this.SHELF_BOOK_API_URL + shelfBookId + '/';
    const httpHeaders = this.signinService.appendJwtHeader(this.httpHeaders);
    return this.http.delete<any>(url, {headers: httpHeaders});
  }

  bulkDeleteShelfBooks(shelfBookIds: number[]) {
    let url = this.SHELF_BOOKS_BULK_API_URL;
    shelfBookIds.forEach((id, index) => {
      if (index === 0) {
        url += url + '?id=' + id;
      } else {
        url += url + '&id=' + id;
      }
    });
    const httpHeaders = this.signinService.appendJwtHeader(this.httpHeaders);
    return this.http.delete<any>(this.SHELF_BOOKS_BULK_API_URL, {headers: httpHeaders});
  }

  shlefIdBulkDeleteShelfBooks(shelfId: number) {
    const url = this.SHELF_BOOKS_BULK_API_URL + '?shelf_id=' + shelfId;
    const httpHeaders = this.signinService.appendJwtHeader(this.httpHeaders);
    return this.http.delete<any>(url, {headers: httpHeaders});
  }
}
