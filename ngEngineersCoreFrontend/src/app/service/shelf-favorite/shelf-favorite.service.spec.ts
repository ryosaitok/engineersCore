import { TestBed } from '@angular/core/testing';

import { ShelfFavoriteService } from './shelf-favorite.service';

describe('ShelfFavoriteService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShelfFavoriteService = TestBed.get(ShelfFavoriteService);
    expect(service).toBeTruthy();
  });
});
