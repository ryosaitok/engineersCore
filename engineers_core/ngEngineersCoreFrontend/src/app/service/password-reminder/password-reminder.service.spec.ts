import { TestBed } from '@angular/core/testing';

import { PasswordReminderService } from './password-reminder.service';

describe('PasswordReminderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PasswordReminderService = TestBed.get(PasswordReminderService);
    expect(service).toBeTruthy();
  });
});
