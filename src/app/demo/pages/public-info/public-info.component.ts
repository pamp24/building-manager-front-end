import { TranslateModule } from '@ngx-translate/core';
import { UiLocaleService } from 'src/app/theme/shared/service/ui-locale.service';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { PublicFooterComponent } from './public-footer.component';
import { PublicHeaderComponent } from './public-header.component';

interface InfoPage {
  title: string;
  intro: string;
  sections: { title: string; text: string }[];
  draft?: boolean;
}

@Component({
  selector: 'app-public-info',
  imports: [TranslateModule, RouterLink, PublicFooterComponent, PublicHeaderComponent],
  template: `
    <app-public-header />
    <main>
      <section class="hero">
        <div class="content">
          <p class="eyebrow">{{ 'OIKIO / INFORMATION' | translate }}</p>
          <h1>{{ page.title }}</h1>
          <p class="intro">{{ page.intro }}</p>
        </div>
      </section>
      <section class="body">
        <div class="content body-grid">
          <div class="body-label">{{ page.draft ? ('INFORMATION DRAFT' | translate) : 'OIKIO' }}</div>
          <div>
            @if (page.draft) {
              <p class="notice">
                <strong>{{ 'Draft information, not actual legal text.' | translate }}</strong>
                {{
                  "Before official publication, Oikio's legal entity, VAT number, registered office and contact details must be completed, as well as a legal check."
                    | translate
                }}
              </p>
            }
            @for (section of page.sections; track section.title) {
              <article>
                <h2>{{ section.title }}</h2>
                <p>{{ section.text }}</p>
              </article>
            }
            <a class="back" routerLink="/">{{ '← Back to original' | translate }}</a>
          </div>
        </div>
      </section>
    </main>
    <app-public-footer />
  `,
  styles: [
    `
      .public-header {
        background: #141414;
      }
      .header-inner,
      .content {
        max-width: 1266px;
        margin: auto;
        padding-left: 24px;
        padding-right: 24px;
      }
      .header-inner {
        min-height: 82px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 20px;
      }
      .header-inner img {
        width: 140px;
        background: #fff;
        border-radius: 4px;
        padding: 6px 8px;
      }
      nav {
        display: flex;
        align-items: center;
        gap: 24px;
      }
      nav a {
        color: #fff;
        text-decoration: none;
      }
      nav a:hover {
        text-decoration: underline;
      }
      .register {
        border: 1px solid #777;
        border-radius: 4px;
        padding: 9px 14px;
      }
      .hero {
        background: #141414;
        color: #fff;
        padding: 100px 0 110px;
      }
      .eyebrow,
      .body-label {
        color: #70aaff;
        font-size: 0.75rem;
        font-weight: 600;
        letter-spacing: 0.14em;
      }
      h1 {
        color: #fff;
        font-size: clamp(2.5rem, 5vw, 4.5rem);
        margin: 18px 0;
        font-weight: 600;
      }
      .intro {
        color: #c5c5c5;
        max-width: 650px;
        font-size: 1.2rem;
        line-height: 1.7;
        margin: 0;
      }
      .body {
        background: #fbfbfb;
        padding: 80px 0 100px;
      }
      .body-grid {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 60px;
      }
      .body-label {
        color: #1677ff;
      }
      article {
        padding-bottom: 28px;
        margin-bottom: 28px;
        border-bottom: 1px solid #e5e5e5;
      }
      h2 {
        font-size: 1.4rem;
        margin-bottom: 14px;
      }
      article p,
      .notice {
        max-width: 680px;
        color: #555;
        line-height: 1.8;
        margin: 0;
      }
      .notice {
        background: #eef5ff;
        border-left: 3px solid #1677ff;
        padding: 18px 20px;
        margin-bottom: 36px;
      }
      .back {
        color: #1677ff;
        text-decoration: none;
      }
      .back:hover {
        text-decoration: underline;
      }
      @media (max-width: 767px) {
        .header-inner,
        .content {
          padding-left: 20px;
          padding-right: 20px;
        }
        .header-inner img {
          width: 108px;
        }
        nav {
          gap: 12px;
          font-size: 0.85rem;
        }
        .register {
          padding: 7px;
        }
        .hero {
          padding: 65px 0 75px;
        }
        .body {
          padding: 55px 0 70px;
        }
        .body-grid {
          grid-template-columns: 1fr;
          gap: 24px;
        }
      }
    `
  ]
})
export class PublicInfoComponent {
  private readonly uiLocale = inject(UiLocaleService);

