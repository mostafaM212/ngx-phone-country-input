import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  forwardRef,
  HostListener,
  inject,
  Injector,
  input,
  output,
  signal,
  ViewChild
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  NgControl
} from '@angular/forms';
import { CountryModel } from '../../models/country.model';
import { Countries } from '../../servies/countries';

@Component({
  selector: 'lib-ngx-country-select',
  imports: [FormsModule],
  providers: [
    Countries,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxCountrySelect),
      multi: true
    }
  ],
  templateUrl: './ngx-country-select.html',
  styleUrl: './ngx-country-select.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgxCountrySelect implements ControlValueAccessor {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  // Inputs
  public readonly placeholder = input<string>('Select country');
  public readonly disabled = input<boolean>(false);
  public readonly defaultCountry = input<string>('US');
  public readonly preferredCountries = input<string[]>([]);
  public readonly showDialCode = input<boolean>(true);
  public readonly showFlag = input<boolean>(true);
  public readonly searchable = input<boolean>(true);
  public readonly errorMessages = input<{ [key: string]: string }>({
    required: 'This field is required',
    invalid: 'Please select a valid country'
  });

  // Outputs
  public readonly countryChange = output<CountryModel>();

  // Services
  public readonly countriesService = inject(Countries);
  public readonly countries = this.countriesService.countries;
  private readonly injector = inject(Injector);
  private ngControl?: NgControl | null;

  // Component state
  public readonly isDropdownOpen = signal(false);
  public readonly selectedCountry = signal<CountryModel | null>(null);
  public readonly filteredCountries = signal<CountryModel[]>(this.countries());

  // Form fields
  public searchTerm = '';

  // ControlValueAccessor implementation
  private onChange = (value: CountryModel | null) => { };
  private onTouched = () => { };
  private isDisabled = false;

  constructor() {
    // Get NgControl for error handling
    try {
      this.ngControl = this.injector.get(NgControl, null) as NgControl | null;
    } catch {
      // NgControl not available
      this.ngControl = null;
    }

    // Set initial selected country when default country changes
    effect(() => {
      const defaultCountry = this.defaultCountry();
      const country = this.countries().find(c => c.iso2 === defaultCountry);
      if (country && !this.selectedCountry()) {
        this.selectedCountry.set(country);
      }
    });

    // Initialize filtered countries
    effect(() => {
      this.filteredCountries.set(this.getFilteredCountries());
    });
  }

  // ControlValueAccessor methods
  writeValue(value: CountryModel | string | null): void {
    if (typeof value === 'string') {
      // If value is ISO2 code
      const country = this.countries().find(c => c.iso2 === value);
      this.selectedCountry.set(country || null);
    } else {
      this.selectedCountry.set(value);
    }
  }

  registerOnChange(fn: (value: CountryModel | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  get isComponentDisabled(): boolean {
    return this.isDisabled || this.disabled();
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
    if (this.isComponentDisabled) return;

    this.isDropdownOpen.update(open => !open);
    if (this.isDropdownOpen()) {
      setTimeout(() => {
        this.searchInput?.nativeElement?.focus();
      }, 100);
    }
    this.onTouched();
  }

  public closeDropdown(): void {
    this.isDropdownOpen.set(false);
    this.searchTerm = '';
    this.filterCountries();
  }

  public selectCountry(country: CountryModel): void {
    if (this.isComponentDisabled) return;

    this.selectedCountry.set(country);
    this.onChange(country);
    this.countryChange.emit(country);
    this.closeDropdown();
    this.onTouched();
  }

  public clearSelection(): void {
    if (this.isComponentDisabled) return;

    this.selectedCountry.set(null);
    this.onChange(null);
    this.countryChange.emit(null as any);
    this.onTouched();
  }

  public filterCountries(): void {
    this.filteredCountries.set(this.getFilteredCountries());
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.country-select-container')) {
      this.closeDropdown();
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (this.isComponentDisabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        if (!this.isDropdownOpen()) {
          event.preventDefault();
          this.toggleDropdown();
        }
        break;
      case 'Escape':
        if (this.isDropdownOpen()) {
          event.preventDefault();
          this.closeDropdown();
        }
        break;
      case 'ArrowDown':
        if (!this.isDropdownOpen()) {
          event.preventDefault();
          this.toggleDropdown();
        }
        break;
    }
  }

  // Error handling methods
  public hasError(): boolean {
    return this.ngControl?.invalid === true && (this.ngControl?.touched === true || this.ngControl?.dirty === true);
  }

  public showErrorMessage(): boolean {
    return this.hasError();
  }

  public getErrorMessage(): string {
    if (!this.ngControl?.errors) return '';

    const errors = this.ngControl.errors;
    const errorMessages = this.errorMessages();

    // Check for specific error types and return corresponding messages
    if (errors['required']) {
      return errorMessages['required'] || 'This field is required';
    }

    if (errors['invalid']) {
      return errorMessages['invalid'] || 'Please select a valid country';
    }

    // Return generic error message for unknown errors
    const firstErrorKey = Object.keys(errors)[0];
    return errorMessages[firstErrorKey] || `Invalid value: ${firstErrorKey}`;
  }

  public getPlaceholderText(): string {
    if (this.hasError()) {
      return this.getErrorMessage();
    }
    return this.placeholder();
  }
}
