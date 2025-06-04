// angular import
import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ConfigurationComponent } from '../admin-layout/configuration/configuration.component';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../../shared/service';

@Component({
  selector: 'app-simple-layouts',
  imports: [SharedModule, RouterModule, ConfigurationComponent],
  templateUrl: './simple-layout.component.html',
  styleUrl: './simple-layout.component.scss'
})
export class SimpleLayouts implements OnInit {
  private authenticationService = inject(AuthenticationService);

  // public props
  isCollapsed = true;
  currentApplicationVersion = environment.appVersion;
  userLogin: boolean = false;

  // life cycle method
  ngOnInit() {
    if (this.authenticationService.currentUserValue) {
      this.userLogin = true;
    }
  }
}
