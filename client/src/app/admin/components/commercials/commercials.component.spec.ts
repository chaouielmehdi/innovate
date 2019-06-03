import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommercialsComponent } from './commercials.component';

describe('CommercialsComponent', () => {
  let component: CommercialsComponent;
  let fixture: ComponentFixture<CommercialsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommercialsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommercialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
