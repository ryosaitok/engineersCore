import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpRequestService {

  constructor() {
  }

  appendUrlConditions(url: string, sort: string, page: string): string {
    if (sort !== undefined && sort !== null) {
      url += '&sort=' + sort;
    }
    if (page !== undefined && page !== null) {
      url += '&page=' + page;
    }
    return url;
  }
}
