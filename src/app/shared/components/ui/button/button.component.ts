import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SafeHtmlPipe } from '../../../pipe/safe-html.pipe';

@Component({
  selector: 'app-button',
  imports: [
    CommonModule,
    SafeHtmlPipe,
  ],
  templateUrl: './button.component.html',
  styles: ``,
  host: {

  },
})
export class ButtonComponent {

  @Input() size: 'sm' | 'md' = 'md';
  @Input() variant: 'primary' | 'outline' | 'tertiary' | 'destructive' = 'primary';
  @Input() disabled = false;
  @Input() className = '';
  @Input() startIcon?: string; // SVG or icon class, or use ng-content for more flexibility
  @Input() endIcon?: string;

  @Output() btnClick = new EventEmitter<Event>();

  get sizeClasses(): string {
    return this.size === 'sm'
      ? 'px-4 py-3 text-sm'
      : 'px-5 py-3.5 text-sm';
  }

  // Green is primary on light, gold is primary on dark (Desing.md 5). One
  // primary action per view — never both colours on the same surface.
  private static readonly VARIANTS: Record<string, string> = {
    primary:
      'bg-brand-700 text-white shadow-theme-xs hover:bg-brand-800 ' +
      'dark:bg-gold-400 dark:text-brand-900 dark:hover:bg-gold-300 dark:shadow-none ' +
      'disabled:bg-brand-300 disabled:text-white/70 dark:disabled:bg-gold-700',
    outline:
      'bg-transparent text-brand-700 ring-1 ring-inset ring-brand-700 hover:bg-brand-50 ' +
      'dark:text-gold-400 dark:ring-gold-400 dark:hover:bg-white/5',
    tertiary:
      'bg-transparent text-brand-700 hover:bg-brand-50 ' +
      'dark:text-gold-400 dark:hover:bg-white/5',
    destructive:
      'bg-maroon-700 text-white shadow-theme-xs hover:bg-maroon-800 ' +
      'dark:bg-maroon-700 dark:text-white dark:hover:bg-maroon-800 dark:shadow-none',
  };

  get variantClasses(): string {
    return ButtonComponent.VARIANTS[this.variant] ?? ButtonComponent.VARIANTS['primary'];
  }

  get disabledClasses(): string {
    return this.disabled ? 'cursor-not-allowed opacity-50' : '';
  }

  onClick(event: Event) {
    if (!this.disabled) {
      this.btnClick.emit(event);
    }
  }
}
