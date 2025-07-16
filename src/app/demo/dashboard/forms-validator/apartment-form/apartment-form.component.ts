import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-apartment-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './apartment-form.component.html',
  styleUrl: './apartment-form.component.scss'
})
export class ApartmentFormComponent implements OnInit {
  apartmentForm!: FormGroup;

    constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.apartmentForm = this.fb.group({
      number: ['', Validators.required],
      floor: ['', Validators.required],
      ownerName: ['', Validators.required],
      squareMeters: ['', Validators.required],
      sharedPercentage: ['', Validators.required]
    });
  }


  submitApartment(){

  }
}
