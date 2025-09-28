# NgxPhoneCountryInput Library

A comprehensive Angular library providing phone input and country selection components with full reactive forms support.

## Components

### 1. NgxPhoneInput

A complete phone number input with integrated country selection.

### 2. NgxCountrySelect

A standalone country selector with search functionality and reactive forms support.

## Features

- 🌍 **200+ Countries**: Complete list with flags and dial codes
- 🔍 **Search Functionality**: Quick country lookup
- 📱 **Responsive Design**: Works on mobile and desktop
- ♿ **Accessible**: Full keyboard navigation and screen reader support
- 🎨 **Customizable**: Multiple configuration options
- 📋 **Reactive Forms**: Full Angular Forms integration with ControlValueAccessor
- 🎯 **TypeScript**: Full type safety

## Installation

```bash
# Install the library
npm install ngx-phone-country-input
```

## Basic Usage

### Standalone Phone Input

```typescript
import { NgxPhoneInput } from "ngx-phone-country-input";

@Component({
  imports: [NgxPhoneInput],
  template: `
    <ngx-phone-input
      placeholder="Enter phone number"
      [defaultCountry]="'US'"
      (valueChange)="onPhoneChange($event)"
    />
  `,
})
export class MyComponent {
  onPhoneChange(value: PhoneInputValue) {
    console.log("Phone:", value.fullNumber);
    console.log("Valid:", value.isValid);
  }
}
```

### Standalone Country Select

```typescript
import { NgxCountrySelect } from "ngx-phone-country-input";

@Component({
  imports: [NgxCountrySelect],
  template: `
    <ngx-country-select
      placeholder="Select country"
      [preferredCountries]="['US', 'GB', 'CA']"
      (countryChange)="onCountryChange($event)"
    />
  `,
})
export class MyComponent {
  onCountryChange(country: CountryModel) {
    console.log("Selected:", country.name);
  }
}
```

### Reactive Forms Integration

```typescript
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { NgxCountrySelect } from "ngx-phone-country-input";

@Component({
  imports: [ReactiveFormsModule, NgxCountrySelect],
  template: `
    <form [formGroup]="userForm">
      <ngx-country-select
        formControlName="country"
        placeholder="Select your country"
      />

      <button [disabled]="userForm.invalid">Submit</button>
    </form>
  `,
})
export class MyComponent {
  userForm = this.fb.group({
    country: ["US", Validators.required],
  });

  constructor(private fb: FormBuilder) {}
}
```

## Component APIs

### NgxPhoneInput

#### Inputs

- `placeholder: string` - Input placeholder text
- `disabled: boolean` - Disable the component
- `defaultCountry: string` - Initial country (ISO2 code)
- `preferredCountries: string[]` - Countries to show at top
- `showFlags: boolean` - Show country flags (default: true)
- `showDialCode: boolean` - Show dial codes (default: true)
- `searchable: boolean` - Enable search functionality (default: true)

#### Outputs

- `valueChange: PhoneInputValue` - Emits complete phone data
- `countryChange: CountryModel` - Emits when country changes

### NgxCountrySelect

#### Inputs

- `placeholder: string` - Placeholder text
- `disabled: boolean` - Disable the component
- `defaultCountry: string` - Initial country (ISO2 code)
- `preferredCountries: string[]` - Countries to show at top
- `showDialCode: boolean` - Show dial codes (default: true)
- `showFlag: boolean` - Show country flags (default: true)
- `searchable: boolean` - Enable search (default: true)

#### Outputs

- `countryChange: CountryModel` - Emits selected country

#### Reactive Forms

Both components implement `ControlValueAccessor` for full Angular Forms integration.

## Data Types

### PhoneInputValue

```typescript
interface PhoneInputValue {
  countryCode: string; // ISO2 code (e.g., 'US')
  dialCode: string; // Dial code (e.g., '+1')
  phoneNumber: string; // Phone number without dial code
  fullNumber: string; // Complete phone number
  isValid: boolean; // Basic validation result
}
```

### CountryModel

```typescript
interface CountryModel {
  name: string; // Country name
  iso2: string; // ISO 3166-1 alpha-2 code
  flag: string; // Unicode flag emoji
  dialCode: string; // International dial code
}
```

## Styling

Components use CSS custom properties for easy theming:

```css
ngx-country-select {
  --border-color: #d1d5db;
  --border-radius: 8px;
  --background: white;
  --text-color: #111827;
  --focus-color: #3b82f6;
}
```

## Recent Improvements

### Enhanced Phone Input Component

The NgxPhoneInput component has been enhanced with new features:

1. **Search Functionality**: Added a search input to the country dropdown that allows users to filter countries by name, dial code, or ISO code.

2. **Configurable Display Options**:

   - `showFlags`: Control whether country flags are displayed (default: true)
   - `showDialCode`: Control whether dial codes are displayed (default: true)
   - `searchable`: Control whether the country list is searchable (default: true)

3. **Improved Accessibility**:

   - Added proper ARIA attributes for screen readers
   - Enhanced keyboard navigation support (Enter, Space, Escape, Arrow keys)
   - Better focus management and visual indicators

4. **Enhanced UI/UX**:
   - Consistent styling with the NgxCountrySelect component
   - Improved responsive design for mobile devices
   - Better visual feedback and hover effects

### Example Usage with New Features

```typescript
// Phone input with flags hidden
<ngx-phone-input
  [showFlags]="false"
  placeholder="Enter phone number" />

// Phone input with dial code hidden
<ngx-phone-input
  [showDialCode]="false"
  placeholder="Enter phone number" />

// Phone input without search functionality
<ngx-phone-input
  [searchable]="false"
  placeholder="Enter phone number" />
```

## Development

```bash
# Build the library
ng build ngx-phone-country-input

# Run tests
ng test ngx-phone-country-input

# Run demo
ng serve
```

## License

MIT
