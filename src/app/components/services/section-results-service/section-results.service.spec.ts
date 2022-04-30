import { TestBed } from '@angular/core/testing';

import { SectionResultsService } from './section-results.service';

describe('SectionResultsService', () => {
  let service: SectionResultsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SectionResultsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
