import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandDetailsComponent } from './command-details.component';

describe('CommandDetailsComponent', () => {
  let component: CommandDetailsComponent;
  let fixture: ComponentFixture<CommandDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommandDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommandDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
