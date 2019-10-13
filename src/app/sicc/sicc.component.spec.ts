import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SICCComponent } from './sicc.component';

describe('SICCComponent', () => {
  let component: SICCComponent;
  let fixture: ComponentFixture<SICCComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SICCComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SICCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
