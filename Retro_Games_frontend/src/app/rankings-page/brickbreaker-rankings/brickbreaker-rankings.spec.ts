import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrickbreakerRankings } from './brickbreaker-rankings';

describe('BrickbreakerRankings', () => {
  let component: BrickbreakerRankings;
  let fixture: ComponentFixture<BrickbreakerRankings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrickbreakerRankings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrickbreakerRankings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
