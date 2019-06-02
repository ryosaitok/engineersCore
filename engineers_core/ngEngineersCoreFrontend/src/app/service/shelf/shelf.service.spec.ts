import { TestBed } from '@angular/core/testing';

import { ShelfService } from './shelf.service';

describe('ShelfService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShelfService = TestBed.get(ShelfService);
    expect(service).toBeTruthy();
  });
});
