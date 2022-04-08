import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogueResultComponent } from './catalogue-result.component';

describe('CatalogueResultComponent', () => {
  let component: CatalogueResultComponent;
  let fixture: ComponentFixture<CatalogueResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatalogueResultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogueResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
