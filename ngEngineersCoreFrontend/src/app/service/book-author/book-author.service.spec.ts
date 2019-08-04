import { TestBed } from '@angular/core/testing';

import { BookAuthorService } from './book-author.service';

describe('BookAuthorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BookAuthorService = TestBed.get(BookAuthorService);
    expect(service).toBeTruthy();
  });
});
