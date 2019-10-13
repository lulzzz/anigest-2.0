import { TestBed } from '@angular/core/testing';

import { ReservationService } from './reservation.service';

describe('ReservationServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReservationService = TestBed.get(ReservationService);
    expect(service).toBeTruthy();
  });
});
