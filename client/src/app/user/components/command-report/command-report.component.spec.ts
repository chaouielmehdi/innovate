import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandReportComponent } from './command-report.component';

describe('CommandReportComponent', () => {
  let component: CommandReportComponent;
  let fixture: ComponentFixture<CommandReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommandReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommandReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
