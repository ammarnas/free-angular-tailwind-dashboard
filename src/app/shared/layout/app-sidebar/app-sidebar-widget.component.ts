import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar-widget',
  // Sits inside the always-dark-green sidebar, so it is styled once for a
  // dark ground: gold is the primary action colour there, with a dark label.
  template: `
    <div
      class="mx-auto mb-10 w-full max-w-60 rounded-2xl bg-white/5 border border-white/10 px-4 py-5 text-center"
    >
      <h3 class="mb-2 font-bold text-white">بوابة المنافذ</h3>
      <p class="mb-4 text-gray-100/70 text-theme-sm leading-relaxed">
        منظومة تشغيلية موحدة لإدارة المنافذ والإجراءات الجمركية.
      </p>
      <a
        routerLink="/"
        class="flex items-center justify-center p-3 font-medium rounded-lg bg-gold-400 text-brand-900 text-theme-sm transition-colors duration-200 hover:bg-gold-300 focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-700"
      >
        الدليل التشغيلي
      </a>
    </div>
  `,
  imports: [RouterModule],
})
export class SidebarWidgetComponent {}
