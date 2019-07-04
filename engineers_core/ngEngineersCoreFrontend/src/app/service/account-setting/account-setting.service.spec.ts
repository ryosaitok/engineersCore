import { TestBed } from '@angular/core/testing';

import { AccountSettingService } from './account-setting.service';

describe('AccountSettingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AccountSettingService = TestBed.get(AccountSettingService);
    expect(service).toBeTruthy();
  });
});
