import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesciplineComponent } from './descipline.component';

describe('DesciplineComponent', () => {
  let component: DesciplineComponent;
  let fixture: ComponentFixture<DesciplineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesciplineComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DesciplineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
