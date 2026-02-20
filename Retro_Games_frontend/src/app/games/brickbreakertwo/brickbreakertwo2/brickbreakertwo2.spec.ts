import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Brickbreakertwo2 } from './brickbreakertwo2';

describe('Brickbreakertwo2', () => {
  let component: Brickbreakertwo2;
  let fixture: ComponentFixture<Brickbreakertwo2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Brickbreakertwo2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Brickbreakertwo2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
