import { Component } from '@angular/core';
import { AddFriendComponent } from './add-friend/add-friend.component';
import { FriendListComponent } from './friend-list/friend-list.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    AddFriendComponent,
    FriendListComponent,
    MatToolbarModule,
    MatIconModule,
  ],
  template: `
    <mat-toolbar color="primary">
      <mat-icon>cake</mat-icon>
      <span style="margin-left: 8px;">Birthday Organizer</span>
    </mat-toolbar>
    <div class="content">
      <app-add-friend></app-add-friend>
      <app-friend-list></app-friend-list>
    </div>
  `,
  styles: [
    `
      .content {
        padding: 20px;
        max-width: 800px;
        margin: 0 auto;
        display: flex;
        gap: 20px;
      }
    `,
  ],
  animations: [],
})
export class AppComponent {
  title = 'birthday-organizer';
}
