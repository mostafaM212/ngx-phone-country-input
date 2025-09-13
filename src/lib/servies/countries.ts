import {computed, Injectable, signal} from '@angular/core';
import {countries} from '../data/countries';

@Injectable()
export class Countries {
  public readonly countries = computed(()=>{
    return countries.map(c => ({
      ...c,
      flag: this.iso2ToFlag(c.iso2),
    }));
  })
  iso2ToFlag(iso2: string): string {
    return iso2
      .toUpperCase()
      .split('')
      .map(char => String.fromCodePoint(127397 + char.charCodeAt(0)))
      .join('');
  }
}
