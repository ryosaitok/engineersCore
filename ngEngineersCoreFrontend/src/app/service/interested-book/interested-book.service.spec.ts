import { TestBed } from '@angular/core/testing';

import { InterestedBookService } from './interested-book.service';

describe('InterestedBookService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InterestedBookService = TestBed.get(InterestedBookService);
    expect(service).toBeTruthy();
  });
});
