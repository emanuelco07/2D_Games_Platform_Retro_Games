import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Brickbreakertwo3 } from './brickbreakertwo3';

describe('Brickbreakertwo3', () => {
  let component: Brickbreakertwo3;
  let fixture: ComponentFixture<Brickbreakertwo3>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Brickbreakertwo3]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Brickbreakertwo3);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
