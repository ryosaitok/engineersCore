import { TestBed } from '@angular/core/testing';

import { BookCommentReplyService } from './book-comment-reply.service';

describe('BookCommentReplyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BookCommentReplyService = TestBed.get(BookCommentReplyService);
    expect(service).toBeTruthy();
  });
});
