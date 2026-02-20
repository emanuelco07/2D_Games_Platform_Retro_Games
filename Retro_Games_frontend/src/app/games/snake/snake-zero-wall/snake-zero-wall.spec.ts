import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnakeZeroWall } from './snake-zero-wall';

describe('SnakeZeroWall', () => {
  let component: SnakeZeroWall;
  let fixture: ComponentFixture<SnakeZeroWall>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SnakeZeroWall]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SnakeZeroWall);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
