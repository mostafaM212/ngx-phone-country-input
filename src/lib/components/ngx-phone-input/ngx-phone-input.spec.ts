import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxPhoneInput } from './ngx-phone-input';

describe('NgxPhoneInput', () => {
  let component: NgxPhoneInput;
  let fixture: ComponentFixture<NgxPhoneInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxPhoneInput]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxPhoneInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
