import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Shelf} from '../../dto/shelf/shelf';
import {User} from '../../dto/user/user';
import {AmazonBook} from '../../dto/amazon-book/amazon-book';
import {Author} from '../../dto/author/author';
import {Book} from '../../dto/book/book';
import {BookService} from '../book/book.service';
import {UserService} from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class ShelfService {

  host = 'http://127.0.0.1:8000/';
  shelfUrl = 'api/shelf/';
  shelfAPIUrl = this.host + this.shelfUrl;
  shelvesUrl = 'api/shelves/';
  shelvesAPIUrl = this.host + this.shelvesUrl;
  bookIdShelvesUrl = 'api/shelves/?book_id=';
  bookIdShelvesAPIUrl = this.host + this.bookIdShelvesUrl;
  shelfIdShelvesUrl = 'api/shelves/?shelf_id=';
  shelfIdShelvesAPIUrl = this.host + this.shelfIdShelvesUrl;
  shelfReportsUrl = 'api/shelf/reports';
  shelfReportsAPIUrl = this.host + this.shelfReportsUrl;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(
    private http: HttpClient,
    private bookService: BookService,
    private userService: UserService,
  ) {
  }

  getShelf(shelfId: number): Observable<any> {
    const url = this.shelfAPIUrl + shelfId + '/';
    return this.http.get<any>(url, this.httpOptions);
  }

  getShelves(): Observable<any> {
    const url = this.shelvesAPIUrl;
    return this.http.get<any>(url, this.httpOptions);
  }

  getShelvesByBookId(bookId: number): Observable<any> {
    const url = this.bookIdShelvesAPIUrl + bookId;
    return this.http.get<any>(url, this.httpOptions);
  }

  getShelvesByShelfId(shelfId: string): Observable<any> {
    const url = this.shelfIdShelvesAPIUrl + shelfId;
    return this.http.get<any>(url, this.httpOptions);
  }

  updateShelf(shelfId: number, shelfName: string, description): Observable<any> {
    const url = this.shelfAPIUrl + shelfId + '/';
    const body = {id: shelfId, shelf_name: shelfName, description};
    return this.http.put<any>(url, body, this.httpOptions);
  }

  reportShelf(userId: number, shelfId: number, reasonCode: string) {
    const url = this.shelfReportsAPIUrl;
    const body = {
      user: userId,
      shelf: shelfId,
      reason_code: reasonCode
    };
    return this.http.post<any>(url, body, this.httpOptions);
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
