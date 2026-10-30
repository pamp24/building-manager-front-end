import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-public-footer',
  imports: [RouterLink],
  template: `
    <footer class="public-footer">
      <div class="footer-content">
        <div class="brand">
          <a routerLink="/"><img src="assets/images/landing/oikio-landing.png" alt="Oikio" /></a>
          <p>Το Oikio βοηθά διαχειριστές και κατοίκους να οργανώνουν την καθημερινότητα της πολυκατοικίας.</p>
        </div>
        <nav aria-label="Σύνδεσμοι υποσέλιδου" class="footer-nav">
          <div><h2>Oikio</h2><a routerLink="/about">Σχετικά</a><a routerLink="/features">Λειτουργίες</a><a routerLink="/pricing">Τιμολόγηση</a></div>
          <div><h2>Βοήθεια</h2><a routerLink="/support">Υποστήριξη</a><a routerLink="/contact-us">Επικοινωνία</a></div>
          <div><h2>Πληροφορίες</h2><a routerLink="/privacy">Πολιτική απορρήτου</a><a routerLink="/cookies">Πολιτική cookies</a><a routerLink="/terms">Όροι χρήσης</a><a routerLink="/faq">Συχνές ερωτήσεις</a></div>
        </nav>
      </div>
      <div class="footer-bottom">
        <div class="footer-bottom-inner">
          <div class="footer-credit">
            <span>© Oikio</span>
            <span>Ανάπτυξη: <a href="https://www.project-file.gr/" target="_blank" rel="noopener noreferrer">Project File</a></span>
          </div>
          <div class="footer-social" aria-label="Κοινωνικά δίκτυα">
            <svg role="img" aria-label="Facebook" viewBox="0 0 24 24"><path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V3.9c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.1V10H7.7v3h2.7v8z" /></svg>
            <svg role="img" aria-label="Instagram" viewBox="0 0 24 24"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm5.5-3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" /></svg>
            <svg role="img" aria-label="X" viewBox="0 0 24 24"><path d="M18.9 2H22l-6.8 7.8L23.2 22H17l-4.9-7.4L5.6 22H2.5l7.4-8.5L1.8 2h6.4l4.4 6.7zm-1.1 18h1.7L7.2 3.9H5.4z" /></svg>
            <svg role="img" aria-label="LinkedIn" viewBox="0 0 24 24"><path d="M5 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM3.3 8.5h3.4V21H3.3zm5.5 0h3.3v1.7h.1a3.6 3.6 0 0 1 3.3-1.9c3.5 0 4.2 2.3 4.2 5.3V21h-3.4v-6.6c0-1.6 0-3.5-2.2-3.5s-2.5 1.7-2.5 3.4V21H8.8z" /></svg>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .public-footer { background: #1f1f1f; color: #fff; }
    .footer-content { max-width: 1266px; margin: auto; padding: 80px 24px; display: grid; grid-template-columns: 1fr 2fr; gap: 60px; }
    .brand img { width: 140px; max-width: 100%; padding: 6px 8px; background: #fff; border-radius: 4px; }
    .brand p { max-width: 310px; margin: 20px 0 0; color: #b6b6b6; line-height: 1.7; }
    .footer-nav { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
    h2 { color: #fff; font-size: 1.1rem; margin: 0 0 24px; }
    .footer-nav a { display: block; color: #b6b6b6; margin: 14px 0; text-decoration: none; }
    .footer-nav a:hover, .footer-nav a:focus-visible { color: #fff; text-decoration: underline; }
    .footer-bottom { background: #141414; border-top: 1px solid #303030; color: #aaa; font-size: 0.8rem; }
    .footer-bottom-inner { max-width: 1266px; padding: 14px 24px; margin: auto; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
    .footer-credit { display: flex; gap: 8px 20px; flex-wrap: wrap; }
    .footer-credit a { color: inherit; text-decoration: none; }
    .footer-credit a:hover, .footer-credit a:focus-visible { color: #fff; text-decoration: underline; }
    .footer-social { display: flex; align-items: center; gap: 18px; }
    .footer-social svg { width: 18px; height: 18px; fill: currentColor; }
    @media (max-width: 767px) { .footer-content { grid-template-columns: 1fr; gap: 36px; padding: 56px 20px; } .footer-nav { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; } .footer-bottom-inner { padding: 14px 20px; } }
  `]
})
export class PublicFooterComponent {}
