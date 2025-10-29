import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
import { PaymentDTO } from '../../../../../../theme/shared/models/paymentDTO';

@Component({
  selector: 'app-statement-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './statement-payment.component.html'
})
export class StatementPaymentComponent implements OnInit {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() payment: any;
  @Output() paymentSaved = new EventEmitter<PaymentDTO>();

  form!: FormGroup;
  fullAmountChecked = true; // ✅ αρχικά επιλεγμένο

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    console.log('Received payment object:', this.payment);
    // Υπολογισμός υπολοίπου
    const remaining = this.payment
      ? (this.payment.amountToPay ?? 0) - (this.payment.paidAmount ?? 0)
      : 0;

    // Δημιουργία φόρμας
    this.form = this.fb.group({
      paymentAmount: [{ value: remaining, disabled: this.fullAmountChecked }, [Validators.required, Validators.min(0.01)]],
      paymentMethod: ['CASH', Validators.required]
    });
  }

  // Όταν αλλάζει το checkbox
  onFullAmountToggle(): void {
    const ctrl = this.form.get('paymentAmount');
    const remaining = (this.payment.amountToPay ?? 0) - (this.payment.paidAmount ?? 0);

    if (this.fullAmountChecked) {
      // Αν είναι τικαρισμένο → γέμισε αυτόματα και disable
      ctrl?.setValue(remaining);
      ctrl?.disable({ emitEvent: false });
    } else {
      // Αν είναι ξετικαρισμένο → ενεργοποίησε για manual ποσό
      ctrl?.enable({ emitEvent: false });
      ctrl?.setValue(null);
    }
  }

  // Αποθήκευση πληρωμής
  save(): void {
    const formValue = this.form.getRawValue(); // παίρνει και disabled πεδία

    const payload: PaymentDTO = {
      userId: this.payment.userId,
      apartmentId: this.payment.apartmentId,
      statementId: this.payment.statementId,
      amount: formValue.paymentAmount,
      paymentMethod: formValue.paymentMethod
    };

    console.log('Αποστολή πληρωμής:', payload);
    this.paymentSaved.emit(payload);
    this.activeModal.close();
  }
}
