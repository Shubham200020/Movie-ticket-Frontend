import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatsInputComponent } from './seats-input.component';

describe('SeatsInputComponent', () => {
  let component: SeatsInputComponent;
  let fixture: ComponentFixture<SeatsInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeatsInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeatsInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
