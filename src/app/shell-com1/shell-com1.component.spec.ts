import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShellCom1Component } from './shell-com1.component';

describe('ShellCom1Component', () => {
  let component: ShellCom1Component;
  let fixture: ComponentFixture<ShellCom1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShellCom1Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShellCom1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
