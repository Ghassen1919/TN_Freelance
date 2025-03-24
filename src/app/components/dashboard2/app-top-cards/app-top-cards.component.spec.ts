import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppTopCardsComponent } from './app-top-cards.component';

describe('AppTopCardsComponent', () => {
  let component: AppTopCardsComponent;
  let fixture: ComponentFixture<AppTopCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppTopCardsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppTopCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
