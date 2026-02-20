import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutBrickbreakertwo } from './about-brickbreakertwo';

describe('AboutBrickbreakertwo', () => {
  let component: AboutBrickbreakertwo;
  let fixture: ComponentFixture<AboutBrickbreakertwo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutBrickbreakertwo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutBrickbreakertwo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
