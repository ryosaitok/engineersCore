import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

import {Shelf} from '../../dto/shelf/shelf';
import {HttpRequestService} from '../http-request/http-request.service';
import {SigninService} from '../signin/signin.service';
import {BookService} from '../book/book.service';
import {UserService} from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class ShelfService {

  HOST = 'http://127.0.0.1:8000/';
  SHELF_API_URL = this.HOST + 'api/shelf/';
  SHELVES_API_URL = this.HOST + 'api/shelves/';
  BOOK_ID_SHELVES_API_URL = this.HOST + 'api/shelves/?book_id=';
  USER_ID_SHELVES_API_URL = this.HOST + 'api/shelves/?user_id=';
  ACCOUNT_NAME_SHELVES_API_URL = this.HOST + 'api/shelves/?account_name=';
  SHELF_ID_SHELVES_API_URL = this.HOST + 'api/shelves/?shelf_id=';
  SHELF_REPORTS_API_URL = this.HOST + 'api/shelf/reports/';
  httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(
    private http: HttpClient,
    private httpRequestService: HttpRequestService,
    private signinService: SigninService,
    private bookService: BookService,
    private userService: UserService,
  ) {
  }

  getShelf(shelfId: number): Observable<any> {
    const url = this.SHELF_API_URL + shelfId + '/';
    return this.http.get<any>(url, {headers: this.httpHeaders});
  }

  getShelves(): Observable<any> {
    const url = this.SHELVES_API_URL;
    return this.http.get<any>(url, {headers: this.httpHeaders});
  }

  getShelvesPaging(sort: string, page: string): Observable<any> {
    let url = this.SHELVES_API_URL;
    url = this.httpRequestService.addUrlConditions(url, sort, page);
    return this.http.get<any>(url);
  }

  getShelvesByBookId(bookId: number): Observable<any> {
    const url = this.BOOK_ID_SHELVES_API_URL + bookId;
    return this.http.get<any>(url, {headers: this.httpHeaders});
  }

  getShelvesByUserId(userId: number): Observable<any> {
    const url = this.USER_ID_SHELVES_API_URL + userId;
    return this.http.get<any>(url, {headers: this.httpHeaders});
  }

  getShelvesByAccountName(accountName: string): Observable<any> {
    const url = this.ACCOUNT_NAME_SHELVES_API_URL + accountName;
    return this.http.get<any>(url, {headers: this.httpHeaders});
  }

  getShelvesByShelfId(shelfId: string): Observable<any> {
    const url = this.SHELF_ID_SHELVES_API_URL + shelfId;
    return this.http.get<any>(url, {headers: this.httpHeaders});
  }

  registerShelf(userId: number, shelfName: string, description: string, shelfStatus: string): Observable<any> {
    const url = this.SHELVES_API_URL;
    const body = {user: userId, shelf_name: shelfName, description, shelf_status: shelfStatus};
    const httpHeaders = this.signinService.appendJwtHeader(this.httpHeaders);
    return this.http.post<any>(url, body, {headers: httpHeaders});
  }

  updateShelf(shelfId: number, userId: number, shelfName: string, description: string, shelfStatus: string): Observable<any> {
    const url = this.SHELF_API_URL + shelfId + '/';
    const body = {user: userId, shelf_name: shelfName, description, shelf_status: shelfStatus};
    const httpHeaders = this.signinService.appendJwtHeader(this.httpHeaders);
    return this.http.put<any>(url, body, {headers: httpHeaders});
  }

  reportShelf(userId: number, shelfId: number, reasonCode: string) {
    const url = this.SHELF_REPORTS_API_URL;
    const body = {
      user: userId,
      shelf: shelfId,
      reason_code: reasonCode
    };
    const httpHeaders = this.signinService.appendJwtHeader(this.httpHeaders);
    return this.http.post<any>(url, body, {headers: httpHeaders});
  }

  deleteShelf(shelfId: number) {
    const url = this.SHELF_API_URL + shelfId + '/';
    const httpHeaders = this.signinService.appendJwtHeader(this.httpHeaders);
    return this.http.delete<any>(url, {headers: httpHeaders});
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
