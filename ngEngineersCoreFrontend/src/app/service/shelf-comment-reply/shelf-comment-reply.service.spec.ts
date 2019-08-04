import { TestBed } from '@angular/core/testing';

import { ShelfCommentReplyService } from './shelf-comment-reply.service';

describe('ShelfCommentReplyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShelfCommentReplyService = TestBed.get(ShelfCommentReplyService);
    expect(service).toBeTruthy();
  });
});
