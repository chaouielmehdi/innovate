import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawersComponent } from './drawers.component';

describe('DrawersComponent', () => {
  let component: DrawersComponent;
  let fixture: ComponentFixture<DrawersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
