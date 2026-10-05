import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'الهيئة العامة للمنافذ والجمارك | لوحة التحكم';

  ngOnInit(): void {
    // The interface is Arabic-first: RTL is the default and `ltr` is the
    // opt-in stored override, which inverts the template's original default.
    const savedDir = localStorage.getItem('dir') === 'ltr' ? 'ltr' : 'rtl';
    document.documentElement.setAttribute('dir', savedDir);
    document.documentElement.setAttribute('lang', savedDir === 'rtl' ? 'ar' : 'en');
  }
}
