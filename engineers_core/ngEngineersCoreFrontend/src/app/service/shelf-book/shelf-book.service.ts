import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

import {ShelfBook} from '../../dto/shelf-book/shelf-book';

@Injectable({
  providedIn: 'root'
})
export class ShelfBookService {

  HOST = 'http://127.0.0.1:8000/';
  SHELF_BOOK_API_URL = this.HOST + 'api/shelf/book/';
  SHELF_BOOKS_API_URL = this.HOST + 'api/shelf/books/';
  SHELF_ID_SHELF_BOOKS_API_URL = this.HOST + 'api/shelf/books/?shelf_id=';
  SHELF_BOOKS_BULK_API_URL = this.HOST + 'api/shelf/books/bulk/';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(
    private http: HttpClient,
  ) {
  }

  getShelfBook(commentId: number): Observable<any> {
    const url = this.SHELF_BOOK_API_URL + commentId + '/';
    return this.http.get<any>(url, this.httpOptions);
  }

  getShelfBooks(): Observable<any> {
    const url = this.SHELF_BOOKS_API_URL;
    return this.http.get<any>(url, this.httpOptions);
  }

  getShelfBooksByShelfId(shelfId: number): Observable<any> {
    const url = this.SHELF_ID_SHELF_BOOKS_API_URL + shelfId;
    return this.http.get<any>(url, this.httpOptions);
  }

  registerShelfBook(shelfId: number, bookId: number, displayOrder: number) {
    const body = {
      shelf: shelfId,
      book: bookId,
      display_order: displayOrder
    };
    return this.http.post<any>(this.SHELF_BOOKS_API_URL, body, this.httpOptions);
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
    return this.http.post<any>(this.SHELF_BOOKS_BULK_API_URL, body, this.httpOptions);
  }

  deleteShelfBook(shelfBookId: number) {
    const url = this.SHELF_BOOK_API_URL + shelfBookId + '/';
    return this.http.delete<any>(url, this.httpOptions);
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
    return this.http.delete<any>(this.SHELF_BOOKS_BULK_API_URL, this.httpOptions);
  }

  shlefIdBulkDeleteShelfBooks(shelfId: number) {
    const url = this.SHELF_BOOKS_BULK_API_URL + '?shelf_id=' + shelfId;
    return this.http.delete<any>(url, this.httpOptions);
  }
}
