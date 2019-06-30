import { TestBed } from '@angular/core/testing';

import { BookCommentReplyFavoriteService } from './book-comment-reply-favorite.service';

describe('BookCommentReplyFavoriteService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BookCommentReplyFavoriteService = TestBed.get(BookCommentReplyFavoriteService);
    expect(service).toBeTruthy();
  });
});
