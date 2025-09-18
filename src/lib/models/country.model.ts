export interface CountryModel {
  name: string;
  iso2: string;     // ISO 3166-1 alpha-2 code
  flag?: string;
  dialCode: string;
  flagUrl?: string;
}
