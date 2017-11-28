import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFansComponent } from './user-fans.component';

describe('UserFansComponent', () => {
  let component: UserFansComponent;
  let fixture: ComponentFixture<UserFansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserFansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
