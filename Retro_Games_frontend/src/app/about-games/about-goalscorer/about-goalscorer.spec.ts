import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutGoalscorer } from './about-goalscorer';

describe('AboutGoalscorer', () => {
  let component: AboutGoalscorer;
  let fixture: ComponentFixture<AboutGoalscorer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutGoalscorer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutGoalscorer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
