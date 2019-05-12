import { TestBed } from '@angular/core/testing';

import { ReadBookService } from './read-book.service';

describe('ReadBookService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReadBookService = TestBed.get(ReadBookService);
    expect(service).toBeTruthy();
  });
});
