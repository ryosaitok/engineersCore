import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeatureBookCategoryService {
  host = 'http://127.0.0.1:8000/';
  bookFeatureCategoryUrl = 'api/bookfeaturecategory/';
  bookFeatureCategoryAPIUrl = this.host + this.bookFeatureCategoryUrl;
  bookFeatureCategoriesUrl = 'api/bookfeaturecategories/';
  bookFeatureCategoriesAPIUrl = this.host + this.bookFeatureCategoriesUrl;
  bookIdBookFeatureCategoriesUrl = 'api/bookfeaturecategories/?book_id=';
  bookIdBookFeatureCategoriesAPIUrl = this.host + this.bookIdBookFeatureCategoriesUrl;
  categoryCdBookFeatureCategoriesUrl = 'api/bookfeaturecategories/?category_cd=';
  categoryCdBookFeatureCategoriesAPIUrl = this.host + this.categoryCdBookFeatureCategoriesUrl;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(
    private http: HttpClient,
  ) { }

  getBookFeatureCaetgory(categoryId: number): Observable<any> {
    const url = this.bookFeatureCategoryAPIUrl + categoryId + '/';
    return this.http.get<any>(url, this.httpOptions);
  }

  getBookFeatureCategories(): Observable<any> {
    const url = this.bookFeatureCategoriesAPIUrl;
    return this.http.get<any>(url, this.httpOptions);
  }

  getBookFeatureCategoryByCd(categoryCd: string): Observable<any> {
    const url = this.categoryCdBookFeatureCategoriesAPIUrl + categoryCd;
    return this.http.get<any>(url, this.httpOptions);
  }

  getBookFeatureCaetgoriesByBookId(bookId: number): Observable<any> {
    const url = this.bookIdBookFeatureCategoriesAPIUrl + bookId;
    return this.http.get<any>(url, this.httpOptions);
  }
}
