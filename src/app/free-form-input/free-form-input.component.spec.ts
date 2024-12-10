import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeFormInputComponent } from './free-form-input.component';

describe('FreeFormInputComponent', () => {
  let component: FreeFormInputComponent;
  let fixture: ComponentFixture<FreeFormInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FreeFormInputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FreeFormInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
