import { NgModule } from '@angular/core';
import { NgxCountrySelect } from './components/ngx-country-select/ngx-country-select';
import { NgxPhoneInput } from './components/ngx-phone-input/ngx-phone-input';
import { Countries } from './servies/countries';

@NgModule({
  imports: [
    NgxCountrySelect,
    NgxPhoneInput
  ],
  exports: [
    NgxCountrySelect,
    NgxPhoneInput
  ],
  providers: [
    Countries
  ]
})
export class NgxPhoneCountryInputModule { }