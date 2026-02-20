import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Snake1 } from './snake1';

describe('Snake1', () => {
  let component: Snake1;
  let fixture: ComponentFixture<Snake1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Snake1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Snake1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
