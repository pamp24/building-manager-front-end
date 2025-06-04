// angular import
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-unauthorize-error',
  imports: [SharedModule, RouterModule],
  templateUrl: './unauthorize-error.component.html',
  styleUrl: './unauthorize-error.component.scss'
})
export class UnauthorizeErrorComponent {}
