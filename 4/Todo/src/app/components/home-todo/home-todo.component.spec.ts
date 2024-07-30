import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeTodoComponent } from './home-todo.component';

describe('HomeTodoComponent', () => {
  let component: HomeTodoComponent;
  let fixture: ComponentFixture<HomeTodoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeTodoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomeTodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
