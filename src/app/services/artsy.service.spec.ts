import { TestBed } from '@angular/core/testing';

import { ArtsyService } from './artsy.service';

describe('ArtsyService', () => {
  let service: ArtsyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArtsyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
