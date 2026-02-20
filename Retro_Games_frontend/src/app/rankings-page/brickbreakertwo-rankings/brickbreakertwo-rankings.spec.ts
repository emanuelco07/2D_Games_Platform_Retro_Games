import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrickbreakertwoRankings } from './brickbreakertwo-rankings';

describe('BrickbreakertwoRankings', () => {
  let component: BrickbreakertwoRankings;
  let fixture: ComponentFixture<BrickbreakertwoRankings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrickbreakertwoRankings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrickbreakertwoRankings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
