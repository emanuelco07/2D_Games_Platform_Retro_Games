import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Snake2 } from './snake2';

describe('Snake2', () => {
  let component: Snake2;
  let fixture: ComponentFixture<Snake2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Snake2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Snake2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
