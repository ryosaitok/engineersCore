import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeatureBookService {

  host = 'http://127.0.0.1:8000/';
  bookFeatureUrl = 'api/bookfeature/';
  bookFeatureUrlAPIUrl = this.host + this.bookFeatureUrl;
  bookFeaturesUrl = 'api/bookfeatures/';
  bookFeaturesUrlAPIUrl = this.host + this.bookFeaturesUrl;
  bookIdBookFeaturesUrl = 'api/bookfeatures/?book_id=';
  bookIdBookFeaturesAPIUrl = this.host + this.bookIdBookFeaturesUrl;
  categoryIdBookFeaturesUrl = 'api/bookfeatures/?category_id=';
  categoryIdBookFeaturesAPIUrl = this.host + this.categoryIdBookFeaturesUrl;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(
    private http: HttpClient,
  ) { }

  getBookFeature(bookFeatureId: number): Observable<any> {
    const url = this.bookFeatureUrlAPIUrl + bookFeatureId + '/';
    return this.http.get<any>(url, this.httpOptions);
  }

  getBookFeatures(): Observable<any> {
    const url = this.bookFeaturesUrlAPIUrl;
    return this.http.get<any>(url, this.httpOptions);
  }

  getBookFeaturesByBookId(bookId: number): Observable<any> {
    const url = this.bookIdBookFeaturesAPIUrl + bookId;
    return this.http.get<any>(url, this.httpOptions);
  }

  getBookFeaturesByCategoryId(categoryId: number): Observable<any> {
    const url = this.categoryIdBookFeaturesAPIUrl + categoryId;
    return this.http.get<any>(url, this.httpOptions);
  }
}
