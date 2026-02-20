import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrickbreakerHeart } from './brickbreaker-heart';

describe('BrickbreakerHeart', () => {
  let component: BrickbreakerHeart;
  let fixture: ComponentFixture<BrickbreakerHeart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrickbreakerHeart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrickbreakerHeart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
