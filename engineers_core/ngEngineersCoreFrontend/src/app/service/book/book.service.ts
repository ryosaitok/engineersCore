import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {HttpRequestService} from '../http-request/http-request.service';
import {BookComment} from "../../dto/book-comment/book-comment";
import {User} from "../../dto/user/user";
import {AmazonBook} from "../../dto/amazon-book/amazon-book";
import {Author} from "../../dto/author/author";
import {Book} from "../../dto/book/book";

@Injectable({providedIn: 'root'})
export class BookService {

  constructor(
    private http: HttpClient,
    private httpRequestService: HttpRequestService
  ) {
  }

  host = 'http://127.0.0.1:8000/';
  booksUrl = 'api/books/';
  titleBooksUrl = 'api/books/?title=';
  authorNameBooksUrl = 'api/books/?author=';
  bookUrl = 'api/book/';

  getBooks(): Observable<any> {
    return this.http.get<any>(this.host + this.booksUrl);
  }

  getBooksLikeTitle(title: string, sort: string, page: string): Observable<any> {
    let url = this.host + this.titleBooksUrl + title;
    url = this.httpRequestService.appendUrlConditions(url, sort, page);
    return this.http.get<any>(url);
  }

  getBooksLikeAuthorName(authorName: string, sort: string, page: string): Observable<any> {
    let url = this.host + this.authorNameBooksUrl + authorName;
    url = this.httpRequestService.appendUrlConditions(url, sort, page);
    return this.http.get<any>(url);
  }

  getBook(id): Observable<any> {
    return this.http.get<any>(this.host + this.bookUrl + id + '/');
  }

  convertBook(book: any): Book {
    const amazonBook = book.amazon_book[0];
    const amazonBookForComment = new AmazonBook(amazonBook.id, amazonBook.book, amazonBook.data_asin, amazonBook.sales_rank);
    const authorsForComment = [];
    book.authors.forEach(author => authorsForComment.push(new Author(author.id, author.author_name)));
    return new Book(book.id, book.title, book.book_status, book.sale_date, book.pages_count,
      book.offer_price, amazonBookForComment, authorsForComment);
  }
}
