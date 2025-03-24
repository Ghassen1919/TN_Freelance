import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateclubComponent } from './updateclub.component';

describe('UpdateclubComponent', () => {
  let component: UpdateclubComponent;
  let fixture: ComponentFixture<UpdateclubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateclubComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateclubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
