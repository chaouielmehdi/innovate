import { TestBed } from '@angular/core/testing';
import { BeforeLoginGuard } from './before-login.guard';

describe('BeforeLoginGuard', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BeforeLoginGuard = TestBed.get(BeforeLoginGuard);
    expect(service).toBeTruthy();
  });
});
