import { TestBed } from '@angular/core/testing';

import { KonakartService } from './konakart-service.service';

describe('KonakartServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: KonakartService = TestBed.get(KonakartService);
    expect(service).toBeTruthy();
  });
});
