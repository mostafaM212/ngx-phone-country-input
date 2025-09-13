import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxCountrySelect } from './ngx-country-select';

describe('NgxCountrySelect', () => {
  let component: NgxCountrySelect;
  let fixture: ComponentFixture<NgxCountrySelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxCountrySelect]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxCountrySelect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
