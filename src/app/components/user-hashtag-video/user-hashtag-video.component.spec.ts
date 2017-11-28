import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserHashtagVideoComponent } from './user-hashtag-video.component';

describe('UserHashtagVideoComponent', () => {
  let component: UserHashtagVideoComponent;
  let fixture: ComponentFixture<UserHashtagVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserHashtagVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserHashtagVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
