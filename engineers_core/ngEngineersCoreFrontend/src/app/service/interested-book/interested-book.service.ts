import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

import {User} from '../../dto/user/user';
import {AmazonBook} from '../../dto/amazon-book/amazon-book';
import {Author} from '../../dto/author/author';
import {Book} from '../../dto/book/book';
import {InterestedBook} from '../../dto/interested-book/interested-book';
import {SigninService} from '../signin/signin.service';
import {UserService} from '../user/user.service';
import {BookService} from '../book/book.service';

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
    private userService: UserService,
    private bookService: BookService,
  ) {
  }

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
    };
    return this.http.post<any>(this.interestedBooksAPIUrl, body, this.httpOptions);
  }

  deleteInterestedBook(interestedBookId: number): Observable<any> {
    const url = this.interestedBookAPIUrl + interestedBookId + '/';
    const jwtHeader = this.signinService.createJwtHeaderFromLocalStorage();
    return this.http.delete<any>(url, {headers: jwtHeader});
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
