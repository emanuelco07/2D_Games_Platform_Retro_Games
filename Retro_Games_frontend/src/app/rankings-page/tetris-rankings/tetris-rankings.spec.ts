import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TetrisRankings } from './tetris-rankings';

describe('TetrisRankings', () => {
  let component: TetrisRankings;
  let fixture: ComponentFixture<TetrisRankings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TetrisRankings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TetrisRankings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
