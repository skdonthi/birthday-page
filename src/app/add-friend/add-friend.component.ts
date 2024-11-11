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

@Component({
  selector: 'app-add-friend',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Add a Friend</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <form [formGroup]="friendForm" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline">
            <mat-label>First Name</mat-label>
            <input matInput formControlName="firstName" required />
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Birthday</mat-label>
            <input
              matInput
              [matDatepicker]="picker"
              formControlName="birthday"
              required
            />
            <mat-datepicker-toggle
              matSuffix
              [for]="picker"
            ></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>

          <button
            mat-flat-button
            color="primary"
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
        gap: 16px;
      }
    `,
  ],
})
export class AddFriendComponent {
  friendForm: FormGroup;

  constructor(private fb: FormBuilder, private friendService: FriendService) {
    this.friendForm = this.fb.group({
      firstName: ['', Validators.required],
      birthday: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.friendForm.valid) {
      const { firstName, birthday } = this.friendForm.value;
      this.friendService.addFriend({
        firstName,
        birthDay: birthday.getDate(),
        birthMonth: birthday.getMonth() + 1,
        birthYear: birthday.getFullYear(),
      });
      this.friendForm.reset();
    }
  }
}
