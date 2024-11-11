import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddFriendComponent } from './add-friend.component';
import { FriendService } from '../friend.service';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

describe('AddFriendComponent', () => {
  let component: AddFriendComponent;
  let fixture: ComponentFixture<AddFriendComponent>;
  let friendService: jasmine.SpyObj<FriendService>;

  beforeEach(async () => {
    const friendServiceSpy = jasmine.createSpyObj('FriendService', [
      'addFriend',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatDatepickerModule,
        MatNativeDateModule,
        AddFriendComponent,
      ],
      providers: [{ provide: FriendService, useValue: friendServiceSpy }],
    }).compileComponents();

    friendService = TestBed.inject(
      FriendService
    ) as jasmine.SpyObj<FriendService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFriendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty fields', () => {
    expect(component.friendForm.get('firstName')?.value).toBe('');
    expect(component.friendForm.get('birthday')?.value).toBe('');
  });

  it('should call addFriend method when form is valid and submitted', () => {
    const testDate = new Date(1990, 0, 1); // January 1, 1990
    component.friendForm.setValue({
      firstName: 'John',
      birthday: testDate,
    });

    component.onSubmit();

    expect(friendService.addFriend).toHaveBeenCalledWith({
      firstName: 'John',
      birthDay: 1,
      birthMonth: 1,
      birthYear: 1990,
    });
  });

  it('should not call addFriend method when form is invalid', () => {
    component.onSubmit();
    expect(friendService.addFriend).not.toHaveBeenCalled();
  });
});
