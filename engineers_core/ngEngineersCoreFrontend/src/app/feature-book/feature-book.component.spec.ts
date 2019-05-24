import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureBookComponent } from './feature-book.component';

describe('FeatureBookComponent', () => {
  let component: FeatureBookComponent;
  let fixture: ComponentFixture<FeatureBookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeatureBookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatureBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
