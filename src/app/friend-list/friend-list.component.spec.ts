import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FriendListComponent } from './friend-list.component';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Friend, FriendService } from '../friend.service';
import { NotificationService } from '../notification.service';

describe('FriendListComponent', () => {
  let component: FriendListComponent;
  let fixture: ComponentFixture<FriendListComponent>;
  let friendService: jasmine.SpyObj<FriendService>;
  let notificationService: jasmine.SpyObj<NotificationService>;
  let friendsSubject: BehaviorSubject<Friend[]>;

  beforeEach(async () => {
    const friendServiceSpy = jasmine.createSpyObj('FriendService', [
      'getFriends',
    ]);
    const notificationServiceSpy = jasmine.createSpyObj('NotificationService', [
      'showNotification',
    ]);

    friendsSubject = new BehaviorSubject<Friend[]>([]);
    friendServiceSpy.getFriends = friendsSubject.asObservable();

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        MatCardModule,
        MatListModule,
        MatIconModule,
        MatSnackBarModule,
        FriendListComponent,
      ],
      providers: [
        { provide: FriendService, useValue: friendServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
      ],
    }).compileComponents();

    friendService = TestBed.inject(
      FriendService
    ) as jasmine.SpyObj<FriendService>;
    notificationService = TestBed.inject(
      NotificationService
    ) as jasmine.SpyObj<NotificationService>;

    fixture = TestBed.createComponent(FriendListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should sort friends by birthday', () => {
    const friends: Friend[] = [
      { firstName: 'Alice', birthDay: 15, birthMonth: 3, birthYear: 1990 },
      { firstName: 'Bob', birthDay: 10, birthMonth: 3, birthYear: 1985 },
      { firstName: 'Charlie', birthDay: 20, birthMonth: 2, birthYear: 1995 },
    ];
    friendsSubject.next(friends);
    fixture.detectChanges();

    const sortedFriends = component.sortedFriends();
    expect(sortedFriends[0].firstName).toBe('Charlie');
    expect(sortedFriends[1].firstName).toBe('Bob');
    expect(sortedFriends[2].firstName).toBe('Alice');
  });

  it('should calculate days to next birthday correctly', () => {
    const today = new Date(2024, 10, 12); // November 12, 2024
    jasmine.clock().mockDate(today);

    const friend: Friend = {
      firstName: 'Alice',
      birthDay: 15,
      birthMonth: 11,
      birthYear: 1990,
    };
    const daysToNextBirthday = component.calculateDaysToNextBirthday(friend);
    expect(daysToNextBirthday).toBe(3);
  });

  it('should calculate age correctly', () => {
    const today = new Date(2024, 10, 12); // November 12, 2024
    jasmine.clock().mockDate(today);

    const friend: Friend = {
      firstName: 'Bob',
      birthDay: 10,
      birthMonth: 11,
      birthYear: 1990,
    };
    const age = component.calculateAge(friend);
    expect(age).toBe(34);
  });

  it('should return null for age when birthYear is not provided', () => {
    const friend: Friend = {
      firstName: 'Charlie',
      birthDay: 20,
      birthMonth: 2,
    };
    const age = component.calculateAge(friend);
    expect(age).toBeNull();
  });

  it("should correctly identify if it is a friend's birthday today", () => {
    const today = new Date(2024, 10, 12); // November 12, 2024
    jasmine.clock().mockDate(today);

    const birthdayFriend: Friend = {
      firstName: 'Alice',
      birthDay: 12,
      birthMonth: 11,
      birthYear: 1990,
    };
    const notBirthdayFriend: Friend = {
      firstName: 'Bob',
      birthDay: 13,
      birthMonth: 11,
      birthYear: 1990,
    };

    expect(component.isBirthdayToday(birthdayFriend)).toBeTrue();
    expect(component.isBirthdayToday(notBirthdayFriend)).toBeFalse();
  });

  it('should show notification for friends with birthdays today', () => {
    const today = new Date(2024, 10, 12); // November 12, 2024
    jasmine.clock().mockDate(today);

    const friends: Friend[] = [
      { firstName: 'Alice', birthDay: 12, birthMonth: 11, birthYear: 1990 },
      { firstName: 'Bob', birthDay: 13, birthMonth: 11, birthYear: 1990 },
    ];
    friendsSubject.next(friends);
    fixture.detectChanges();

    component.checkBirthdays();

    expect(notificationService.showNotification).toHaveBeenCalledWith(
      "🎉 It's Alice's birthday today!",
      'Close'
    );
    expect(notificationService.showNotification).not.toHaveBeenCalledWith(
      "🎉 It's Bob's birthday today!",
      'Close'
    );
  });

  it('should handle friends without birth year in sorting', () => {
    const friends: Friend[] = [
      { firstName: 'Alice', birthDay: 15, birthMonth: 3, birthYear: 1990 },
      { firstName: 'Bob', birthDay: 10, birthMonth: 3 },
      { firstName: 'Charlie', birthDay: 20, birthMonth: 2, birthYear: 1995 },
    ];
    friendsSubject.next(friends);
    fixture.detectChanges();

    const sortedFriends = component.sortedFriends();
    expect(sortedFriends[0].firstName).toBe('Charlie');
    expect(sortedFriends[1].firstName).toBe('Bob');
    expect(sortedFriends[2].firstName).toBe('Alice');
  });
});
