import { TestBed } from '@angular/core/testing';

import { PageNotFoundService } from './page-not-found.service';

describe('PageNotFoundService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PageNotFoundService = TestBed.get(PageNotFoundService);
    expect(service).toBeTruthy();
  });
});
