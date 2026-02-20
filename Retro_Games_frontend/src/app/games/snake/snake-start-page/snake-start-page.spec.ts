import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnakeStartPage } from './snake-start-page';

describe('SnakeStartPage', () => {
  let component: SnakeStartPage;
  let fixture: ComponentFixture<SnakeStartPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SnakeStartPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SnakeStartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
