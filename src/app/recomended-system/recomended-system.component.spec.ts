import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecomendedSystemComponent } from './recomended-system.component';

describe('RecomendedSystemComponent', () => {
  let component: RecomendedSystemComponent;
  let fixture: ComponentFixture<RecomendedSystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecomendedSystemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecomendedSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
