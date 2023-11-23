import { TestBed } from '@angular/core/testing';

import { StylesManagerService } from './styles-manager.service';

describe('StylesManagerService', () => {
  let service: StylesManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StylesManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
