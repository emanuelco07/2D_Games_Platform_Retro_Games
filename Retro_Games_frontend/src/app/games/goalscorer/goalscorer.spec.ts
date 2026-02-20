import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Goalscorer } from './goalscorer';

describe('Goalscorer', () => {
  let component: Goalscorer;
  let fixture: ComponentFixture<Goalscorer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Goalscorer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Goalscorer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
