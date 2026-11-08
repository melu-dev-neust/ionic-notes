import { TestBed } from '@angular/core/testing';
import { Haptics } from './haptics';

describe('Haptics', () => {
  let service: Haptics;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Haptics);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
