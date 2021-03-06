import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

import {InterestedBook} from '../../dto/interested-book/interested-book';
import {SigninService} from '../signin/signin.service';
import {UserService} from '../user/user.service';
import {BookService} from '../book/book.service';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InterestedBookService {

  HOST = environment.apiUrl;
  INTERESTED_BOOKS_API_URL = this.HOST + 'api/interested/books/';
  ACCOUNT_NAME_INTERESTED_BOOKS_API_URL = this.HOST + 'api/interested/books/?account_name=';
  INTERESTED_BOOK_API_URL = this.HOST + 'api/interested/book/';
  httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(
    private http: HttpClient,
    private signinService: SigninService,
    private userService: UserService,
    private bookService: BookService,
  ) {
  }

  getInterestedBook(userId: number, bookId: number): Observable<any> {
    const url = this.INTERESTED_BOOKS_API_URL + '?user_id=' + userId + '&book_id=' + bookId;
    return this.http.get<any>(url, {headers: this.httpHeaders});
  }

  getUserInterestedBook(userId: number): Observable<any> {
    const url = this.INTERESTED_BOOKS_API_URL + '?user_id=' + userId;
    return this.http.get<any>(url, {headers: this.httpHeaders});
  }

  getInterestedBookByAccountName(accountName: string): Observable<any> {
    const url = this.ACCOUNT_NAME_INTERESTED_BOOKS_API_URL + accountName;
    return this.http.get<any>(url, {headers: this.httpHeaders});
  }

  getBookInterested(bookId: number): Observable<any> {
    const url = this.INTERESTED_BOOKS_API_URL + '?book_id=' + bookId;
    return this.http.get<any>(url, {headers: this.httpHeaders});
  }

  registerInterestedBook(userId: number, bookId: number): Observable<any> {
    const body = {
      user: userId,
      book: bookId,
    };
    const httpHeaders = this.signinService.appendJwtHeader(this.httpHeaders);
    return this.http.post<any>(this.INTERESTED_BOOKS_API_URL, body, {headers: httpHeaders});
  }

  deleteInterestedBook(interestedBookId: number): Observable<any> {
    const url = this.INTERESTED_BOOK_API_URL + interestedBookId + '/';
    const httpHeaders = this.signinService.appendJwtHeader(this.httpHeaders);
    return this.http.delete<any>(url, {headers: httpHeaders});
  }

  convertInterestedBook(interestedBook: any): InterestedBook {
    const userForInterested = this.userService.convertUser(interestedBook.user);
    const bookForInterested = this.bookService.convertBook(interestedBook.book);
    return new InterestedBook(interestedBook.id, userForInterested, bookForInterested, interestedBook.interested_date);
  }

  convertInterestedBooks(interestedBooks: any[]): InterestedBook[] {
    const convertedInterestedBooks = [];
    interestedBooks.forEach(interested => {
      const interestedBook = this.convertInterestedBook(interested);
      convertedInterestedBooks.push(interestedBook);
    });
    return convertedInterestedBooks;
  }
}
