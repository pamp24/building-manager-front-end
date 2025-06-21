// angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { AuthenticationService } from 'src/app/theme/shared/service/authentication.service';
import { Router } from '@angular/router';
import { CodeInputModule } from 'angular-code-input';


@Component({
  selector: 'app-code-verify',
  imports: [CommonModule, SharedModule, CodeInputModule,],
  templateUrl: './code-verify.component.html',
  styleUrls: ['./code-verify.component.scss']
})
export class CodeVerifyComponent {
  message = '';
  isOkay = false;
  submitted = false;
  code: string = ''; // <-- αποθηκεύουμε τον κωδικό

  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) {}

  private confirmAccount(token: string) {
    
  this.submitted = true;
    this.authService.confirm(token)
    .subscribe({
      next: () => {
        this.isOkay = true;
        this.message = 'Ο λογαριασμός σας ενεργοποιήθηκε με επιτυχία.\nΤώρα μπορείτε να προχωρήσετε στην είσοδο.';
      },
      error: () => {
        this.isOkay = false;
        this.message = 'Το token έχει λήξει ή είναι άκυρο';
      }
    });
  }

  redirectToLogin() {
    this.router.navigate(['login']);
  }

  onCodeCompleted(token: string) {  
    this.code = token;
  }

  onSubmit() {
    if (this.code && this.code.length === 6) {
      this.isOkay = true;
      this.confirmAccount(this.code);
    } else {
      this.message = 'Παρακαλώ συμπληρώστε έγκυρο κωδικό.';
      this.submitted = true;
      this.isOkay = false;
    }
  }
}
