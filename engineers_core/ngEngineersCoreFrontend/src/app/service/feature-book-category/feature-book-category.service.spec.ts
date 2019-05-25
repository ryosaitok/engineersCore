import { TestBed } from '@angular/core/testing';

import { FeatureBookCategoryService } from './feature-book-category.service';

describe('FeatureBookCategoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FeatureBookCategoryService = TestBed.get(FeatureBookCategoryService);
    expect(service).toBeTruthy();
  });
});
