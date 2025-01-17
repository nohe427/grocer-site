import { TestBed } from '@angular/core/testing';

import { CustomerAgentService } from './customer-agent.service';

describe('CustomerAgentService', () => {
  let service: CustomerAgentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerAgentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
