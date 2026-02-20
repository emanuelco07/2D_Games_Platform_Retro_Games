import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperbricksRankings } from './superbricks-rankings';

describe('SuperbricksRankings', () => {
  let component: SuperbricksRankings;
  let fixture: ComponentFixture<SuperbricksRankings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperbricksRankings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuperbricksRankings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
