import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { FriendService } from '../friend.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { numberRangeValidator } from './custom-validators';

@Component({
  selector: 'app-add-friend',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  template: `
    <mat-card style="width: 24rem;">
      <mat-card-header>
        <mat-card-title>Add a Friend</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <form [formGroup]="friendForm" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline">
            <mat-label>First Name</mat-label>
            <input
              matInput
              formControlName="firstName"
              type="text"
              placeholder="first name"
            />
            <mat-error *ngIf="friendForm.get('firstName')?.hasError('required')"
              >First name is required</mat-error
            >
          </mat-form-field>
          <div class="date-inputs">
            <mat-form-field appearance="fill">
              <mat-label>Day</mat-label>
              <input
                matInput
                type="text"
                formControlName="birthDay"
                placeholder="DD"
                maxlength="2"
                (input)="
                  friendForm.get('birthDay')?.setValue(formatInput($event, 2))
                "
              />
              <mat-error
                *ngIf="friendForm.get('birthDay')?.hasError('required')"
                >Day is required</mat-error
              >
              <mat-error
                *ngIf="friendForm.get('birthDay')?.hasError('invalidFormat')"
                >Must be 2 digits</mat-error
              >
              <mat-error
                *ngIf="friendForm.get('birthDay')?.hasError('outOfRange')"
                >Day must be between 01 and 31</mat-error
              >
            </mat-form-field>

            <mat-form-field appearance="fill">
              <mat-label>Month</mat-label>
              <input
                matInput
                type="text"
                formControlName="birthMonth"
                placeholder="MM"
                maxlength="2"
                (input)="
                  friendForm.get('birthMonth')?.setValue(formatInput($event, 2))
                "
              />
              <mat-error
                *ngIf="friendForm.get('birthMonth')?.hasError('required')"
                >Month is required</mat-error
              >
              <mat-error
                *ngIf="friendForm.get('birthMonth')?.hasError('invalidFormat')"
                >Must be 2 digits</mat-error
              >
              <mat-error
                *ngIf="friendForm.get('birthMonth')?.hasError('outOfRange')"
                >Month must be between 01 and 12</mat-error
              >
            </mat-form-field>

            <mat-form-field appearance="fill">
              <mat-label>Year</mat-label>
              <input
                matInput
                type="text"
                formControlName="birthYear"
                placeholder="YYYY"
                maxlength="4"
                (input)="
                  friendForm.get('birthYear')?.setValue(formatInput($event, 4))
                "
              />
              <mat-error
                *ngIf="friendForm.get('birthYear')?.hasError('invalidFormat')"
                >Must be 4 digits</mat-error
              >
              <mat-error
                *ngIf="friendForm.get('birthYear')?.hasError('outOfRange')"
                >Year must be between 1900 and {{ currentYear }}</mat-error
              >
            </mat-form-field>
          </div>

          <button
            mat-flat-button
            style="  background-color: var(--centric-blue);
  color: var(--ligh-gray);
  text-transform: uppercase;"
            type="submit"
            [disabled]="!friendForm.valid"
          >
            Add Friend
          </button>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      form {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .date-inputs {
        display: flex;
        gap: 5px; /* Adjust space between fields as needed */
      }
    `,
  ],
})
export class AddFriendComponent {
  friendForm: FormGroup;
  currentYear: number;

  constructor(private fb: FormBuilder, private friendService: FriendService) {
    this.currentYear = new Date().getFullYear();
    this.friendForm = this.fb.group({
      firstName: ['', Validators.required],
      birthDay: ['', [Validators.required, numberRangeValidator(1, 31, 2)]],
      birthMonth: ['', [Validators.required, numberRangeValidator(1, 12, 2)]],
      birthYear: ['', [numberRangeValidator(1900, this.currentYear, 4)]],
    });
  }

  formatInput(event: Event, digits: number) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    if (value.length > digits) {
      value = value.slice(0, digits);
    }

    input.value = value;
    return value;
  }

  onSubmit(): void {
    if (this.friendForm.valid) {
      this.friendService.addFriend(this.friendForm.value);
      this.friendForm.reset();
    }
  }
}
