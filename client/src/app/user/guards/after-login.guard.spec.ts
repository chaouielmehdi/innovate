import { TestBed } from '@angular/core/testing';

import { AfterLoginGuard } from './after-login.guard';

describe('AfterLoginGuard', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AfterLoginGuard = TestBed.get(AfterLoginGuard);
    expect(service).toBeTruthy();
  });
});
