import { TestBed } from '@angular/core/testing';

import { BookCommentService } from './book-comment.service';

describe('BooksCommentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BookCommentService = TestBed.get(BookCommentService);
    expect(service).toBeTruthy();
  });
});
