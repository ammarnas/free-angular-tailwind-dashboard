import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

export interface Option {
  value: string;
  text: string;
}

@Component({
  selector: 'app-multi-select',
  imports: [
    CommonModule,
  ],
  templateUrl: './multi-select.component.html',
  styles: ``
})
export class MultiSelectComponent implements OnChanges {

  @Input() label: string = '';
  @Input() options: Option[] = [];
  @Input() defaultSelected: string[] = [];
  /** Parent-controlled selection. Unlike `defaultSelected` this stays in sync after init. */
  @Input() selected?: string[];
  @Input() placeholder: string = 'Select option';
  @Input() disabled: boolean = false;
  @Output() selectionChange = new EventEmitter<string[]>();

  selectedOptions: string[] = [];
  isOpen = false;

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.selectedOptions = [...(this.selected ?? this.defaultSelected)];
  }

  ngOnChanges(changes: SimpleChanges) {
    // Compare contents, not references: template array literals produce a fresh array on
    // every change-detection pass and would otherwise wipe the user's in-progress selection.
    if (changes['selected'] && this.selected && !this.sameValues(this.selected, this.selectedOptions)) {
      this.selectedOptions = [...this.selected];
    }
  }

  // @HostListener (not a manual document.addEventListener) so the close runs through Angular's
  // event plugin and triggers change detection.
  @HostListener('document:mousedown', ['$event'])
  handleClickOutside(event: MouseEvent) {
    if (this.isOpen && !this.elementRef.nativeElement.contains(event.target as Node)) {
      this.isOpen = false;
    }
  }

  private sameValues(a: string[], b: string[]): boolean {
    return a.length === b.length && a.every((value, index) => value === b[index]);
  }

  toggleDropdown() {
    if (!this.disabled) this.isOpen = !this.isOpen;
  }

  handleSelect(optionValue: string) {
    if (this.selectedOptions.includes(optionValue)) {
      this.selectedOptions = this.selectedOptions.filter(v => v !== optionValue);
    } else {
      this.selectedOptions = [...this.selectedOptions, optionValue];
    }
    this.selectionChange.emit(this.selectedOptions);
  }

  removeOption(value: string) {
    this.selectedOptions = this.selectedOptions.filter(opt => opt !== value);
    this.selectionChange.emit(this.selectedOptions);
  }

  get selectedValuesText(): string[] {
    return this.selectedOptions
      .map(value => this.options.find(option => option.value === value)?.text || '')
      .filter(Boolean);
  }
}
