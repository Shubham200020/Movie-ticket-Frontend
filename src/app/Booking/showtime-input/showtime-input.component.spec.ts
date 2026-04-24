import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowtimeInputComponent } from './showtime-input.component';

describe('ShowtimeInputComponent', () => {
  let component: ShowtimeInputComponent;
  let fixture: ComponentFixture<ShowtimeInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowtimeInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowtimeInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
