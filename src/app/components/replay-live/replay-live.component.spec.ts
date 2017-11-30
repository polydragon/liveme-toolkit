import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplayLiveComponent } from './replay-live.component';

describe('ReplayLiveComponent', () => {
  let component: ReplayLiveComponent;
  let fixture: ComponentFixture<ReplayLiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReplayLiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplayLiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
