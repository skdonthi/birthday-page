import { TestBed } from '@angular/core/testing';
import { FriendService, Friend } from './friend.service';

describe('FriendService', () => {
  let service: FriendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    const storedFriends: Friend[] = [
      {
        id: 1,
        firstName: 'Alice',
        birthDay: 15,
        birthMonth: 5,
        birthYear: 1985,
      },
    ];
    localStorage.setItem('friends', JSON.stringify(storedFriends));
    service = TestBed.inject(FriendService);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a friend', () => {
    const newFriend: Omit<Friend, 'id'> = {
      firstName: 'John',
      birthDay: 1,
      birthMonth: 1,
      birthYear: 1990,
    };
    service.addFriend(newFriend);
    expect(service.getFriends().length).toBe(2);
    expect(service.getFriends()[0].firstName).toBe('Alice');
  });

  it('should load friends from localStorage on initialization', () => {
    // Re-create the service to trigger constructor
    service = TestBed.inject(FriendService);

    expect(service.getFriends().length).toBe(1);
    expect(service.getFriends()[0].firstName).toBe('Alice');
  });
});
