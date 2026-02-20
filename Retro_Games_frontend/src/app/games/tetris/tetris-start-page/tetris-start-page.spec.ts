import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TetrisStartPage } from './tetris-start-page';

describe('TetrisStartPage', () => {
  let component: TetrisStartPage;
  let fixture: ComponentFixture<TetrisStartPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TetrisStartPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TetrisStartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
