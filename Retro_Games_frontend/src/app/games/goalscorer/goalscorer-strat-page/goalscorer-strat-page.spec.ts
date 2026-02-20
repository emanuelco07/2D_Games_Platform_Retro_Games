import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalscorerStratPage } from './goalscorer-strat-page';

describe('GoalscorerStratPage', () => {
  let component: GoalscorerStratPage;
  let fixture: ComponentFixture<GoalscorerStratPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoalscorerStratPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoalscorerStratPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
