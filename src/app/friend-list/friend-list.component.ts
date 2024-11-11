import { Component, computed, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Friend, FriendService } from '../friend.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
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

  sortedFriends = computed(() =>
    [...this.friends()].sort((a, b) => {
      if (a.birthYear != null && b.birthYear != null) {
        // Both have birthYear, so sort by year first
        if (a.birthYear !== b.birthYear) {
          return a.birthYear - b.birthYear;
        }
      } else if (a.birthYear == null && b.birthYear != null) {
        // Move `a` (without birthYear) to the end
        return 1;
      } else if (a.birthYear != null && b.birthYear == null) {
        // Move `b` (without birthYear) to the end
        return -1;
      }

      // If both have the same birthYear, or both are missing birthYear, compare month and day
      if (a.birthMonth !== b.birthMonth) {
        return a.birthMonth - b.birthMonth;
      }
      return a.birthDay - b.birthDay;
    })
  );

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
