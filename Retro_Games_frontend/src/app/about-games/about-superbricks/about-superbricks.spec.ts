import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutSuperbricks } from './about-superbricks';

describe('AboutSuperbricks', () => {
  let component: AboutSuperbricks;
  let fixture: ComponentFixture<AboutSuperbricks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutSuperbricks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutSuperbricks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
