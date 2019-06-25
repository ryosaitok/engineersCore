import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

import {Shelf} from '../../dto/shelf/shelf';
import {BookService} from '../book/book.service';
import {UserService} from '../user/user.service';
import {HttpRequestService} from '../http-request/http-request.service';

@Injectable({
  providedIn: 'root'
})
export class ShelfService {

  host = 'http://127.0.0.1:8000/';
  SHELF_API_URL = this.host + 'api/shelf/';
  SHELVES_API_URL = this.host + 'api/shelves/';
  BOOK_ID_SHELVES_API_URL = this.host + 'api/shelves/?book_id=';
  SHELF_ID_SHELVES_API_URL = this.host + 'api/shelves/?shelf_id=';
  SHELF_REPORTS_API_URL = this.host + 'api/shelf/reports';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(
    private http: HttpClient,
    private httpRequestService: HttpRequestService,
    private bookService: BookService,
    private userService: UserService,
  ) {
  }

  getShelf(shelfId: number): Observable<any> {
    const url = this.SHELF_API_URL + shelfId + '/';
    return this.http.get<any>(url, this.httpOptions);
  }

  getShelves(): Observable<any> {
    const url = this.SHELVES_API_URL;
    return this.http.get<any>(url, this.httpOptions);
  }

  getShelvesPaging(sort: string, page: string): Observable<any> {
    let url = this.SHELVES_API_URL;
    url = this.httpRequestService.addUrlConditions(url, sort, page);
    return this.http.get<any>(url);
  }

  getShelvesByBookId(bookId: number): Observable<any> {
    const url = this.BOOK_ID_SHELVES_API_URL + bookId;
    return this.http.get<any>(url, this.httpOptions);
  }

  getShelvesByShelfId(shelfId: string): Observable<any> {
    const url = this.SHELF_ID_SHELVES_API_URL + shelfId;
    return this.http.get<any>(url, this.httpOptions);
  }

  registerShelf(userId: number, shelfName: string, description: string): Observable<any> {
    const url = this.SHELVES_API_URL;
    const body = {user: userId, shelf_name: shelfName, description};
    return this.http.post<any>(url, body, this.httpOptions);
  }

  updateShelf(shelfId: number, userId: number, shelfName: string, description: string): Observable<any> {
    const url = this.SHELF_API_URL + shelfId + '/';
    const body = {user: userId, shelf_name: shelfName, description};
    return this.http.put<any>(url, body, this.httpOptions);
  }

  reportShelf(userId: number, shelfId: number, reasonCode: string) {
    const url = this.SHELF_REPORTS_API_URL;
    const body = {
      user: userId,
      shelf: shelfId,
      reason_code: reasonCode
    };
    return this.http.post<any>(url, body, this.httpOptions);
  }

  deleteShelf(shelfId: number) {
    const url = this.SHELF_API_URL + shelfId + '/';
    return this.http.delete<any>(url, this.httpOptions);
  }

  convertShelf(shelf: any, bookCount: number): Shelf {
    const userForShelf = this.userService.convertUser(shelf.user);
    const booksForShelf = [];
    shelf.books.forEach((book, index) => {
      if (index < bookCount) {
        const convertedBook = this.bookService.convertBook(book);
        booksForShelf.push(convertedBook);
      }
    });
    const favoriteUserCount = Object.keys(shelf.favorite_users).length;
    const commentUserCount = Object.keys(shelf.comment_users).length;
    return new Shelf(shelf.id, userForShelf, booksForShelf, shelf.shelf_cd, shelf.shelf_name, shelf.display_order,
      shelf.shelf_status, shelf.description, shelf.favorite_users, shelf.comment_users, favoriteUserCount, commentUserCount,
      shelf.report_users);
  }

  convertShelves(shelves: any[], bookCount: number): Shelf[] {
    const convertedShelves = [];
    shelves.forEach(shelf => {
      const convertedShelf = this.convertShelf(shelf, bookCount);
      convertedShelves.push(convertedShelf);
    });
    return convertedShelves;
  }
}
