import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Brickbreaker3 } from './brickbreaker3';

describe('Brickbreaker3', () => {
  let component: Brickbreaker3;
  let fixture: ComponentFixture<Brickbreaker3>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Brickbreaker3]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Brickbreaker3);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
