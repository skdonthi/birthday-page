import { Injectable, signal, computed } from '@angular/core';

export interface Friend {
  id?: number;
  firstName: string;
  birthDay: number;
  birthMonth: number;
  birthYear?: number;
}

@Injectable({
  providedIn: 'root',
})
export class FriendService {
  private friendsSignal = signal<Friend[]>([]);

  constructor() {
    const storedFriends = localStorage.getItem('friends');
    if (storedFriends) {
      this.friendsSignal.set(JSON.parse(storedFriends));
    }
  }

  getFriends = computed(() => this.friendsSignal());

  addFriend(friend: Omit<Friend, 'id'>): void {
    const newFriend = { ...friend, id: Date.now() };
    this.friendsSignal.update((friends) => [...friends, newFriend]);
    this.updateLocalStorage();
  }

  private updateLocalStorage(): void {
    localStorage.setItem('friends', JSON.stringify(this.friendsSignal()));
  }
}
