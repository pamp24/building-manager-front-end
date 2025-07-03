import { Component, Output, EventEmitter } from '@angular/core';
import {CommonModule} from '@angular/common';
import { SharedModule } from '../../../theme/shared/shared.module';
import { NarikCustomValidatorsModule } from '@narik/custom-validators';

@Component({
    selector: 'app-role-form',
    imports: [CommonModule, SharedModule, NarikCustomValidatorsModule],
    templateUrl: './role-form.component.html',
    styleUrls: ['./role-form.component.scss']
})
export class RoleFormComponent {

    @Output() next = new EventEmitter<unknown>();

    info = { fullName: '', email: '' };

    formInput = { role: '' };

    isSubmit = false;
}