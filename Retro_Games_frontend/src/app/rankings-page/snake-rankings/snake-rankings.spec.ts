import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnakeRankings } from './snake-rankings';

describe('SnakeRankings', () => {
  let component: SnakeRankings;
  let fixture: ComponentFixture<SnakeRankings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SnakeRankings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SnakeRankings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
