import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Brickbreakertwo1 } from './brickbreakertwo1';

describe('Brickbreakertwo1', () => {
  let component: Brickbreakertwo1;
  let fixture: ComponentFixture<Brickbreakertwo1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Brickbreakertwo1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Brickbreakertwo1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
