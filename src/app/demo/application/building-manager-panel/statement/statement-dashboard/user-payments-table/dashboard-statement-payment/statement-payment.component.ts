/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { PaymentDTO } from '../../../../../../theme/shared/models/paymentDTO';

@Component({
  selector: 'app-statement-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './statement-payment.component.html'
})
export class StatementPaymentComponent implements OnInit {
  @Input() payment: any;
  @Output() paymentSaved = new EventEmitter<PaymentDTO>();

  form!: FormGroup;
  fullAmountChecked = true; // ✅ αρχικά επιλεγμένο
  remainingAmount = 0;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    console.log('🧾 Received payment data:', this.payment);

    const total = this.payment?.amountToPay ?? 0;
    const paid = this.payment?.paidAmount ?? 0;
    this.remainingAmount = total - paid;

    this.form = this.fb.group({
      paymentAmount: [{ value: this.remainingAmount, disabled: true }, [Validators.required, Validators.min(0.01)]],
      paymentMethod: ['CASH', Validators.required]
    });
  }

  /** ✅ Ενεργοποίηση / απενεργοποίηση του input */
  onFullAmountToggle(checked: boolean): void {
    this.fullAmountChecked = checked; // ενημερώνουμε ρητά τη μεταβλητή
    const ctrl = this.form.get('paymentAmount');
    if (!ctrl) return;

    if (checked) {
      // Τσεκαρισμένο → πλήρες ποσό και κλειδωμένο
      ctrl.setValue(this.remainingAmount);
      ctrl.disable({ emitEvent: false });
    } else {
      // Ξε-τσεκαρισμένο → ενεργό πεδίο για μερικό ποσό
      ctrl.enable({ emitEvent: false });
      ctrl.setValue(null);
    }
  }

  /** ✅ Αποθήκευση πληρωμής */
  save(): void {
    const formValue = this.form.getRawValue();
    const amount = formValue.paymentAmount;

    if (!amount || amount <= 0) {
      alert('Παρακαλώ εισάγετε έγκυρο ποσό.');
      return;
    }

    const payload: PaymentDTO = {
      userId: this.payment.userId,
      apartmentId: this.payment.apartmentId,
      statementId: this.payment.statementId,
      amount: amount,
      paymentMethod: formValue.paymentMethod
    };

    console.log('📤 Αποστολή πληρωμής:', payload);
    this.paymentSaved.emit(payload);
    this.activeModal.close(payload);
  }
}
