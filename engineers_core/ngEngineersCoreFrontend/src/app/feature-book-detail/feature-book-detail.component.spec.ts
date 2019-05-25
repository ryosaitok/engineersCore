import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureBookDetailComponent } from './feature-book-detail.component';

describe('FeatureBookDetailComponent', () => {
  let component: FeatureBookDetailComponent;
  let fixture: ComponentFixture<FeatureBookDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeatureBookDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatureBookDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
