import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrickbreakertwoHeart } from './brickbreakertwo-heart';

describe('BrickbreakertwoHeart', () => {
  let component: BrickbreakertwoHeart;
  let fixture: ComponentFixture<BrickbreakertwoHeart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrickbreakertwoHeart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrickbreakertwoHeart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
