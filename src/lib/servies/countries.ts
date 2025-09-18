import { computed, Injectable } from '@angular/core';
import { countries } from '../data/countries';

@Injectable()
export class Countries {
  public readonly countries = computed(() => {
    return countries.map(c => ({
      ...c,
      flagUrl: `https://flagcdn.com/24x18/${c.iso2.toLowerCase()}.png`,
    }));
  })
}
