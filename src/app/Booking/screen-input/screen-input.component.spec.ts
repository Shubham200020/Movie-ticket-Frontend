import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenInputComponent } from './screen-input.component';

describe('ScreenInputComponent', () => {
  let component: ScreenInputComponent;
  let fixture: ComponentFixture<ScreenInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScreenInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScreenInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
