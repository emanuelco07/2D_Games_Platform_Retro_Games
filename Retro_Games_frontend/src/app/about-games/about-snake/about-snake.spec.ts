import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutSnake } from './about-snake';

describe('AboutSnake', () => {
  let component: AboutSnake;
  let fixture: ComponentFixture<AboutSnake>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutSnake]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutSnake);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
