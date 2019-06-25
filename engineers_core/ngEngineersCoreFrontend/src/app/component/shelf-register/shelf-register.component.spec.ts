import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShelfRegisterComponent } from './shelf-register.component';

describe('ShelfRegisterComponent', () => {
  let component: ShelfRegisterComponent;
  let fixture: ComponentFixture<ShelfRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShelfRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShelfRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
