import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ALLusersbyclubComponent } from './allusersbyclub.component';

describe('ALLusersbyclubComponent', () => {
  let component: ALLusersbyclubComponent;
  let fixture: ComponentFixture<ALLusersbyclubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ALLusersbyclubComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ALLusersbyclubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
