
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-avatar-text',
  imports: [],
  template: `<div
    class="flex h-10 w-10 items-center justify-center rounded-full 
    {{colorClass}} {{ className }}"
  >
    <span class="text-sm font-medium">{{ initials }}</span>
  </div>`,
})
export class AvatarTextComponent {
  @Input() name!: string;
  @Input() className = '';

  get initials(): string {
    if (!this.name) return '';
    return this.name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  get colorClass(): string {
    // Brand palette only — green, gold, maroon, ink (§9). Each tinted ground
    // carries a deep label so every pairing clears 4.5:1.
    const colors = [
      'bg-brand-100 text-brand-700 dark:bg-brand-700/30 dark:text-brand-200',
      'bg-gold-100 text-gold-700 dark:bg-gold-400/20 dark:text-gold-300',
      'bg-maroon-100 text-maroon-700 dark:bg-maroon-700/30 dark:text-maroon-300',
      'bg-gray-200 text-gray-800 dark:bg-white/10 dark:text-gray-200',
      'bg-brand-200 text-brand-800 dark:bg-brand-500/30 dark:text-brand-100',
      'bg-gold-200 text-gold-800 dark:bg-gold-500/30 dark:text-gold-200',
    ];
    const index = this.name
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  }
}
