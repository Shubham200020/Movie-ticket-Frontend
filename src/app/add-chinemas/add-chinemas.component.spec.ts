import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddChinemasComponent } from './add-chinemas.component';

describe('AddChinemasComponent', () => {
  let component: AddChinemasComponent;
  let fixture: ComponentFixture<AddChinemasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddChinemasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddChinemasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
