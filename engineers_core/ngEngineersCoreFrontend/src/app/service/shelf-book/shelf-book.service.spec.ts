import { TestBed } from '@angular/core/testing';

import { ShelfBookService } from './shelf-book.service';

describe('ShelfBookService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShelfBookService = TestBed.get(ShelfBookService);
    expect(service).toBeTruthy();
  });
});
