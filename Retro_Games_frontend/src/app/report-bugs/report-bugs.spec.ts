import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportBugs } from './report-bugs';

describe('ReportBugs', () => {
  let component: ReportBugs;
  let fixture: ComponentFixture<ReportBugs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportBugs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportBugs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
