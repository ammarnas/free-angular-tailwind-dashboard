import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input } from '@angular/core';
import { SafeHtmlPipe } from '../../../pipe/safe-html.pipe';

type BadgeVariant = 'light' | 'solid';
type BadgeSize = 'sm' | 'md';
type BadgeColor = 'primary' | 'success' | 'error' | 'warning' | 'info' | 'light' | 'dark';

@Component({
  selector: 'app-badge',
  imports: [CommonModule,SafeHtmlPipe],
  templateUrl: './badge.component.html',
})
export class BadgeComponent {
  @Input() variant: BadgeVariant = 'light';
  @Input() size: BadgeSize = 'md';
  @Input() color: BadgeColor = 'primary';
  @Input() startIcon?: string; // SVG or HTML string
  @Input() endIcon?: string;   // SVG or HTML string

  @HostBinding('class') get hostClasses(): string {
    // return `${this.baseStyles} ${this.sizeClass} ${this.colorStyles}`;
    return `flex`;
  }

  get baseStyles() {
    // rounded-lg, not rounded-full: the brand reads as institutional (§5).
    return 'inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-lg font-medium';
  }

  get sizeClass() {
    return {
      sm: 'text-theme-xs',
      md: 'text-sm',
    }[this.size];
  }

  // Status hues stay functional signals (§2.3) and every pairing below clears
  // 4.5:1. `info` moves to gold — the brand accent — because blue is out and
  // brand green must never read as a success signal.
  get colorStyles() {
    const variants = {
      light: {
        primary: 'bg-brand-50 text-brand-700 dark:bg-white/5 dark:text-gold-400',
        success: 'bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-400',
        error: 'bg-error-50 text-error-700 dark:bg-error-500/15 dark:text-error-400',
        warning: 'bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-400',
        info: 'bg-gold-50 text-gold-700 dark:bg-gold-400/15 dark:text-gold-400',
        light: 'bg-gray-100 text-gray-700 dark:bg-white/5 dark:text-gray-100/80',
        dark: 'bg-gray-800 text-white dark:bg-white/5 dark:text-gray-100',
      },
      solid: {
        primary: 'bg-brand-700 text-white dark:bg-gold-400 dark:text-brand-900',
        success: 'bg-success-700 text-white',
        error: 'bg-error-700 text-white',
        warning: 'bg-warning-700 text-white',
        info: 'bg-gold-700 text-white',
        light: 'bg-gray-700 text-white dark:bg-white/10 dark:text-gray-100',
        dark: 'bg-gray-950 text-white dark:bg-black dark:text-gray-100',
      },
    };
    return variants[this.variant][this.color];
  }
}