import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookAuthorService {

  constructor(
    private http: HttpClient,
  ) {}

  HOST = environment.apiUrl;
  BOOK_AUTHORS_API_URL = this.HOST + 'api/book/authors/';

  getBookAuthors(bookId): Observable<any> {
    return this.http.get<any>(this.BOOK_AUTHORS_API_URL + '?book_id=' + bookId);
  }

  getBookAuthor(id): Observable<any> {
    return this.http.get<any>(this.BOOK_AUTHORS_API_URL + id + '/');
  }
}
