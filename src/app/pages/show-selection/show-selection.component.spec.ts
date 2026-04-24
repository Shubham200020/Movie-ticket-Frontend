import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowSelectionComponent } from './show-selection.component';

describe('ShowSelectionComponent', () => {
  let component: ShowSelectionComponent;
  let fixture: ComponentFixture<ShowSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowSelectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
