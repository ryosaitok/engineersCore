import { TestBed } from '@angular/core/testing';

import { ShelfCommentFavoriteService } from './shelf-comment-favorite.service';

describe('ShelfCommentFavoriteService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShelfCommentFavoriteService = TestBed.get(ShelfCommentFavoriteService);
    expect(service).toBeTruthy();
  });
});
