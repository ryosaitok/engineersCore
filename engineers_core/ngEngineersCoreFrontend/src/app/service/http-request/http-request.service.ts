import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpRequestService {

  constructor() {
  }

  appendUrlConditions(url: string, sort: string, page: string): string {
    if (sort !== undefined) {
      url += '&sort=' + sort;
    }
    if (page !== undefined) {
      url += '&page=' + page;
    }
    return url;
  }
}
