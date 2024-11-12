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

  it('should initialize with empty form', () => {
    expect(component.friendForm.get('birthDay')?.value).toBe('');
    expect(component.friendForm.get('birthMonth')?.value).toBe('');
    expect(component.friendForm.get('birthYear')?.value).toBe('');
  });

  it('should validate day input', () => {
    const dayControl = component.friendForm.get('birthDay');

    dayControl?.setValue('');
    expect(dayControl?.hasError('required')).toBeTruthy();

    dayControl?.setValue('0');
    expect(dayControl?.hasError('invalidFormat')).toBeTruthy();

    dayControl?.setValue('32');
    expect(dayControl?.hasError('outOfRange')).toBeTruthy();

    dayControl?.setValue('15');
    expect(dayControl?.valid).toBeTruthy();
  });

  it('should validate month input', () => {
    const monthControl = component.friendForm.get('birthMonth');

    monthControl?.setValue('');
    expect(monthControl?.hasError('required')).toBeTruthy();

    monthControl?.setValue('0');
    expect(monthControl?.hasError('invalidFormat')).toBeTruthy();

    monthControl?.setValue('13');
    expect(monthControl?.hasError('outOfRange')).toBeTruthy();

    monthControl?.setValue('06');
    expect(monthControl?.valid).toBeTruthy();
  });

  it('should validate year input', () => {
    const yearControl = component.friendForm.get('birthYear');
    const currentYear = new Date().getFullYear();

    yearControl?.setValue('');
    expect(yearControl?.hasError('required')).toBeTruthy();

    yearControl?.setValue('199');
    expect(yearControl?.hasError('invalidFormat')).toBeTruthy();

    yearControl?.setValue('1899');
    expect(yearControl?.hasError('outOfRange')).toBeTruthy();

    yearControl?.setValue((currentYear + 1).toString());
    expect(yearControl?.hasError('outOfRange')).toBeTruthy();

    yearControl?.setValue('2000');
    expect(yearControl?.valid).toBeTruthy();
  });

  it('should format input correctly', () => {
    const event = { target: { value: '123' } } as any;
    const result = component.formatInput(event, 2);
    expect(result).toBe('12');
  });

  it('should disable submit button when form is invalid', () => {
    component.friendForm.setValue({
      firstName: '',
      birthDay: '',
      birthMonth: '',
      birthYear: '',
    });
    fixture.detectChanges();
    const submitButton = fixture.nativeElement.querySelector(
      'button[type="submit"]'
    );
    expect(submitButton.disabled).toBeTruthy();
  });

  it('should enable submit button when form is valid', () => {
    component.friendForm.setValue({
      firstName: 'angular',
      birthDay: '15',
      birthMonth: '06',
      birthYear: '2000',
    });
    fixture.detectChanges();
    const submitButton = fixture.nativeElement.querySelector(
      'button[type="submit"]'
    );
    expect(submitButton.disabled).toBeFalsy();
  });

  it('should call onSubmit when form is submitted', () => {
    spyOn(component, 'onSubmit');
    component.friendForm.setValue({
      firstName: 'angular',
      birthDay: '15',
      birthMonth: '06',
      birthYear: '2000',
    });
    fixture.detectChanges();
    const form = fixture.nativeElement.querySelector('form');
    ///form.dispatchEvent(new Event('submit'));
    expect(component.onSubmit).toHaveBeenCalled();
  });
});
