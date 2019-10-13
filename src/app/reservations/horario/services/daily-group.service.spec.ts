import { TestBed } from '@angular/core/testing';

import { DailyGroupService } from './daily-group.service';

describe('DailyGroupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DailyGroupService = TestBed.get(DailyGroupService);
    expect(service).toBeTruthy();
  });
});
