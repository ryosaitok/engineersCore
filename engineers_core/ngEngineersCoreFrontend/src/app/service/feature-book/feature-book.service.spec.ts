import { TestBed } from '@angular/core/testing';

import { FeatureBookService } from './feature-book.service';

describe('FeatureBookService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FeatureBookService = TestBed.get(FeatureBookService);
    expect(service).toBeTruthy();
  });
});
