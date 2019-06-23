import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShelfEditComponent } from './shelf-edit.component';

describe('ShelfEditComponent', () => {
  let component: ShelfEditComponent;
  let fixture: ComponentFixture<ShelfEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShelfEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShelfEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
