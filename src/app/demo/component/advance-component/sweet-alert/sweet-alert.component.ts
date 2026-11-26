import { UiLocaleService } from 'src/app/theme/shared/service/ui-locale.service';
import { inject, Component } from '@angular/core';
// angular import

import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

// third party
import Swal from 'sweetalert2';
import { SweetAlert2LoaderService, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-sweet-alert',
  imports: [CommonModule, SharedModule, SweetAlert2Module],
  templateUrl: './sweet-alert.component.html',
  styleUrl: './sweet-alert.component.scss',
  providers: [SweetAlert2LoaderService]
})
export class SweetAlertComponent {
  private readonly uiLocale = inject(UiLocaleService);

  // private props

  // private Method
  confirmAlert() {
    Swal.fire({
      title: this.uiLocale.text('Are you sure?'),
      text: this.uiLocale.text('Once deleted, you will not be able to recover this imaginary file!'),
      icon: 'warning',
      showCloseButton: true,
      showCancelButton: true
    }).then((willDelete) => {
      if (willDelete.dismiss) {
        Swal.fire('', this.uiLocale.text('Your imaginary file is safe!'), 'error');
      } else {
        Swal.fire('', this.uiLocale.text('Poof! Your imaginary file has been deleted!'), 'success');
      }
    });
  }

