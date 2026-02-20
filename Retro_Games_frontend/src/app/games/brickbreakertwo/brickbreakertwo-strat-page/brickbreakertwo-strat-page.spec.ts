import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrickbreakertwoStratPage } from './brickbreakertwo-strat-page';

describe('BrickbreakertwoStratPage', () => {
  let component: BrickbreakertwoStratPage;
  let fixture: ComponentFixture<BrickbreakertwoStratPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrickbreakertwoStratPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrickbreakertwoStratPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
