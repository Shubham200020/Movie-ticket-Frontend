import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatGridComponent } from './seat-grid.component';

describe('SeatGridComponent', () => {
  let component: SeatGridComponent;
  let fixture: ComponentFixture<SeatGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeatGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeatGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
