import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Snake3 } from './snake3';

describe('Snake3', () => {
  let component: Snake3;
  let fixture: ComponentFixture<Snake3>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Snake3]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Snake3);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
