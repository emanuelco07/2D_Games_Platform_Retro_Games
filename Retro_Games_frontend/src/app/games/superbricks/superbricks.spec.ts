import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Superbricks } from './superbricks';

describe('Superbricks', () => {
  let component: Superbricks;
  let fixture: ComponentFixture<Superbricks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Superbricks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Superbricks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
