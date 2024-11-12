import { Component, computed, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Friend, FriendService } from '../friend.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-friend-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Friends' Birthdays</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <mat-list>
          <mat-list-item *ngFor="let friend of sortedFriends()">
            <mat-icon style="color: #960b0b;" matListItemIcon>person</mat-icon>
            <div matListItemTitle>{{ friend.firstName }}</div>
            <div matListItemLine>
              Birthday: {{ friend.birthDay }}/{{ friend.birthMonth
              }}{{ friend.birthYear ? '/' + friend.birthYear : '' }}
              <span *ngIf="isBirthdayToday(friend)" style="color: #f44336;">
                🎉 Happy Birthday! 🎉</span
              >
            </div>
            <div matListItemLine>
              Days to next birthday: {{ calculateDaysToNextBirthday(friend) }}
              <span *ngIf="friend.birthYear">
                | Age: {{ calculateAge(friend) }}
              </span>
            </div>
          </mat-list-item>
        </mat-list>
      </mat-card-content>
    </mat-card>
  `,
  styles: [``],
})
export class FriendListComponent {
  private friends: Signal<Friend[]>;

  sortedFriends = computed(() => [...this.friends()].sort(sortByBirthday1));

  constructor(
    private friendService: FriendService,
    private notificationService: NotificationService
  ) {
    this.friends = this.friendService.getFriends;
  }

  calculateDaysToNextBirthday(friend: Friend): number {
    const today = new Date();
    const nextBirthday = new Date(
      today.getFullYear(),
      friend.birthMonth - 1,
      friend.birthDay
    );
    if (nextBirthday < today) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    const diffTime = nextBirthday.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  calculateAge(friend: Friend): number | null {
    if (!friend.birthYear) return null;
    const today = new Date();
    let age = today.getFullYear() - friend.birthYear;
    const monthDiff = today.getMonth() - (friend.birthMonth - 1);
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < friend.birthDay)
    ) {
      age--;
    }
    return age;
  }

  isBirthdayToday(friend: Friend): boolean {
    const today = new Date();
    return (
      today.getDate() === friend.birthDay &&
      today.getMonth() + 1 === friend.birthMonth
    );
  }

  ngOnInit() {
    this.checkBirthdays();
  }

  checkBirthdays() {
    const today = new Date();
    const todaysBirthdays = this.sortedFriends().filter((friend) =>
      this.isBirthdayToday(friend)
    );

    if (todaysBirthdays.length > 0) {
      todaysBirthdays.forEach((friend) => {
        this.showBirthdayNotification(friend);
      });
    }
  }

  showBirthdayNotification(friend: Friend) {
    this.notificationService.showNotification(
      `🎉 It's ${friend.firstName}'s birthday today!`,
      'Close'
    );
  }
}

function sortByBirthday1(a: any, b: any) {
  const getDateComponents = (obj: any) => {
    return {
      month: parseInt(obj.birthMonth),
      day: parseInt(obj.birthDay),
      year: obj.birthYear ? parseInt(obj.birthYear) : Infinity, // Use Infinity for missing years
    };
  };

  const aDate = getDateComponents(a);
  const bDate = getDateComponents(b);

  // Compare months first
  if (aDate.month !== bDate.month) {
    return aDate.month - bDate.month;
  }

  // If months are equal, compare days
  if (aDate.day !== bDate.day) {
    return aDate.day - bDate.day;
  }

  // If both month and day are equal, compare years
  // Entries without a year will be considered as having the highest year (Infinity)
  return aDate.year - bDate.year;
}

function sortByBirthday(a: any, b: any) {
  const getDateComponents = (obj: any) => {
    return {
      year: obj.birthYear ? parseInt(obj.birthYear) : null,
      month: parseInt(obj.birthMonth),
      day: parseInt(obj.birthDay),
    };
  };

  const aDate = getDateComponents(a);
  const bDate = getDateComponents(b);

  // Compare years first
  if (aDate.year !== bDate.year) {
    if (aDate.year === null) return 1; // a comes after b
    if (bDate.year === null) return -1; // b comes after a
    return aDate.year - bDate.year; // Sort by year
  }

  // If years are equal or both are null, compare months
  if (aDate.month !== bDate.month) {
    return aDate.month - bDate.month; // Sort by month
  }

  // If months are equal, compare days
  return aDate.day - bDate.day; // Sort by day
}
