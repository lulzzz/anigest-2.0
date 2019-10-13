import { TestBed } from '@angular/core/testing';

import { CustomEventTitleFormatter } from './custom-event-title-formatter.provider';

describe('CustomEventTitleFormatter', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CustomEventTitleFormatter = TestBed.get(CustomEventTitleFormatter);
    expect(service).toBeTruthy();
  });
});
