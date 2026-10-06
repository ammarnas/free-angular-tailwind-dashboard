import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

export type Locale = 'ar' | 'en' | 'es' | 'de';
export type Direction = 'rtl' | 'ltr';

export interface Language {
  id: Locale;
  /** Endonym, shown in the language list. */
  name: string;
  /** Short endonym, shown on the collapsed trigger. */
  shortName: string;
  /** File name under `/images/icons/`. */
  flag: string;
  dir: Direction;
  badge?: string;
}

/** Arabic-first: this is the locale used when nothing has been stored yet. */
const DEFAULT_LOCALE: Locale = 'ar';

const LOCALE_STORAGE_KEY = 'locale';
/**
 * Pre-dates the translation layer — `AppComponent` and `UserDropdownComponent`
 * each wrote the raw direction here. Still read (so an existing visitor keeps
 * their choice) and still written (so `index.html` / any stray reader stays
 * correct), but `locale` is now the source of truth.
 */
const DIRECTION_STORAGE_KEY = 'dir';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  /** The languages offered in the header language menu. */
  readonly languages: Language[] = [
    { id: 'ar', name: 'العربية', shortName: 'العربية', flag: 'flag-sa.svg', dir: 'rtl', badge: 'RTL' },
    { id: 'en', name: 'English', shortName: 'English', flag: 'flag-us.svg', dir: 'ltr' },
    { id: 'es', name: 'Español', shortName: 'Español', flag: 'flag-es.svg', dir: 'ltr' },
    { id: 'de', name: 'Deutsch', shortName: 'Deutsch', flag: 'flag-de.svg', dir: 'ltr' },
  ];

  private localeSubject = new BehaviorSubject<Locale>(DEFAULT_LOCALE);
  locale$ = this.localeSubject.asObservable();

  private directionSubject = new BehaviorSubject<Direction>('rtl');
  direction$ = this.directionSubject.asObservable();

  constructor(private translate: TranslateService) {
    this.translate.addLangs(this.languages.map((language) => language.id));
    this.translate.setFallbackLang(DEFAULT_LOCALE);
    this.setLocale(this.readStoredLocale());
  }

  get locale(): Locale {
    return this.localeSubject.value;
  }

  get direction(): Direction {
    return this.directionSubject.value;
  }

  get currentLanguage(): Language {
    return this.find(this.locale);
  }

  setLocale(locale: Locale): void {
    const language = this.find(locale);

    this.localeSubject.next(language.id);
    this.directionSubject.next(language.dir);
    this.translate.use(language.id);

    localStorage.setItem(LOCALE_STORAGE_KEY, language.id);
    localStorage.setItem(DIRECTION_STORAGE_KEY, language.dir);

    const root = document.documentElement;
    root.setAttribute('dir', language.dir);
    root.setAttribute('lang', language.id);
  }

  private find(locale: Locale): Language {
    return this.languages.find((language) => language.id === locale) ?? this.languages[0];
  }

  private isSupported(value: string | null): value is Locale {
    return this.languages.some((language) => language.id === value);
  }

  private readStoredLocale(): Locale {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (this.isSupported(stored)) {
      return stored;
    }

    // No stored locale, so fall back to the legacy direction-only preference:
    // an explicit `ltr` meant English, anything else meant Arabic.
    return localStorage.getItem(DIRECTION_STORAGE_KEY) === 'ltr' ? 'en' : DEFAULT_LOCALE;
  }
}
