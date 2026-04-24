import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheatorInputComponent } from './theator-input.component';

describe('TheatorInputComponent', () => {
  let component: TheatorInputComponent;
  let fixture: ComponentFixture<TheatorInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TheatorInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TheatorInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