  threeBtn() {
    Swal.fire({
      title: this.uiLocale.text('Do you want to save the changes?'),
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: this.uiLocale.text('Save'),
      denyButtonText: this.uiLocale.text("Don't save")
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire(this.uiLocale.text('Saved!'), '', 'success');
      } else if (result.isDenied) {
        Swal.fire(this.uiLocale.text('Changes are not saved'), '', 'info');
      }
    });
  }

  twoBtn() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons
      .fire({
        title: this.uiLocale.text('Are you sure?'),
        text: this.uiLocale.text("You won't be able to revert this!"),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: this.uiLocale.text('Yes, delete it!'),
        cancelButtonText: this.uiLocale.text('No, cancel!'),
        reverseButtons: true
      })
      .then((result) => {
        if (result.isConfirmed) {
          swalWithBootstrapButtons.fire('Deleted!', 'Your file has been deleted.', 'success');
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire('Cancelled', 'Your imaginary file is safe :)', 'error');
        }
      });
  }

  autoClose() {
    // eslint-disable-next-line
    let timerInterval: any;
    Swal.fire({
      title: this.uiLocale.text('Auto close alert!'),
      html: this.uiLocale.text('I will close in <b></b> milliseconds.'),
      timer: 2000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
        const timer = Swal.getPopup()?.querySelector('b');
        timerInterval = setInterval(() => {
          timer!.textContent = `${Swal.getTimerLeft()}`;
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
      }
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log('I was closed by the timer');
      }
    });
  }

  promptAlert() {
    Swal.fire({
      text: this.uiLocale.text('Write something here:'),
      input: 'text'
    }).then((result) => {
      if (result.value) {
        Swal.fire('', `You typed: ${result.value}`);
      }
    });
  }

  ajaxAlert() {
    Swal.fire({
      title: this.uiLocale.text('Submit your Github username'),
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: this.uiLocale.text('Look up'),
      showLoaderOnConfirm: true,
      preConfirm: async (login) => {
        try {
          const githubUrl = `
            https://api.github.com/users/${login}
          `;
          const response = await fetch(githubUrl);
          if (!response.ok) {
            return Swal.showValidationMessage(`
              ${JSON.stringify(await response.json())}
            `);
          }
          return response.json();
        } catch (error) {
          Swal.showValidationMessage(`
            Request failed: ${error}
          `);
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: `${result.value.login}'s avatar`,
          imageUrl: result.value.avatar_url
        });
      }
    });
  }

  animationAlert() {
    Swal.fire({
      title: this.uiLocale.text('Custom animation with Animate.css'),
      showClass: {
        popup: 'animate__animated animate__fadeInUp animate__faster'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutDown animate__faster'
      }
    });
  }

  passwordAlert() {
    Swal.fire({
      title: this.uiLocale.text('Enter your password'),
      input: 'password',
      inputLabel: this.uiLocale.text('Password'),
      inputPlaceholder: this.uiLocale.text('Enter your password'),
      inputAttributes: {
        maxlength: '10',
        autocapitalize: 'off',
        autocorrect: 'off'
      }
    }).then((result) => {
      if (result.value) {
        Swal.fire(`Entered password: ${result.value}`);
      }
    });
  }

  urlAlert() {
    Swal.fire({
      title: this.uiLocale.text('Enter your URl'),
      input: 'password',
      inputLabel: this.uiLocale.text('Password'),
      inputPlaceholder: this.uiLocale.text('Enter your password'),
      inputAttributes: {
        maxlength: '10',
        autocapitalize: 'off',
        autocorrect: 'off'
      }
    }).then((result) => {
      if (result.value) {
        Swal.fire(`Entered URL: ${result.value}`);
      }
    });
  }

  gmailAlert() {
    Swal.fire({
      title: this.uiLocale.text('Input email address'),
      input: 'email',
      inputLabel: this.uiLocale.text('Your email address'),
      inputPlaceholder: this.uiLocale.text('Enter your email address')
    }).then((result) => {
      if (result.value) {
        Swal.fire(`Entered email: ${result.value}`);
      }
    });
  }

  textAreaAlert() {
    Swal.fire({
      input: 'textarea',
      inputLabel: this.uiLocale.text('Message'),
      inputPlaceholder: this.uiLocale.text('Type your message here...'),
      inputAttributes: {
        'aria-label': this.uiLocale.text('Type your message here')
      },
      showCancelButton: true
    }).then((result) => {
      if (result.value) {
        Swal.fire(result.value);
      }
    });
  }

  selectAlert() {
    Swal.fire({
      title: this.uiLocale.text('Select field validation'),
      input: 'select',
      inputOptions: {
        Fruits: {
          apples: this.uiLocale.text('Apples'),
          bananas: this.uiLocale.text('Bananas'),
          grapes: this.uiLocale.text('Grapes'),
          oranges: this.uiLocale.text('Oranges')
        },
        Vegetables: {
          potato: this.uiLocale.text('Potato'),
          broccoli: this.uiLocale.text('Broccoli'),
          carrot: this.uiLocale.text('Carrot')
        },
        icecream: this.uiLocale.text('Ice cream')
      },
      inputPlaceholder: this.uiLocale.text('Select a fruit'),
      showCancelButton: true,
      inputValidator: (value) => {
        return new Promise((resolve) => {
          if (value === 'oranges') {
            resolve('');
          } else {
            resolve(this.uiLocale.text('You need to select oranges :)'));
          }
        });
      }
    }).then((result) => {
      if (result.value) {
        Swal.fire(`You selected: ${result.value}`);
      }
    });
  }

  radioAlert() {
    const colorOptions = {
      '#ff0000': 'Red',
      '#00ff00': 'Green',
      '#0000ff': 'Blue'
    };
    Swal.fire({
      title: this.uiLocale.text('Select color'),
      input: 'radio',
      inputOptions: colorOptions,
      inputValidator: (value) => {
        if (!value) {
          return this.uiLocale.text('You need to choose something!');
        } else {
          // Since user chose something, return an empty string (indicates success)
          return '';
        }
      }
    }).then((result) => {
      if (result.value) {
        Swal.fire({ html: `You selected: ${result.value}` });
      }
    });
  }

  checkboxAlert() {
    Swal.fire({
      title: this.uiLocale.text('Terms and conditions'),
      input: 'checkbox',
      inputPlaceholder: this.uiLocale.text('I agree with the terms and conditions'),
      inputValidator: (result) => {
        if (!result) {
          return this.uiLocale.text('You need to agree with T&C');
        } else {
          return null;
        }
      }
    }).then((result) => {
      if (result.value) {
        Swal.fire(this.uiLocale.text('You agreed with T&C :)'));
      }
    });
  }

  fileAlert() {
    Swal.fire({
      title: this.uiLocale.text('Select image'),
      input: 'file',
      inputAttributes: {
        accept: this.uiLocale.text('image/*'),
        'aria-label': this.uiLocale.text('Upload your profile picture')
      }
    }).then((result) => {
      if (result.value) {
        const reader = new FileReader();
        reader.onload = (e) => {
          // Ensure imageUrl is always a string
          const imageUrl = e.target?.result?.toString() || '';
          Swal.fire({
            title: this.uiLocale.text('Your uploaded picture'),
            imageUrl: imageUrl,
            imageAlt: this.uiLocale.text('The uploaded picture')
          });
        };
        reader.readAsDataURL(result.value);
      }
    });
  }

  rangeAlert() {
    Swal.fire({
      title: this.uiLocale.text('How old are you?'),
      icon: 'question',
      input: 'range',
      inputLabel: this.uiLocale.text('Your age'),
      inputAttributes: {
        min: '8',
        max: '120',
        step: '1'
      },
      inputValue: 25
    });
  }
}
