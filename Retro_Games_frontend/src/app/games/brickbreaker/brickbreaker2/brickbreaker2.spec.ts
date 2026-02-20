import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Brickbreaker2 } from './brickbreaker2';

describe('Brickbreaker2', () => {
  let component: Brickbreaker2;
  let fixture: ComponentFixture<Brickbreaker2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Brickbreaker2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Brickbreaker2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
