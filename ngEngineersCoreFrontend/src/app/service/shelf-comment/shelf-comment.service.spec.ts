import { TestBed } from '@angular/core/testing';

import { ShelfCommentService } from './shelf-comment.service';

describe('ShelfCommentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShelfCommentService = TestBed.get(ShelfCommentService);
    expect(service).toBeTruthy();
  });
});
