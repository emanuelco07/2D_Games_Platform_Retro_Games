import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Brickbreaker1 } from './brickbreaker1';

describe('Brickbreaker1', () => {
  let component: Brickbreaker1;
  let fixture: ComponentFixture<Brickbreaker1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Brickbreaker1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Brickbreaker1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
