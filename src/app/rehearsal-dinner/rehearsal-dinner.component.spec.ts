import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RehearsalDinnerComponent } from './rehearsal-dinner.component';

describe('RehearsalDinnerComponent', () => {
  let component: RehearsalDinnerComponent;
  let fixture: ComponentFixture<RehearsalDinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RehearsalDinnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RehearsalDinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
