import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalscorerRankings } from './goalscorer-rankings';

describe('GoalscorerRankings', () => {
  let component: GoalscorerRankings;
  let fixture: ComponentFixture<GoalscorerRankings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoalscorerRankings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoalscorerRankings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
