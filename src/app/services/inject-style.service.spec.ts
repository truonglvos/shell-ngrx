import { TestBed } from '@angular/core/testing';

import { InjectStyleService } from './inject-style.service';

describe('InjectStyleService', () => {
  let service: InjectStyleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InjectStyleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