  private route = inject(ActivatedRoute);
  private pages: Record<string, InfoPage> = {
    about: {
      title: this.uiLocale.text('About Oikio'),
      intro: this.uiLocale.text('A common starting point for organizing the apartment building.'),
      sections: [
        {
          title: this.uiLocale.text('Everyday life, organized'),
          text: this.uiLocale.text(
            'Oikio brings together tools for managers and residents so apartment building information is in one place.'
          )
        },
        {
          title: this.uiLocale.text('For everyone in the apartment building'),
          text: this.uiLocale.text(
            'From user management to member-to-member communication, the platform supports different needs and roles.'
          )
        }
      ]
    },
    features: {
      title: this.uiLocale.text('Operations'),
      intro: this.uiLocale.text('Tools for the work and communication of the apartment building.'),
      sections: [
        {
          title: this.uiLocale.text('Management and utilities'),
          text: this.uiLocale.text(
            'Organize apartment buildings, apartments and members, as well as expenses, communal statements and payments.'
          )
        },
        {
          title: this.uiLocale.text('Communication and participation'),
          text: this.uiLocale.text('Announcements, messages, polls and a calendar help members stay informed.')
        }
      ]
    },
    pricing: {
      title: this.uiLocale.text('Pricing'),
      intro: this.uiLocale.text('Information on Oikio pricing.'),
      sections: [
        {
          title: this.uiLocale.text('Pricing information'),
          text: this.uiLocale.text(
            'No pricing information available on this page. Before choosing a service, look for the applicable terms and fees.'
          )
        }
      ]
    },
    support: {
      title: this.uiLocale.text('Support'),
      intro: this.uiLocale.text('Useful first steps for using Oikio.'),
      sections: [
        {
          title: this.uiLocale.text('Account access'),
          text: this.uiLocale.text('From the login page you can login or follow the password recovery process.')
        },
        {
          title: this.uiLocale.text('Find answers'),
          text: this.uiLocale.text('See the FAQ for a brief introduction to the platform and member roles.')
        }
      ]
    },
    faq: {
      title: this.uiLocale.text('Frequently asked questions'),
      intro: this.uiLocale.text('A brief introduction to Oikio.'),
      sections: [
        {
          title: this.uiLocale.text('What is Oikio?'),
          text: this.uiLocale.text('It is a platform for organizing information and tasks related to the apartment building.')
        },
        {
          title: this.uiLocale.text('Who can use it?'),
          text: this.uiLocale.text(
            "The platform is aimed at managers and members of apartment buildings. The available actions depend on each member's role."
          )
        },
        {
          title: this.uiLocale.text('How do I get access?'),
          text: this.uiLocale.text('Use registration or login from the top of the page.')
        }
      ]
    },
    contact: {
      title: this.uiLocale.text('Communication'),
      intro: this.uiLocale.text('Contact information with Oikio.'),
      sections: [
        {
          title: this.uiLocale.text('Contact details'),
          text: this.uiLocale.text(
            'No contact information has been published on this page. For help using the platform, see support and FAQs.'
          )
        }
      ]
    },
    terms: {
      title: this.uiLocale.text('Terms of use'),
      intro: this.uiLocale.text("Draft on the use of Oikio's digital tools and participants' responsibilities."),
      draft: true,
      sections: [
        {
          title: this.uiLocale.text('1. Object and carrier'),
          text: this.uiLocale.text(
            'Oikio provides digital organization and communication tools for apartment buildings. Its operating entity, legal form, VAT number, registered office and contact details have not yet been completed. This is a draft and does not constitute a final agreement or published current terms.'
          )
        },
        {
          title: this.uiLocale.text('2. Users and Access'),
          text: this.uiLocale.text(
            'The platform is aimed at managers, owners, tenants, management companies and their partners. The actions and information available depend on the account, role, invitation, and connection to the respective apartment building. Anyone acting for a company or apartment building must have the appropriate authorization.'
          )
        },
        {
          title: this.uiLocale.text('3. Account and Security'),
          text: this.uiLocale.text(
            "The user must provide accurate information, update it and protect their passwords. Must not allow unauthorized access or use another's account. If a breach is suspected, they should change their password and seek help from the available support channels."
          )
        },
        {
          title: this.uiLocale.text('4. Apartment building tools'),
          text: this.uiLocale.text(
            'Depending on the role, Oikio supports the registration of buildings, apartments and members, expenses and statements of common users, as well as communication, announcements, votes and calendar. Availability and format of tools may change. Their use does not in itself entrust Oikio with the physical, financial or legal management of the apartment building.'
          )
        },
        {
          title: this.uiLocale.text('5. Costs and calculations'),
          text: this.uiLocale.text(
            'Statements and allocations are based on the data and options entered by authorized users, such as costs, millimeters and apartment data. The administrator or company must check the correctness of the entries and results, the regulation of the apartment building and the related decisions before notification or collection. The tool is not a substitute for accounting or legal advice.'
          )
        },
        {
          title: this.uiLocale.text('6. Content and Permissible Use'),
          text: this.uiLocale.text(
            'Users are responsible for the information, documents and messages they post or share and must have the right to use them. No use for deception, harassment, illegal content, unauthorized access or disruption of the service is allowed. Members must respect the privacy of others and limit sharing to what is necessary.'
          )
        },
        {
          title: this.uiLocale.text('7. Personal data'),
          text: this.uiLocale.text(
            'Use may include account, membership, apartment, and financial record information. Users entering third-party data should review their authority and obligations. The roles, purposes, recipients, retention and rights regarding the data must be defined in the final privacy policy, which is currently also a draft.'
          )
        },
        {
          title: this.uiLocale.text('8. Subscriptions and Fees'),
          text: this.uiLocale.text(
            'The packages and prices shown are suggested. Purchasing or activating a subscription and enforcing per-package limits or entitlements are not yet available. If fee-based services are offered in the future, the applicable terms, costs and process should be disclosed prior to the relevant transaction.'
          )
        },
        {
          title: this.uiLocale.text('9. User Fees'),
          text: this.uiLocale.text(
            "The platform includes payment recording capabilities and, where offered in the specific process, electronic payment options through a third party provider. The provider's availability, amounts and any terms are displayed during the transaction. Registering or initiating a payment is not a substitute for verification of its successful completion."
          )
        },
        {
          title: this.uiLocale.text('10. Professionals and external services'),
          text: this.uiLocale.text(
            'Viewing or communicating with a professional does not constitute an assignment of service by Oikio or a guarantee of their work. The subject matter, remuneration and other terms of any work are agreed separately with the respective provider. The user must check his suitability and details before the assignment.'
          )
        },
        {
          title: this.uiLocale.text('11. Availability and Liability'),
          text: this.uiLocale.text(
            'Access may be affected by maintenance, failures, networks or third party services. Users should check critical information and maintain their necessary records. Any limits of liability, as well as the procedures for limiting or terminating access, must be set out in the final terms without limiting rights protected by applicable law.'
          )
        },
        {
          title: this.uiLocale.text('12. Differences and Changes'),
          text: this.uiLocale.text(
            "For issues between members or with external providers, interested parties should first contact the respective parties. The procedure for communicating with the operator of Oikio, dispute management, applicable law and any changes to the terms must be defined after the operator's details have been completed and the legal review has been completed, respecting the legal rights of users."
          )
        }
      ]
    },
    cookies: {
      title: this.uiLocale.text('Cookies policy'),
      intro: this.uiLocale.text('Informative draft about cookies and browser storage when using Oikio.'),
      draft: true,
      sections: [
        {
          title: this.uiLocale.text('1. Cookies and local storage'),
          text: this.uiLocale.text(
            "Cookies are small data that are stored in the browser and can be sent with requests to the respective website. localStorage and sessionStorage are different storage mechanisms in the browser and are not automatically sent with every request. localStorage usually persists until deleted, while sessionStorage is associated with the tab's session."
          )
        },
        {
          title: this.uiLocale.text('2. Login and preferences'),
          text: this.uiLocale.text(
            'Static inspection of the application code shows that token and currentUser, for login and user data, are stored in localStorage when keep-login is selected, and in sessionStorage otherwise. They are deleted on logout. The buildingId, for the apartment building option, uses both mechanisms and is deleted from them on logout. The theme-mode, for display preference, is saved in both engines and is not deleted on logout.'
          )
        },
        {
          title: this.uiLocale.text('3. Progress and invitations'),
          text: this.uiLocale.text(
            'The wizardState_v1 is stored in localStorage for the progress of the associated process and includes action, step and apartment ID. Remains after disconnection. The inviteCode and redirectAfterLogin are stored in localStorage for the invite and redirect process and are deleted on successful or failed acceptance, not on logout. A separate part of the code also provides for storing inviteEmail, inviteApartmentId and inviteRole in localStorage for invite elements. It has not been confirmed that this procedure is accessible in use and no deletion of them was detected in the code review.'
          )
        },
        {
          title: this.uiLocale.text('4. Cookies and third party services'),
          text: this.uiLocale.text(
            'No direct use of document.cookie was detected in the static source code check. This does not prove that no cookies are set by the server, middleware or libraries during actual operation. The app loads external stylesheets from Google Fonts and includes embedded YouTube demo videos. If payment processes are used, Stripe or Viva providers may be involved in a separate environment. No specific cookies of these services have been identified and their actual behavior needs to be checked.'
          )
        },
        {
          title: this.uiLocale.text('5. Control from the browser'),
          text: this.uiLocale.text(
            'You can check or delete cookies and website data through the browser settings, as well as limit their storage, depending on its capabilities. Deleting or blocking may affect your login, apartment selection, preferences, progress and invitations. Options and steps vary by browser and device.'
          )
        },
        {
          title: this.uiLocale.text('6. Consent and Pending Review'),
          text: this.uiLocale.text(
            "Information and consent requirements depend on purpose, factual circumstances and applicable law and require legal assessment. The draft does not describe an implemented choice or consent mechanism. Prior to finalization, a check during the actual operation, a full record of cookies and other technologies, their purposes, providers and duration, as well as completion of the operator's details and a legal check are required."
          )
        }
      ]
    },
    privacy: {
      title: this.uiLocale.text('Privacy policy'),
      intro: this.uiLocale.text('Draft update on personal data when using Oikio.'),
      draft: true,
      sections: [
        {
          title: this.uiLocale.text('1. Field and controller'),
          text: this.uiLocale.text(
            "This is a draft and not a final privacy update. The name, legal form, registered office and contact details of Oikio's operator, as well as any details of a data protection officer, have not been confirmed. The roles of the operator, administrators and management companies as controllers or processors must be assessed on a per-use basis prior to finalisation."
          )
        },
        {
          title: this.uiLocale.text('2. What data may be used'),
          text: this.uiLocale.text(
            'Depending on usage, the data may include account and contact information such as name, email, phone and profile picture, as well as login information. Passwords are stored in hashed form. Details of apartment buildings, apartments, owners, tenants, managers, roles and invitations may also be listed.'
          )
        },
        {
          title: this.uiLocale.text('3. Content and financial data'),
          text: this.uiLocale.text(
            'Use of the Tools may include messages, announcements, polls, calendar events, spending, share allocations and payment records, as well as images or other files uploaded to the Platform. Support requests and comments may also contain personal data. Content depends on user entries; avoid entering unnecessary or sensitive information.'
          )
        },
        {
          title: this.uiLocale.text('4. Sources and purposes'),
          text: this.uiLocale.text(
            'The information may be provided directly by you or entered by an administrator, management company or other authorized user, for example when inviting or managing an apartment building. They are used in the context of creating and accessing the account, organizing apartment buildings and shared users, communication, notifications, support and operation or protection of the service. Whoever enters third-party data must examine the legal basis and update them.'
          )
        },
        {
          title: this.uiLocale.text('5. Legal bases'),
          text: this.uiLocale.text(
            'Depending on the controller, the purpose and the actual circumstances, the performance of a contract or pre-contractual measures, compliance with a legal obligation or legitimate interests may be considered, if the conditions of the GDPR are met. Where consent is legally required or chosen, it must be obtained appropriately and may be withdrawn without prejudice to the lawfulness of previous processing. The basis for any specific processing remains to be confirmed.'
          )
        },
        {
          title: this.uiLocale.text('6. Access and Recipients'),
          text: this.uiLocale.text(
            'Building information and content may be available to users of the relevant building depending on the role and functions. Infrastructure, messaging or payment providers and competent authorities where required by law may also be involved. The actual recipients, providers, roles and their contracts have not been confirmed and must be determined in the final policy.'
          )
        },
        {
          title: this.uiLocale.text('7. Retention and Transfers'),
          text: this.uiLocale.text(
            'Retention and deletion periods, including backups, have not been confirmed. They must be determined by category based on purpose, applicable obligations and any legal need to retain. Countries of storage or access and any transfers outside the EEA, along with the required safeguards, also remain to be confirmed.'
          )
        },
        {
          title: this.uiLocale.text('8. Storage in the browser and cookies'),
          text: this.uiLocale.text(
            "The application uses the browser's localStorage or sessionStorage for login and user information, multi-tenant selection, and other functional options such as display theme. The full record of cookies and other technologies, purposes, duration and any third parties has not been confirmed. Information and consent requirements must be considered prior to final publication."
          )
        },
        {
          title: this.uiLocale.text('9. Security'),
          text: this.uiLocale.text(
            'The application has account and access control mechanisms and hashes passwords. The organizational and technical measures of the actual installation must be confirmed; no method provides absolute security. Users must protect their credentials and devices.'
          )
        },
        {
          title: this.uiLocale.text('10. Your Rights'),
          text: this.uiLocale.text(
            'Under the terms of the GDPR, you can request access, rectification, erasure or restriction of processing, object to it and request portability of your data. Where processing is based on consent, you can withdraw it. Rights are subject to statutory conditions and exclusions. The appropriate point of contact for requests must be filled in; depending on the processing, the administrator or management company may also be appropriate.'
          )
        },
        {
          title: this.uiLocale.text('11. Termination and Termination'),
          text: this.uiLocale.text(
            'You have the right to complain to the competent supervisory authority. In Greece, the Personal Data Protection Authority (www.dpa.gr) is responsible. Confirmation of actual practices, completion of deficiencies and legal review are required before this becomes a valid policy.'
          )
        }
      ]
    }
  };
  constructor() {
    if (this.route.snapshot.url[0]?.path === 'terms') {
      inject(Title).setTitle(this.uiLocale.text('Terms of Use | Oikio'));
      inject(Meta).updateTag({
        name: 'description',
        content: this.uiLocale.text("Informative draft of Oikio's terms of use for administrators, residents, and management companies.")
      });
    } else if (this.route.snapshot.url[0]?.path === 'privacy') {
      inject(Title).setTitle(this.uiLocale.text('Privacy Policy | Oikio'));
      inject(Meta).updateTag({
        name: 'description',
        content: this.uiLocale.text("Informative draft of Oikio's privacy policy and personal data rights.")
      });
    } else if (this.route.snapshot.url[0]?.path === 'cookies') {
      inject(Title).setTitle(this.uiLocale.text('Cookie Policy | Oikio'));
      inject(Meta).updateTag({
        name: 'description',
        content: this.uiLocale.text('Informative draft about cookies and browser storage when using Oikio.')
      });
    }
  }
  get page(): InfoPage {
    return this.pages[this.route.snapshot.url[0].path];
  }
}
