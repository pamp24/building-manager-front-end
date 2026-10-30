// angular import
import { Component, HostListener, OnDestroy, OnInit, effect, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// project import
import { MantisConfig } from 'src/app/app-config';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { environment } from 'src/environments/environment';
import { PlaceholderCard1Component } from 'src/app/theme/shared/components/placeholder-card/placeholder-1.component';
import { PlaceholderCard2Component } from 'src/app/theme/shared/components/placeholder-card/placeholder-2.component';
import { AuthenticationService } from 'src/app/theme/shared/service';
import { ThemeService } from 'src/app/theme/shared/service/customs-theme.service';
import { PublicFooterComponent } from '../public-info/public-footer.component';
import { PublicHeaderComponent } from '../public-info/public-header.component';

// icons
import { IconService } from '@ant-design/icons-angular';
import {
  CheckCircleOutline,
  DownloadOutline,
  EyeOutline,
  SendOutline,
  StarFill,
  StarOutline,
  TwitterOutline,
  DiscordOutline,
  InstagramOutline,
  FacebookOutline,
  LinkedinOutline,
  GithubOutline
} from '@ant-design/icons-angular/icons';

// third party
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-landing',
  imports: [CommonModule, RouterModule, SharedModule, CarouselModule, PlaceholderCard1Component, PlaceholderCard2Component, PublicFooterComponent, PublicHeaderComponent],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit, OnDestroy {
  private iconService = inject(IconService);
  private authenticationService = inject(AuthenticationService);
  private themeService = inject(ThemeService);

  // public props
  landingLayout!: boolean;
  bodyColor: string = 'preset-1';
  isCollapsed = true;
  isScrolled: boolean = false;
  currentApplicationVersion = environment.appVersion;
  customerReview!: OwlOptions;
  userLogin: boolean = false;
  isDark: boolean = false;
  colorPresets = ['preset-1', 'preset-2', 'preset-3', 'preset-4', 'preset-5', 'preset-6', 'preset-7', 'preset-8', 'preset-9'];

  // constructor
  constructor() {
    effect(() => {
      this.DarkMode(this.themeService.isDarkMode());
    });
    this.iconService.addIcon(
      ...[
        EyeOutline,
        SendOutline,
        CheckCircleOutline,
        DownloadOutline,
        StarOutline,
        StarFill,
        DiscordOutline,
        InstagramOutline,
        FacebookOutline,
        TwitterOutline,
        LinkedinOutline,
        GithubOutline
      ]
    );
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    // logic to check scroll position
    if (window.pageYOffset > 500) {
      document.querySelector('.pc-landing-customize')?.classList.add('active');
    } else {
      document.querySelector('.pc-landing-customize')?.classList.remove('active');
    }
  }

  // Life cycle events
  ngOnInit(): void {
    this.bodyColor = MantisConfig.theme_color;
    this.SetBodyColor(this.bodyColor);

    this.landingLayout = MantisConfig.isLanding;
    document.querySelector('body')?.classList.add('landing-page');

    this.customerReview = {
      loop: true,
      margin: 20,
      nav: false,
      autoplay: true,
      stagePadding: 30,
      dots: false,
      responsive: {
        0: {
          items: 1,
          stagePadding: 30
        },
        992: {
          items: 1,
          stagePadding: 30
        },
        1000: {
          items: 3
        }
      }
    };

    if (this.authenticationService.currentUserValue) {
      this.userLogin = true;
    }

    // =============== images dark and light mode start ========================== //
    let i;
    /*find all elements with an "overlay" class:*/
    const x = document.getElementsByClassName('img-comp-overlay');
    for (i = 0; i < x.length; i++) {
      /*once for each "overlay" element:
      pass the "overlay" element as a parameter when executing the compareImages function:*/
      compareImages(x[i]);
    }
    // eslint-disable-next-line
    function compareImages(img: any) {
      let clicked = 0;
      /*get the width and height of the img element*/
      const w = img.offsetWidth;
      const h = img.offsetHeight;
      /*set the width of the img element to 50%:*/
      img.style.width = w / 2 + 'px';
      /*create slider:*/
      const slider = document.createElement('DIV');
      slider.setAttribute('class', 'img-comp-slider ti ti-separator-vertical');
      /*insert slider*/
      img.parentElement.insertBefore(slider, img);
      /*position the slider in the middle:*/
      slider.style.top = h / 2 - slider.offsetHeight / 2 + 'px';
      slider.style.left = w / 2 - slider.offsetWidth / 2 + 'px';
      /*execute a function when the mouse button is pressed:*/
      slider.addEventListener('mousedown', slideReady);
      /*and another function when the mouse button is released:*/
      window.addEventListener('mouseup', slideFinish);
      /*or touched (for touch screens:*/
      slider.addEventListener('touchstart', slideReady);
      /*and released (for touch screens:*/
      window.addEventListener('touchend', slideFinish);
      function slideReady(e: { preventDefault: () => void }) {
        /*prevent any other actions that may occur when moving over the image:*/
        e.preventDefault();
        /*the slider is now clicked and ready to move:*/
        clicked = 1;
        /*execute a function when the slider is moved:*/
        window.addEventListener('mousemove', slideMove);
        window.addEventListener('touchmove', slideMove);
      }
      function slideFinish() {
        /*the slider is no longer clicked:*/
        clicked = 0;
      }
      // eslint-disable-next-line
      function slideMove(e: any) {
        let pos;
        /*if the slider is no longer clicked, exit this function:*/
        if (clicked == 0) return false;
        /*get the cursor's x position:*/
        pos = getCursorPos(e);
        /*prevent the slider from being positioned outside the image:*/
        if (pos < 0) pos = 0;
        if (pos > w) pos = w;
        /*execute a function that will resize the overlay image according to the cursor:*/
        slide(pos);
      }
      // eslint-disable-next-line
      function getCursorPos(e: { changedTouches: any[]; pageX: number }) {
        let x = 0;
        e = e.changedTouches ? e.changedTouches[0] : e;
        /*get the x positions of the image:*/
        const a = img.getBoundingClientRect();
        /*calculate the cursor's x coordinate, relative to the image:*/
        x = e.pageX - a.left;
        /*consider any page scrolling:*/
        x = x - window.pageXOffset;
        return x;
      }
      function slide(x: string) {
        /*resize the image:*/
        img.style.width = x + 'px';
        /*position the slider:*/
        slider.style.left = img.offsetWidth - slider.offsetWidth / 2 + 'px';
      }
    }
    // =============== images dark and light mode end ========================== //
  }

  ngOnDestroy() {
    document.querySelector('body')?.classList.remove('landing-page');
  }

  SetBodyColor(background: string) {
    this.bodyColor = background;

    const bodyElement = document.querySelector('body') as HTMLBodyElement;
    this.colorPresets.forEach((preset) => bodyElement.part.remove(preset));
    bodyElement.part.add(background);
  }

  webApps = [
    {
      sub_list: [
        {
          title: 'Διαχείριση πολυκατοικίας'
        },
        {
          title: 'Διαμερίσματα'
        },
        {
          title: 'Μέλη πολυκατοικίας'
        }
      ]
    },
    {
      sub_list: [
        {
          title: 'Κοινόχρηστες δαπάνες'
        },
        {
          title: 'Καταστάσεις κοινοχρήστων'
        },
        {
          title: 'Πληρωμές'
        }
      ]
    },
    {
      sub_list: [
        {
          title: 'Ανακοινώσεις'
        },
        {
          title: 'Ψηφοφορίες'
        },
        {
          title: 'Μηνύματα'
        }
      ]
    }
  ];

  landingFeatures = [
    { title: 'Ανακοινώσεις', icon: 'ti-speakerphone' },
    { title: 'Ψηφοφορίες', icon: 'ti-checkbox' },
    { title: 'Μηνύματα', icon: 'ti-message-circle' },
    { title: 'Κοινόχρηστα', icon: 'ti-receipt' },
    { title: 'Πολυκατοικίες', icon: 'ti-building-community' },
    { title: 'Ημερολόγιο', icon: 'ti-calendar' }
  ];

  marquees = [
    { text: 'Πολυκατοικίες' },
    { text: 'Διαχειριστές' },
    { text: 'Κάτοικοι' },
    { text: 'Διαμερίσματα' },
    { text: 'Κοινόχρηστα' },
    { text: 'Δαπάνες' },
    { text: 'Πληρωμές' },
    { text: 'Ανακοινώσεις' },
    { text: 'Ψηφοφορίες' },
    { text: 'Μηνύματα' },
    { text: 'Ημερολόγιο' },
    { text: 'Μέλη' },
    { text: 'Καταστάσεις κοινοχρήστων' },
    { text: 'Επικοινωνία' },
    { text: 'Οργάνωση' },
    { text: 'Διαχείριση' },
    { text: 'Ενημέρωση' },
    { text: 'Oikio' }
  ];

  reviewers = [
    {
      title: 'Ποιότητα κώδικα',
      text: 'Ο καθαρός κώδικας αυτού του προτύπου κάνει το πακέτο εξαιρετικό. Ευχαριστώ την ομάδα!',
      name: 'Govert',
      rating: 5
    },
    {
      title: 'Ποιότητα κώδικα',
      text: 'Η ποιότητα του κώδικα και ο σχεδιασμός είναι εξαιρετικά.',
      name: 'Bravo.',
      rating: 5
    },
    {
      title: 'Δυνατότητα προσαρμογής',
      text: 'Αξιόπιστο και καλά οργανωμένο, με τις πιο πρόσφατες βιβλιοθήκες και εξαιρετική υποστήριξη πελατών!',
      name: 'Rodrigo J.',
      rating: 5
    },
    {
      title: 'Ποιότητα σχεδιασμού',
      text: 'Εξαιρετικός σχεδιασμός και οργανωμένος κώδικας, ευχαριστώ ...',
      name: 'Yang Z.',
      rating: 4
    }
  ];

  short_link = [
    {
      title: 'Βοήθεια προτύπου',
      support: [
        {
          support_link: 'Blog',
          url: 'https://blog.codedthemes.com/'
        },
        {
          support_link: 'Τεκμηρίωση',
          url: 'https://codedthemes.gitbook.io/mantis-angular'
        },
        {
          support_link: 'Ιστορικό αλλαγών',
          url: 'https://codedthemes.gitbook.io/mantis-angular/changelog'
        },
        {
          support_link: 'Υποστήριξη',
          url: 'https://codedthemes.support-hub.io/'
        },
        {
          support_link: 'Discord',
          url: 'https://discord.com/invite/p2E2WhCb6s'
        },
      ]
    },
    {
      title: 'Κατάστημα CodedThemes',
      support: [
        {
          support_link: 'Άδεια χρήσης',
          url: 'https://codedthemes.com/license'
        },
        {
          support_link: 'Πολιτική επιστροφών',
          url: 'https://codedthemes.com/terms-and-conditions'
        },
        {
          support_link: 'Επικοινωνία',
          url: 'https://codedthemes.com/contact'
        },
        {
          support_link: 'Συνεργάτες',
          url: 'https://codedthemes.com/affiliate'
        }
      ]
    },
    {
      title: 'Εκδόσεις προτύπου',
      support: [
        {
          support_link: 'CodeIgniter',
          url: 'https://codedthemes.com/item/mantis-codeigniter-admin-template'
        },
        {
          support_link: 'React MUI',
          url: 'https://mui.com/store/items/mantis-react-admin-dashboard-template'
        },
        {
          support_link: 'Angular',
          url: 'https://codedthemes.com/item/mantis-angular-admin-template'
        },
        {
          support_link: 'Bootstrap 5',
          url: 'https://codedthemes.com/item/mantis-bootstrap-admin-dashboard'
        },
        {
          support_link: '.Net',
          url: 'https://codedthemes.com/item/mantis-dotnet-bootstrap-dashboard-template'
        },
        {
          support_link: 'Vue',
          url: 'https://codedthemes.com/item/mantis-vue-admin-template'
        }
      ]
    },
    {
      title: 'Προϊόντα CodedThemes',
      support: [
        {
          support_link: 'Berry Angular',
          url: 'https://codedthemes.com/item/berry-angular-admin-dashboard-template'
        },
        {
          support_link: 'Free Berry Angular',
          url: 'https://codedthemes.com/item/berry-angular-free-admin-template'
        },
        {
          support_link: 'Angular Bundle',
          url: 'https://codedthemes.com/item/angular-mega-bundle'
        },
        {
          support_link: 'Big Bundle',
          url: 'https://codedthemes.com/item/big-bundle'
        },
        {
          support_link: 'Figma UI Kits',
          url: 'https://codedthemes.com/item/category/templates/figma-ui-kits'
        }
      ]
    }
  ];

  socialLinks = [
    {
      link: 'https://www.instagram.com/codedthemes',
      title: 'instagram',
      icon: 'instagram',
      theme: 'outline'
    },
    {
      link: 'https://x.com/codedthemes',
      title: 'twitter',
      icon: 'twitter',
      theme: 'outline'
    },
    {
      link: 'https://in.linkedin.com/company/codedthemes',
      title: 'linkedin',
      icon: 'linkedin',
      theme: 'outline'
    },
    {
      link: 'https://www.facebook.com/codedthemes',
      title: 'facebook',
      icon: 'facebook',
      theme: 'outline'
    },
    {
      link: 'https://discord.com/invite/p2E2WhCb6s',
      title: 'Discord',
      icon: 'discord',
      theme: 'outline'
    },
    {
      link: 'https://github.com/codedthemes',
      title: 'Github',
      icon: 'github',
      theme: 'outline'
    }
  ];

  // private method
  private DarkMode(dark: boolean) {
    this.isDark = dark;
  }
}
