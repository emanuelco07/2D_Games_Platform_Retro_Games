import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutTetris } from './about-tetris';

describe('AboutTetris', () => {
  let component: AboutTetris;
  let fixture: ComponentFixture<AboutTetris>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutTetris]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutTetris);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
