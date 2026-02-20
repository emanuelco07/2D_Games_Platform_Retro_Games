import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperbricksStartPage } from './superbricks-start-page';

describe('SuperbricksStartPage', () => {
  let component: SuperbricksStartPage;
  let fixture: ComponentFixture<SuperbricksStartPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperbricksStartPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuperbricksStartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
