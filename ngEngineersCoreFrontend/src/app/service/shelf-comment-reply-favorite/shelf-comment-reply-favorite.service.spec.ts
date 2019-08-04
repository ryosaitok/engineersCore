import { TestBed } from '@angular/core/testing';

import { ShelfCommentReplyFavoriteService } from './shelf-comment-reply-favorite.service';

describe('ShelfCommentReplyFavoriteService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShelfCommentReplyFavoriteService = TestBed.get(ShelfCommentReplyFavoriteService);
    expect(service).toBeTruthy();
  });
});
