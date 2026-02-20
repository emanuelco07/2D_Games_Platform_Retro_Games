import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrickbreakerStartPage } from './brickbreaker-start-page';

describe('BrickbreakerStartPage', () => {
  let component: BrickbreakerStartPage;
  let fixture: ComponentFixture<BrickbreakerStartPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrickbreakerStartPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrickbreakerStartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
