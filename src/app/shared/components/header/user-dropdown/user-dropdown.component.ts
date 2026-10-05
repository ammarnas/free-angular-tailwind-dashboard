import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface Language {
  id: string;
  name: string;
  shortName: string;
  flag: string;
  badge?: string;
}

@Component({
  selector: 'app-user-dropdown',
  standalone: true,
  templateUrl: './user-dropdown.component.html',
  imports: [CommonModule, RouterModule]
})
export class UserDropdownComponent implements OnInit {
  isOpen = false;
  subDropdownOpen = false;
  currentLocale = 'ar';

  languages: Language[] = [
    {
      id: 'ar',
      name: 'العربية',
      shortName: 'العربية',
      flag: 'flag-sa.svg',
      badge: 'RTL',
    },
    {
      id: 'en',
      name: 'English',
      shortName: 'English',
      flag: 'flag-us.svg',
    },
    {
      id: 'es',
      name: 'Español',
      shortName: 'Español',
      flag: 'flag-es.svg',
    },
    {
      id: 'de',
      name: 'Deutsch',
      shortName: 'Deutsch',
      flag: 'flag-de.svg',
    },
  ];

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    // Arabic-first: anything other than a stored `ltr` resolves to RTL.
    const isLtr = localStorage.getItem('dir') === 'ltr';
    this.currentLocale = isLtr ? 'en' : 'ar';
    this.applyDirection(isLtr ? 'ltr' : 'rtl');
  }

  get currentLang(): Language {
    return this.languages.find((l) => l.id === this.currentLocale) || this.languages[0];
  }

  toggleDropdown(event?: Event): void {
    event?.stopPropagation();
    this.isOpen = !this.isOpen;
    if (!this.isOpen) {
      this.subDropdownOpen = false;
    }
  }

  closeDropdown(): void {
    this.isOpen = false;
    this.subDropdownOpen = false;
  }

  toggleSubDropdown(event: Event): void {
    event.stopPropagation();
    this.subDropdownOpen = !this.subDropdownOpen;
  }

  selectLanguage(id: string, event?: Event): void {
    event?.stopPropagation();
    this.currentLocale = id;
    const dir = id === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('dir', dir);
    this.applyDirection(dir);
    this.closeDropdown();
  }

  private applyDirection(dir: 'rtl' | 'ltr'): void {
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', this.currentLocale);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.isOpen && !this.elementRef.nativeElement.contains(event.target)) {
      this.closeDropdown();
    }
  }
}
