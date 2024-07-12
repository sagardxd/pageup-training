import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LifecycleExampleComponent } from './lifecycle-example.component';

describe('LifecycleExampleComponent', () => {
  let component: LifecycleExampleComponent;
  let fixture: ComponentFixture<LifecycleExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LifecycleExampleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LifecycleExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
