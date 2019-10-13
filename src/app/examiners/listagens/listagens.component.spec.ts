import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListagensComponent } from './listagens.component';

describe('ListagensComponent', () => {
  let component: ListagensComponent;
  let fixture: ComponentFixture<ListagensComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListagensComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListagensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
