import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpRequestService {

  constructor() {
  }

  addUrlConditions(url: string, sort: string, page: string): string {
    if (sort !== null && page !== null) {
      url += '?sort=' + sort + '&page=' + page;
    } else if (page !== null) {
      url += '?page=' + page;
    } else if (sort !== null) {
      url += '?sort=' + sort;
    }
    return url;
  }

  appendUrlConditions(url: string, sort: string, page: string): string {
    if (sort !== null) {
      url += '&sort=' + sort;
    }
    if (page !== null) {
      url += '&page=' + page;
    }
    return url;
  }
}
