import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FriendListComponent } from './friend-list.component';
import { Friend, FriendService } from '../friend.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../notification.service';

describe('FriendListComponent', () => {
  let component: FriendListComponent;
  let fixture: ComponentFixture<FriendListComponent>;
  let friendService: jasmine.SpyObj<FriendService>;
  //let snackBar: jasmine.SpyObj<MatSnackBar>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

  beforeEach(async () => {
    const friendServiceSpy = jasmine.createSpyObj('FriendService', [
      'getFriends',
    ]);
    //const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    const spy = jasmine.createSpyObj('NotificationService', [
      'showNotification',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        MatCardModule,
        MatListModule,
        MatIconModule,
        FriendListComponent,
      ],
      providers: [
        { provide: FriendService, useValue: friendServiceSpy },
        //{ provide: MatSnackBar, useValue: snackBarSpy },
        { provide: NotificationService, useValue: spy },
      ],
    }).compileComponents();

    friendService = TestBed.inject(
      FriendService
    ) as jasmine.SpyObj<FriendService>;
    //snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    notificationServiceSpy = TestBed.inject(
      NotificationService
    ) as jasmine.SpyObj<NotificationService>;
  });

  beforeEach(() => {
    const today = new Date();
    const mockFriends = signal([
      { id: 1, firstName: 'John', birthDay: 1, birthMonth: 1, birthYear: 1990 },
      {
        id: 2,
        firstName: 'Jane',
        birthDay: 15,
        birthMonth: 6,
        birthYear: 1985,
      },
      {
        id: 3,
        firstName: 'Birthday',
        birthDay: today.getDate(),
        birthMonth: today.getMonth() + 1,
        birthYear: 1995,
      },
    ]);
    friendService.getFriends.and.returnValue(mockFriends());

    fixture = TestBed.createComponent(FriendListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display friends list', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('John');
    expect(compiled.textContent).toContain('Jane');
  });

  it('should calculate days to next birthday correctly', () => {
    const today = new Date();
    const friend = {
      id: 1,
      firstName: 'Test',
      birthDay: today.getDate(),
      birthMonth: today.getMonth() + 1,
      birthYear: 1990,
    };
    expect(component.calculateDaysToNextBirthday(friend)).toBe(365); // or 366 in a leap year
  });

  it('should calculate age correctly', () => {
    const today = new Date();
    const friend = {
      id: 1,
      firstName: 'Test',
      birthDay: today.getDate(),
      birthMonth: today.getMonth() + 1,
      birthYear: today.getFullYear() - 30,
    };
    expect(component.calculateAge(friend)).toBe(30);
  });

  it('should show snackbar for birthdays today', () => {
    const today = new Date();
    const birthdayFriend = {
      id: 3,
      firstName: 'Birthday',
      birthDay: today.getDate(),
      birthMonth: today.getMonth() + 1,
      birthYear: 1995,
    };
    const friendsSignal = signal<Friend[]>([birthdayFriend]);
    friendService.getFriends.and.returnValue(friendsSignal());

    component.ngOnInit();

    expect(notificationServiceSpy.showNotification).toHaveBeenCalledWith(
      `🎉 It's Birthday's birthday today!`,
      'Close'
    );
  });
});
