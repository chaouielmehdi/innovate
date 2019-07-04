import { TestBed } from '@angular/core/testing';
import { StatisticService } from './statistics.service';


describe('StatisticsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StatisticService = TestBed.get(StatisticService);
    expect(service).toBeTruthy();
  });
});
