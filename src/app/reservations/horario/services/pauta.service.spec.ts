import { TestBed } from '@angular/core/testing';

import { PautaService } from './pauta.service';

describe('PautaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PautaService = TestBed.get(PautaService);
    expect(service).toBeTruthy();
  });
});
