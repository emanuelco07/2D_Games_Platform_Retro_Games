import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutBrickbreaker } from './about-brickbreaker';

describe('AboutBrickbreaker', () => {
  let component: AboutBrickbreaker;
  let fixture: ComponentFixture<AboutBrickbreaker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutBrickbreaker]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutBrickbreaker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
