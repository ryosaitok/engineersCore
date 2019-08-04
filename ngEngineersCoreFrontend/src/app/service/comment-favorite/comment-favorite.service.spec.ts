import { TestBed } from '@angular/core/testing';

import { CommentFavoriteService } from './comment-favorite.service';

describe('CommentFavoriteService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CommentFavoriteService = TestBed.get(CommentFavoriteService);
    expect(service).toBeTruthy();
  });
});
