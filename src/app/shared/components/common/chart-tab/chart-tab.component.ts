
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

type TabOption = 'optionOne' | 'optionTwo' | 'optionThree';

@Component({
  selector: 'app-chart-tab',
  imports: [CommonModule],
  templateUrl: './chart-tab.component.html'
})
export class ChartTabComponent {
  selected: TabOption = 'optionOne';

  setSelected(option: TabOption) {
    this.selected = option;
  }

  getButtonClass(option: TabOption): string {
    return this.selected === option
      ? 'shadow-theme-xs text-gray-950 dark:text-gray-100 bg-white dark:bg-brand-800'
      : 'text-gray-700 dark:text-gray-400';
  }
}