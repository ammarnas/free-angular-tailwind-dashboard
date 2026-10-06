import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LanguageService } from './shared/services/language.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  // Injecting the service is what boots it: its constructor restores the
  // stored locale, loads that language and applies `dir`/`lang` to <html>.
  // The interface is Arabic-first, so RTL is the default and `ltr` locales
  // are the opt-in override.
  constructor(private languageService: LanguageService) {}
}
