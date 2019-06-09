import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Shelf} from '../../dto/shelf/shelf';
import {User} from '../../dto/user/user';
import {AmazonBook} from '../../dto/amazon-book/amazon-book';
import {Author} from '../../dto/author/author';
import {Book} from '../../dto/book/book';

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
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(
    private http: HttpClient,
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

  convertShelves(shelves: any[], bookCount: number): Shelf[] {
    const convertedShelves = [];
    shelves.forEach(shelf => {
      const user = shelf.user;
      const userForShelf = new User(user.id, user.user_name, user.account_name, user.description, user.profile_image_link);
      const booksForShelf = [];
      shelf.books.forEach((book, index) => {
        if (index < bookCount) {
          const amazonBook = book.amazon_book[0];
          const amazonBookForShelf = new AmazonBook(amazonBook.id, amazonBook.book, amazonBook.data_asin, amazonBook.sales_rank);
          const authorsForShelf = [];
          book.authors.forEach(author => authorsForShelf.push(new Author(author.id, author.author_name)));
          booksForShelf.push(new Book(book.id, book.title, book.book_status, book.sale_date, book.pages_count,
            book.offer_price, amazonBookForShelf, authorsForShelf));
        }
      });
      const favoriteUserCount = Object.keys(shelf.favorite_users).length;
      const commentUserCount = Object.keys(shelf.comment_users).length;
      convertedShelves.push(
        new Shelf(shelf.id, userForShelf, booksForShelf, shelf.shelf_cd, shelf.shelf_name, shelf.display_order,
          shelf.shelf_status, shelf.description, shelf.favorite_users, shelf.comment_users, favoriteUserCount, commentUserCount)
      );
    });
    return convertedShelves;
  }

  convertShelf(shelf: any, bookCount: number): Shelf {
    const user = shelf.user;
    const userForShelf = new User(user.id, user.user_name, user.account_name, user.description, user.profile_image_link);
    const booksForShelf = [];
    shelf.books.forEach((book, index) => {
      if (index < bookCount) {
        const amazonBook = book.amazon_book[0];
        const amazonBookForShelf = new AmazonBook(amazonBook.id, amazonBook.book, amazonBook.data_asin, amazonBook.sales_rank);
        const authorsForShelf = [];
        book.authors.forEach(author => authorsForShelf.push(new Author(author.id, author.author_name)));
        booksForShelf.push(new Book(book.id, book.title, book.book_status, book.sale_date, book.pages_count,
          book.offer_price, amazonBookForShelf, authorsForShelf));
      }
    });
    const favoriteUserCount = Object.keys(shelf.favorite_users).length;
    const commentUserCount = Object.keys(shelf.comment_users).length;
    return new Shelf(shelf.id, userForShelf, booksForShelf, shelf.shelf_cd, shelf.shelf_name, shelf.display_order,
      shelf.shelf_status, shelf.description, shelf.favorite_users, shelf.comment_users, favoriteUserCount, commentUserCount);
  }

  getShelvesByBookId(bookId: number): Observable<any> {
    const url = this.bookIdShelvesAPIUrl + bookId;
    return this.http.get<any>(url, this.httpOptions);
  }

  getShelvesByShelfId(shelfId: string): Observable<any> {
    const url = this.shelfIdShelvesAPIUrl + shelfId;
    return this.http.get<any>(url, this.httpOptions);
  }
}
