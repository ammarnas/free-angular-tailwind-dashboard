import { Component, computed, input } from '@angular/core';
import { BadgeComponent } from '../../ui/badge/badge.component';
import { DeclarationStatus } from './customs-declaration';

const STATUS_COLORS: Record<DeclarationStatus, 'success' | 'warning' | 'info' | 'error'> = {
  'Cleared': 'success',
  'Under Review': 'warning',
  'Held': 'info',
  'Rejected': 'error',
};

/**
 * Cell component rendered into the status column by `flexRenderComponent()`.
 *
 * This uses `input()` instead of the repo's usual `@Input()` because TanStack —
 * not a template — creates the component, and `flexRenderComponent`'s `inputs`
 * option only types signal inputs.
 */
@Component({
  selector: 'app-declaration-status-cell',
  imports: [BadgeComponent],
  template: `<app-badge size="sm" [color]="color()">{{ status() }}</app-badge>`,
  styles: ``,
})
export class DeclarationStatusCellComponent {
  readonly status = input.required<DeclarationStatus>();

  readonly color = computed(() => STATUS_COLORS[this.status()]);
}
