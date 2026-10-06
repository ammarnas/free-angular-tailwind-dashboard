import { Component, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Language, LanguageService, Locale } from '../../../services/language.service';

@Component({
  selector: 'app-user-dropdown',
  standalone: true,
  templateUrl: './user-dropdown.component.html',
  imports: [CommonModule, RouterModule, TranslatePipe]
})
export class UserDropdownComponent {
  isOpen = false;
  subDropdownOpen = false;

  constructor(
    private elementRef: ElementRef,
    private languageService: LanguageService
  ) {}

  get languages(): Language[] {
    return this.languageService.languages;
  }

  get currentLocale(): Locale {
    return this.languageService.locale;
  }

  get currentLang(): Language {
    return this.languageService.currentLanguage;
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

  selectLanguage(id: Locale, event?: Event): void {
    event?.stopPropagation();
    this.languageService.setLocale(id);
    this.closeDropdown();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.isOpen && !this.elementRef.nativeElement.contains(event.target)) {
      this.closeDropdown();
    }
  }
}
