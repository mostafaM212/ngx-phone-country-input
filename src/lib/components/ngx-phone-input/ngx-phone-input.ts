import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  HostListener,
  inject,
  input,
  output,
  signal,
  ViewChild
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CountryModel } from '../../models/country.model';
import { Countries } from '../../servies/countries';

export interface PhoneInputValue {
  countryCode: string;
  dialCode: string;
  phoneNumber: string;
  fullNumber: string;
  isValid: boolean;
}

@Component({
  selector: 'ngx-phone-input',
  imports: [FormsModule],
  providers: [Countries],
  templateUrl: './ngx-phone-input.html',
  styleUrl: './ngx-phone-input.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgxPhoneInput {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  // Inputs
  public readonly placeholder = input<string>('Enter phone number');
  public readonly disabled = input<boolean>(false);
  public readonly defaultCountry = input<string>('US');
  public readonly preferredCountries = input<string[]>([]);

  // Outputs
  public readonly valueChange = output<PhoneInputValue>();
  public readonly countryChange = output<CountryModel>();

  // Services
  public readonly countriesService = inject(Countries);
  public readonly countries = this.countriesService.countries;

  // Component state
  public readonly isDropdownOpen = signal(false);
  public readonly selectedCountry = signal<CountryModel>(this.getDefaultCountry());
  public readonly filteredCountries = signal<CountryModel[]>(this.countries());

  // Form fields
  public phoneNumber = '';
  public searchTerm = '';

  constructor() {
    // Set initial selected country when default country changes
    effect(() => {
      const defaultCountry = this.defaultCountry();
      const country = this.countries().find(c => c.iso2 === defaultCountry);
      if (country) {
        this.selectedCountry.set(country);
      }
    });

    // Initialize filtered countries
    effect(() => {
      this.filteredCountries.set(this.getFilteredCountries());
    });
  }

  private getDefaultCountry(): CountryModel {
    const defaultIso2 = this.defaultCountry();
    return this.countries().find(c => c.iso2 === defaultIso2) ||
      this.countries().find(c => c.iso2 === 'US') ||
      this.countries()[0];
  }

  private getFilteredCountries(): CountryModel[] {
    if (!this.searchTerm.trim()) {
      const preferred = this.preferredCountries();
      if (preferred.length > 0) {
        const preferredCountriesList = preferred
          .map(iso2 => this.countries().find(c => c.iso2 === iso2))
          .filter(Boolean) as CountryModel[];

        const otherCountries = this.countries()
          .filter(c => !preferred.includes(c.iso2));

        return [...preferredCountriesList, ...otherCountries];
      }
      return this.countries();
    }

    const searchLower = this.searchTerm.toLowerCase();
    return this.countries().filter(country =>
      country.name.toLowerCase().includes(searchLower) ||
      country.dialCode.includes(searchLower) ||
      country.iso2.toLowerCase().includes(searchLower)
    );
  }

  public toggleDropdown(): void {
    this.isDropdownOpen.update(open => !open);
    if (this.isDropdownOpen()) {
      setTimeout(() => {
        this.searchInput?.nativeElement?.focus();
      }, 100);
    }
  }

  public closeDropdown(): void {
    this.isDropdownOpen.set(false);
    this.searchTerm = '';
    this.filterCountries();
  }

  public selectCountry(country: CountryModel): void {
    this.selectedCountry.set(country);
    this.countryChange.emit(country);
    this.closeDropdown();
    this.emitValue();
  }

  public filterCountries(): void {
    this.filteredCountries.set(this.getFilteredCountries());
  }

  public onPhoneNumberChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.phoneNumber = target.value;
    this.emitValue();
  }

  private emitValue(): void {
    const country = this.selectedCountry();
    const fullNumber = country.dialCode + this.phoneNumber;

    const value: PhoneInputValue = {
      countryCode: country.iso2,
      dialCode: country.dialCode,
      phoneNumber: this.phoneNumber,
      fullNumber: fullNumber,
      isValid: this.isValidPhoneNumber(this.phoneNumber)
    };

    this.valueChange.emit(value);
  }

  private isValidPhoneNumber(number: string): boolean {
    // Basic validation - at least 3 digits
    return /^\d{3,}$/.test(number.replace(/\s+/g, ''));
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.phone-input-container')) {
      this.closeDropdown();
    }
  }
}
