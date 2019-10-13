import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExaminerFormComponent } from './examiner-form.component';

describe('ExaminerFormComponent', () => {
  let component: ExaminerFormComponent;
  let fixture: ComponentFixture<ExaminerFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExaminerFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExaminerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
