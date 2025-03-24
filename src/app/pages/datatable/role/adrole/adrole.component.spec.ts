import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdroleComponent } from './adrole.component';

describe('AdroleComponent', () => {
  let component: AdroleComponent;
  let fixture: ComponentFixture<AdroleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdroleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdroleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
